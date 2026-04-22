// Claude Daemon — 대화형 Claude 프로세스를 유지하며 MCP 접근을 제공
const pty = require('node-pty');
const { EventEmitter } = require('events');

class ClaudeDaemon extends EventEmitter {
  constructor() {
    super();
    this.proc = null;
    this.ready = false;
    this.buffer = '';
    this.pending = null; // { resolve, reject, timeout }
  }

  start() {
    if (this.proc) return;

    console.log('[Daemon] Claude 대화형 세션 시작...');
    this.proc = pty.spawn('claude', ['--dangerously-skip-permissions'], {
      name: 'xterm-256color',
      cols: 200,
      rows: 50,
      env: { ...process.env, TERM: 'xterm-256color' },
    });

    this.proc.onData((data) => {
      this.buffer += data;
      this._processBuffer();
    });

    this.proc.onExit(({ exitCode }) => {
      console.log('[Daemon] Claude 프로세스 종료, exit code:', exitCode);
      this.proc = null;
      this.ready = false;
      // 자동 재시작
      setTimeout(() => this.start(), 3000);
    });

    // 초기화 대기 (MCP 연결 포함)
    setTimeout(() => {
      this.ready = true;
      console.log('[Daemon] Claude 세션 준비 완료');
      this.emit('ready');
    }, 10000);
  }

  _processBuffer() {
    if (!this.pending) return;

    // Claude 응답에서 ```json 블록 감지
    const jsonMatch = this.buffer.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[1]);
        this.pending.resolve(result);
        clearTimeout(this.pending.timeout);
        this.pending = null;
        this.buffer = '';
        return;
      } catch (e) {
        // JSON 파싱 실패 → 아직 수신 중일 수 있음
      }
    }

    // 오류 메시지 감지
    if (this.buffer.includes('인증이 필요합니다') || this.buffer.includes('Needs authentication')) {
      // OAuth URL 추출 시도
      const urlMatch = this.buffer.match(/(https:\/\/mcp\.notion\.com\/authorize[^\s"']+)/);
      if (urlMatch) {
        console.log('[Daemon] Notion OAuth 인증 필요. 브라우저에서 열어주세요:');
        console.log(urlMatch[1]);
        // 브라우저 자동 오픈
        const { exec } = require('child_process');
        exec(`open "${urlMatch[1]}"`);
      }
    }
  }

  async sendPrompt(prompt, timeoutMs = 180000) {
    if (!this.proc) throw new Error('Claude 데몬이 실행되지 않았습니다');

    return new Promise((resolve, reject) => {
      this.buffer = '';
      this.pending = {
        resolve,
        reject,
        timeout: setTimeout(() => {
          this.pending = null;
          reject(new Error('Claude 응답 타임아웃 (3분)'));
        }, timeoutMs),
      };

      // 프롬프트 전송 (Enter로 제출)
      this.proc.write(prompt + '\r');
    });
  }

  async readNotionAndDesign(notionUrl, systemPrompt) {
    const prompt = `${systemPrompt}

## 기획안 기반 멀티 화면 설계

먼저 이 Notion 페이지를 읽어줘: ${notionUrl}

그리고 기획안 내용을 분석해서 필요한 화면 플로우를 설계해줘.

### 작업 순서:
1. 위 Notion URL의 기획안을 notion-fetch 도구로 읽어
2. 기획안에서 필요한 화면들을 파악해
3. 사용자 플로우 순서대로 화면을 정렬해
4. 각 화면을 MOIN 디자인 시스템으로 설계해

### 출력 규칙:
- 반드시 아래 JSON 형식으로 출력
- screens 배열에 각 화면 JSON을 순서대로

\`\`\`json
{
  "flowName": "플로우 이름",
  "screens": [
    { "pageName": "화면1", "width": 1440, "height": 900, "sections": [...] },
    { "pageName": "화면2", "width": 1440, "height": 900, "sections": [...] }
  ]
}
\`\`\``;

    return this.sendPrompt(prompt);
  }

  stop() {
    if (this.proc) {
      this.proc.write('/exit\r');
      setTimeout(() => {
        if (this.proc) this.proc.kill();
      }, 2000);
    }
  }
}

module.exports = ClaudeDaemon;
