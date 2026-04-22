// MCP OAuth 자동 온보딩 플로우
//
// stream-json 모드(-p)에서는 OAuth 브라우저 플로우를 못 돌림.
// 이 모듈만 한정적으로 node-pty + 대화형 claude를 이용해서:
//   1. 대화형 claude 띄우기
//   2. `/mcp` 슬래시 커맨드 전송
//   3. 대상 MCP 선택 + "Authenticate" 트리거
//   4. stdout에서 OAuth URL 파싱
//   5. `open "url"`로 Chrome 자동 실행
//   6. 유저가 승인 → claude 내장 콜백 리스너가 자동 수신
//   7. "Connected" / "Authenticated" 메시지 감지
//   8. `/quit`으로 종료
//
// 주의: 출력 파싱이 claude CLI 버전에 따라 깨질 수 있음.
// 실패 시 에러 이벤트로 통지하고, 유저에게 수동 안내로 fallback.

const { EventEmitter } = require('events');
const { exec } = require('child_process');

let pty;
try {
  pty = require('node-pty');
} catch (e) {
  // node-pty 미설치 시에도 모듈 로드는 허용 (status 반환만 가능)
}

// ANSI 이스케이프 제거 — 파싱 전 처리용
function stripAnsi(s) {
  // \x1B[... 류 제어 시퀀스 제거
  return s.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
          .replace(/\x1B\][^\x07]*\x07/g, '')
          .replace(/\r/g, '');
}

class McpAuthFlow extends EventEmitter {
  constructor(options) {
    super();
    this.serverName = (options && options.serverName) || 'notion';
    this.timeoutMs = (options && options.timeoutMs) || 5 * 60 * 1000;
    this.proc = null;
    this.rawBuffer = '';
    this.state = 'idle'; // idle | starting | awaiting_url | awaiting_approval | success | error
    this.authUrl = null;
    this._timeout = null;
  }

  isAvailable() {
    return !!pty;
  }

  start() {
    if (!pty) {
      const err = new Error('node-pty가 설치되어 있지 않아 자동 인증 플로우를 실행할 수 없습니다. `npm install` 먼저 해주세요.');
      this.state = 'error';
      setImmediate(() => this.emit('error', err));
      return;
    }
    if (this.proc) {
      this.emit('error', new Error('이미 진행 중인 인증 플로우가 있습니다.'));
      return;
    }

    this.state = 'starting';
    console.log('[Auth] Claude 대화형 세션 시작 (MCP 인증용)');

    this.proc = pty.spawn('claude', [], {
      name: 'xterm-256color',
      cols: 200,
      rows: 50,
      env: { ...process.env, TERM: 'xterm-256color' },
    });

    this.proc.onData((data) => this._onData(data));
    this.proc.onExit(({ exitCode }) => {
      console.log('[Auth] Claude 프로세스 종료, code:', exitCode);
      if (this.state !== 'success' && this.state !== 'error') {
        this.state = 'error';
        this.emit('error', new Error('Claude가 예상보다 먼저 종료됨 (code=' + exitCode + ')'));
      }
      this._cleanupTimers();
      this.proc = null;
    });

    // 전체 플로우 타임아웃
    this._timeout = setTimeout(() => {
      if (this.state !== 'success' && this.state !== 'error') {
        this.state = 'error';
        this.emit('error', new Error('인증 플로우 타임아웃 (' + (this.timeoutMs/1000) + 's)'));
        this._killProc();
      }
    }, this.timeoutMs);

    // Claude가 준비될 때까지 잠시 대기 후 /mcp 전송
    setTimeout(() => {
      if (!this.proc) return;
      this.state = 'awaiting_url';
      console.log('[Auth] /mcp 커맨드 전송');
      this._write('/mcp\r');
    }, 2500);
  }

  _onData(data) {
    this.rawBuffer += data;
    // 버퍼가 너무 커지면 앞부분 잘라서 메모리 절약
    if (this.rawBuffer.length > 50000) {
      this.rawBuffer = this.rawBuffer.slice(-30000);
    }
    const clean = stripAnsi(this.rawBuffer);

    // 단계 1: OAuth URL 추출
    if (!this.authUrl) {
      // 다양한 형태 지원
      const patterns = [
        /(https:\/\/mcp\.notion\.com\/authorize[^\s"'<>]+)/,
        /(https:\/\/notion\.so\/oauth\/authorize[^\s"'<>]+)/,
        /(https:\/\/api\.notion\.com\/v1\/oauth\/authorize[^\s"'<>]+)/,
        /(https:\/\/[^\s"'<>]*\/authorize\?[^\s"'<>]+)/,
      ];
      for (const re of patterns) {
        const m = clean.match(re);
        if (m) {
          this.authUrl = m[1];
          this.state = 'awaiting_approval';
          console.log('[Auth] ✅ OAuth URL 감지:', this.authUrl.substring(0, 80) + '...');
          // 기본 브라우저로 자동 열기 (macOS)
          exec('open "' + this.authUrl.replace(/"/g, '\\"') + '"', (err) => {
            if (err) console.warn('[Auth] 브라우저 자동 열기 실패:', err.message);
          });
          this.emit('url', this.authUrl);
          break;
        }
      }

      // URL 못 찾았는데 Notion 관련 프롬프트가 뜨면 선택지 자동 입력 시도
      // (예: "Select MCP server to manage:" 같은 메뉴)
      if (!this.authUrl && /select.*mcp|which.*server|manage.*mcp/i.test(clean) && !this._selectedMenu) {
        this._selectedMenu = true;
        setTimeout(() => {
          // "notion" 타이핑 후 엔터 — 퍼지 매칭으로 선택됨
          this._write(this.serverName + '\r');
        }, 500);
      }

      // "Authenticate" / "Connect" 버튼/선택 요청 감지
      if (!this.authUrl && /authenticate|connect|auth/i.test(clean) && !this._triggeredAuth) {
        if (/\[y\/n\]|\(y\/n\)|press.*enter/i.test(clean)) {
          this._triggeredAuth = true;
          setTimeout(() => this._write('y\r'), 500);
        }
      }
    }

    // 단계 2: 인증 완료 감지
    if (this.state === 'awaiting_approval') {
      const connectedPatterns = [
        /\bconnected\b/i,
        /authenticated?\s+successfully/i,
        /인증.*완료/,
        /successfully\s+authenticat/i,
        /MCP.*ready/i,
      ];
      const succeeded = connectedPatterns.some(re => re.test(clean));
      if (succeeded) {
        this.state = 'success';
        console.log('[Auth] ✅ 인증 완료 감지');
        this.emit('success');
        // /quit으로 정상 종료
        setTimeout(() => {
          this._write('\x1B'); // ESC로 메뉴 닫기
          setTimeout(() => {
            this._write('/quit\r');
            setTimeout(() => this._killProc(), 1500);
          }, 300);
        }, 500);
      }

      const failedPatterns = [
        /authentication.*failed/i,
        /auth.*error/i,
        /인증.*실패/,
        /error.*connecting/i,
      ];
      if (failedPatterns.some(re => re.test(clean))) {
        this.state = 'error';
        this.emit('error', new Error('인증 실패 — Claude 출력 확인 필요'));
        this._killProc();
      }
    }
  }

  _write(s) {
    if (this.proc) {
      try { this.proc.write(s); }
      catch (e) { console.warn('[Auth] write 실패:', e.message); }
    }
  }

  _killProc() {
    if (this.proc) {
      try { this.proc.kill(); } catch (e) {}
      this.proc = null;
    }
  }

  _cleanupTimers() {
    if (this._timeout) { clearTimeout(this._timeout); this._timeout = null; }
  }

  cancel() {
    if (this.state !== 'success' && this.state !== 'error') {
      this.state = 'error';
      this.emit('error', new Error('사용자가 취소함'));
    }
    this._cleanupTimers();
    this._killProc();
  }

  status() {
    return {
      state: this.state,
      serverName: this.serverName,
      authUrl: this.authUrl,
      running: !!this.proc,
    };
  }
}

module.exports = McpAuthFlow;
