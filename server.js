const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { execSync } = require('child_process');
const { scrapeNotionPage, loginAndSaveSession, ensureSession } = require('./notion-scraper');

const PORT = 3333;
const PLUGIN_REF = path.join(__dirname, 'plugin_reference');
const ERROR_REPORT_URL = 'https://error-reporter.vercel.app/api/report';

// ─── Notion API (fallback) ───────────────────────────────────────────────────
const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_VERSION = '2022-06-28';

function notionFetch(endpoint) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.notion.com' + endpoint);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + NOTION_TOKEN,
        'Notion-Version': NOTION_VERSION,
      },
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error('Notion API ' + res.statusCode + ': ' + body.substring(0, 300)));
          return;
        }
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Notion JSON 파싱 실패')); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function extractPageId(url) {
  // https://www.notion.so/workspace/Title-abc123 또는 ?v=... 등
  const clean = url.split('?')[0].split('#')[0];
  const match = clean.match(/([a-f0-9]{32})$/) || clean.match(/([a-f0-9-]{36})$/);
  if (match) {
    const raw = match[1].replace(/-/g, '');
    return raw.slice(0,8) + '-' + raw.slice(8,12) + '-' + raw.slice(12,16) + '-' + raw.slice(16,20) + '-' + raw.slice(20);
  }
  return null;
}

function richTextToPlain(richTexts) {
  return (richTexts || []).map(t => t.plain_text || '').join('');
}

function blockToText(block, depth) {
  depth = depth || 0;
  const indent = '  '.repeat(depth);
  const type = block.type;
  const data = block[type];
  if (!data) return '';

  let text = '';
  const rt = richTextToPlain(data.rich_text || data.text);

  switch (type) {
    case 'heading_1': text = indent + '# ' + rt; break;
    case 'heading_2': text = indent + '## ' + rt; break;
    case 'heading_3': text = indent + '### ' + rt; break;
    case 'paragraph': text = indent + rt; break;
    case 'bulleted_list_item': text = indent + '- ' + rt; break;
    case 'numbered_list_item': text = indent + '1. ' + rt; break;
    case 'to_do':
      text = indent + (data.checked ? '[x] ' : '[ ] ') + rt; break;
    case 'toggle': text = indent + '▸ ' + rt; break;
    case 'quote': text = indent + '> ' + rt; break;
    case 'callout': text = indent + '💡 ' + rt; break;
    case 'code': text = indent + '```\n' + rt + '\n```'; break;
    case 'divider': text = indent + '---'; break;
    case 'table_row':
      text = indent + '| ' + (data.cells || []).map(c => richTextToPlain(c)).join(' | ') + ' |'; break;
    default:
      if (rt) text = indent + rt;
  }
  return text;
}

async function fetchAllBlocks(pageId) {
  let blocks = [];
  let cursor = undefined;
  do {
    const endpoint = '/v1/blocks/' + pageId + '/children?page_size=100' + (cursor ? '&start_cursor=' + cursor : '');
    const resp = await notionFetch(endpoint);
    blocks = blocks.concat(resp.results || []);
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  // 하위 블록 재귀 탐색 (toggle, callout 등)
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].has_children) {
      blocks[i]._children = await fetchAllBlocks(blocks[i].id);
    }
  }
  return blocks;
}

function blocksToMarkdown(blocks, depth) {
  depth = depth || 0;
  let lines = [];
  for (const block of blocks) {
    const line = blockToText(block, depth);
    if (line) lines.push(line);
    if (block._children) {
      lines.push(blocksToMarkdown(block._children, depth + 1));
    }
  }
  return lines.join('\n');
}

function reportErrorToGitHub({ prompt, error, mode, claudeOutput }) {
  const https = require('https');
  const postData = JSON.stringify({ prompt, error, mode, claudeOutput });

  const url = new URL(ERROR_REPORT_URL);
  const req = https.request({
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }, (res) => {
    if (res.statusCode === 200) {
      console.log('[Error Report] GitHub Issue 생성 완료');
    } else {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => console.warn('[Error Report] 실패:', res.statusCode, body.substring(0, 200)));
    }
  });
  req.on('error', (e) => console.warn('[Error Report] 요청 실패:', e.message));
  req.write(postData);
  req.end();
}

// 서버 시작 시 자동 업데이트
try {
  const result = execSync('git pull', { cwd: __dirname, timeout: 10000 }).toString().trim();
  if (result !== 'Already up to date.') {
    console.log('[Auto-update]', result);
  }
} catch (e) {
  console.warn('[Auto-update] git pull 실패 — 기존 버전으로 실행합니다:', e.message);
}

// 1시간마다 자동 업데이트 확인 → 변경 있으면 서버 자동 재시작
setInterval(() => {
  try {
    const result = execSync('git pull', { cwd: __dirname, timeout: 10000 }).toString().trim();
    if (result !== 'Already up to date.') {
      console.log('[Auto-update] 코드 변경 감지, 서버 재시작합니다...', result);
      // 새 프로세스로 서버 다시 실행 후 현재 프로세스 종료
      const child = spawn('node', ['server.js'], {
        cwd: __dirname,
        detached: true,
        stdio: 'inherit',
      });
      child.unref();
      process.exit(0);
    }
  } catch (e) {
    // git pull 실패는 무시
  }
}, 60 * 60 * 1000);

function loadRef(basePath) {
  const sections = [
    { dir: 'Principles', label: '## Design Principles' },
    { dir: 'Component',  label: '## Components' },
    { dir: 'Atom',       label: '## Atoms' },
    { dir: 'Foundation', label: '## Foundation' },
  ];
  let result = '';
  for (const section of sections) {
    const dirPath = path.join(basePath, section.dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    if (files.length === 0) continue;
    result += '\n\n' + section.label + '\n';
    for (const file of files) {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      result += '\n### ' + file.replace('.md', '') + '\n' + content;
    }
  }
  return result;
}

const DESIGN_REFERENCE = loadRef(PLUGIN_REF);

// Claude Code에서 푸시한 디자인을 Figma 플러그인이 가져감
let pendingDesigns = null;

const SYSTEM_PROMPT = `You are an AI designer for MOIN, a B2B remittance/payment SaaS platform.
Output ONLY a valid JSON object wrapped in \`\`\`json ... \`\`\` block. No explanation.

## MOIN Design System Reference
The following is the complete design system specification. Use ONLY components defined here.
${DESIGN_REFERENCE}

---

## Figma JSON Output Rules
- Use ONLY component types defined in the design system above. Do NOT invent new component types.
- Available section types: lnb, main, card, top, table, searchbar, filterbar, tab, modal
  - searchbar: 검색 바 (props: none)
  - filterbar: 드롭다운 필터 모음 (props: dropdowns[{placeholder}])
  - tab: 탭 네비게이션 (props: items["전체","처리중","완료","실패"])
  - chipgroup: 칩 그룹 (props: items["라벨1","라벨2"] 또는 [{label, selected}])
    언제 써야 하나: "칩", "chip", "태그 필터", "카테고리 선택" 등 선택형 필터가 필요할 때 반드시 사용
    예시: { "type": "chipgroup", "items": ["전체", "처리중", "완료", "실패"] }
  - spinner: 로딩 스피너 (props: size: 32|48|64)
    언제 써야 하나: 로딩 상태 화면, 처리 중 표시
  - breadcrumb: 경로 탐색 (props: none)
    언제 써야 하나: 상세 페이지, 설정 하위 페이지 등 depth가 있는 페이지
  - modal: 모달 오버레이 — sections 최상위에 lnb/main과 같은 레벨로 추가
    props: { title, description, ctaLabel, dismissLabel }
    - title: 모달 제목 (행동 동사로 시작, 예: "송금 신청", "승인 확인", "삭제 확인")
    - description: 사용자가 결정해야 할 내용 1-2줄 (예: "선택한 3건을 송금 신청합니다. 신청 후 취소가 불가합니다.")
    - ctaLabel: 주요 액션 버튼 (예: "신청하기", "확인", "삭제")
    - dismissLabel: 취소 버튼 (예: "취소", "돌아가기")
- 화면당 Primary 버튼 최대 1개. 나머지는 Secondary/Tertiary.
- 한 영역에 동시 노출 선택지 4개 이하 유지 (버튼, 탭, 필터 등).
- 매번 같은 레이아웃(Top+Table) 반복 금지. 화면 목적에 맞게 구성 변경.
## Custom 요소 토큰 규칙
custom type으로 텍스트/프레임을 직접 만들 때, 반드시 Foundation 토큰 값만 사용할 것:
- 색상: Colors.md에 정의된 hex 값만 사용 (임의 색상 금지)
- 타이포: Typography.md의 size/weight/lineHeight 조합만 사용
- 간격: Typography.md의 간격 토큰 (4, 8, 16, 24) 만 사용

- All pages: LNB + Main content area
- LNB menu items MUST use only: 당발송금, 타발송금, 잔액, 집금관리, 문의, 설정, 내 계정
- Sub-pages (e.g. 대량송금) → set parent menu active (e.g. 당발송금)

## JSON Schema
\`\`\`json
{
  "pageName": "화면 이름",
  "width": 1440,
  "height": 900,
  "sections": [
    {
      "type": "lnb",
      "menuItems": [{ "label": "메뉴명", "active": false }]
    },
    {
      "type": "main",
      "padding": 16,
      "gap": 16,
      "children": [
        {
          "type": "card",
          "title": "카드 제목",
          "children": [
            {
              "type": "top",
              "size": "large",
              "title": "섹션 제목",
              "description": "총 0건",
              "rightButtons": [{ "label": "내보내기", "variant": "tertiary" }]
            },
            {
              "type": "table",
              "state": "default",
              "rowCount": 3,
              "columns": [
                { "label": "컬럼명", "width": 120, "type": "text" },
                { "label": "컬럼명", "width": "fill", "type": "text" },
                { "label": "상태", "width": 100, "type": "badge" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
\`\`\``;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // ─── 디자인 푸시/폴링 (Claude Code → Figma 플러그인) ───────────────────────
  if (req.method === 'POST' && req.url === '/push-designs') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        pendingDesigns = data;
        console.log('[Push] 디자인 수신:', data.flowName, '—', (data.designs || []).length + '개 화면');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/pending-designs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (pendingDesigns) {
      const data = pendingDesigns;
      pendingDesigns = null;
      res.end(JSON.stringify(data));
    } else {
      res.end(JSON.stringify({}));
    }
    return;
  }

  // ─── Notion 기획안 → 멀티 화면 생성 ─────────────────────────────────────────
  // ─── Notion 로그인 (첫 사용 시) ─────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/notion-login') {
    loginAndSaveSession()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // ─── Notion 세션 상태 확인 ──────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/notion-status') {
    const hasSession = fs.existsSync(path.join(__dirname, '.notion-session.json'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ connected: hasSession }));
    return;
  }

  // ─── Notion 기획안 → 멀티 화면 생성 (Playwright) ────────────────────────────
  if (req.method === 'POST' && req.url === '/generate-from-notion') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      let notionUrl;
      try {
        const parsed = JSON.parse(body);
        notionUrl = parsed.notionUrl;
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      if (!notionUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'notionUrl is required' }));
        return;
      }

      console.log('[Notion] 기획안 요청:', notionUrl);

      // 1) Playwright로 기획안 내용 읽기
      let notionContent;
      try {
        notionContent = await scrapeNotionPage(notionUrl);
        if (!notionContent || notionContent.length < 50) {
          throw new Error('페이지 내용을 충분히 추출하지 못했습니다. Notion에 로그인이 필요할 수 있어요.');
        }
        console.log('[Notion] 기획안 읽기 완료:', notionContent.length, '자');
      } catch (err) {
        console.error('[Notion] 스크래핑 오류:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Notion 페이지 읽기 실패: ' + err.message, needsLogin: !fs.existsSync(path.join(__dirname, '.notion-session.json')) }));
        return;
      }

      // 2) 기획안 내용을 Claude에 넘겨서 화면 설계
      const notionPrompt = SYSTEM_PROMPT + `

## 기획안 기반 멀티 화면 설계

아래는 Notion에서 가져온 기획안 내용이야. 이걸 분석해서 필요한 화면 플로우를 설계해줘.

### 기획안 내용:
${notionContent}

### 작업 순서:
1. 기획안에서 필요한 화면들을 파악해 (목록, 상세, 입력폼, 확인 모달 등)
2. 사용자 플로우 순서대로 화면을 정렬해
3. 각 화면을 MOIN 디자인 시스템으로 설계해

### 출력 규칙:
- 반드시 아래 JSON 형식으로 출력 (다른 텍스트 없이)
- screens 배열에 각 화면 JSON을 플로우 순서대로 넣어
- 각 화면은 기존 스키마와 동일한 구조 (pageName, width, height, sections)
- 화면 간 연결이 자연스럽도록 LNB 활성 메뉴를 일관되게 유지

\`\`\`json
{
  "flowName": "플로우 이름",
  "screens": [
    {
      "pageName": "화면1 이름",
      "width": 1440,
      "height": 900,
      "sections": [...]
    },
    {
      "pageName": "화면2 이름",
      "width": 1440,
      "height": 900,
      "sections": [...]
    }
  ]
}
\`\`\``;

      const child = spawn('claude', ['-p', notionPrompt], {
        env: { ...process.env },
        timeout: 180000,
      });

      let output = '';
      let errOutput = '';

      child.stdout.on('data', data => output += data.toString());
      child.stderr.on('data', data => errOutput += data.toString());

      child.on('close', code => {
        if (errOutput) console.error('[Claude stderr]', errOutput.substring(0, 500));
        console.log('[Claude exit code]', code, '[output length]', output.length);

        try {
          const match = output.match(/```json\n([\s\S]*?)\n```/) || output.match(/(\{[\s\S]*\})/);
          if (!match) throw new Error('JSON을 찾을 수 없음. 응답: ' + output.substring(0, 500));

          const result = JSON.parse(match[1] || match[0]);

          if (result.screens && Array.isArray(result.screens)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ flowName: result.flowName, designs: result.screens }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ flowName: result.pageName || '화면', designs: [result] }));
          }
        } catch (err) {
          console.error('[Parse error]', err.message);
          reportErrorToGitHub({ prompt: 'Notion: ' + notionUrl, error: err.message, mode: '기획안', claudeOutput: output });
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      child.on('error', err => {
        reportErrorToGitHub({ prompt: 'Notion: ' + notionUrl, error: 'claude CLI 실행 실패: ' + err.message, mode: '기획안' });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'claude CLI 실행 실패: ' + err.message }));
      });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let prompt, imageBase64, designJson, partialJson, jsonPath;
      try {
        const parsed = JSON.parse(body);
        prompt = parsed.prompt;
        imageBase64 = parsed.imageBase64;
        designJson = parsed.designJson;
        partialJson = parsed.partialJson;
        jsonPath = parsed.jsonPath;
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      // 이미지가 있으면 임시 파일로 저장
      let imagePath = null;
      if (imageBase64) {
        imagePath = path.join(os.tmpdir(), 'moin_frame_' + Date.now() + '.png');
        fs.writeFileSync(imagePath, Buffer.from(imageBase64, 'base64'));
      }

      let fullPrompt;
      if (partialJson) {
        fullPrompt = SYSTEM_PROMPT + `

## 부분 편집 요청

아래는 화면의 특정 컴포넌트 JSON이야 (경로: ${jsonPath}):
\`\`\`json
${partialJson}
\`\`\`

이 컴포넌트 JSON만 수정해서 반환해줘.
- 전체 화면 JSON이 아니라 이 컴포넌트 부분만 반환
- type 필드는 그대로 유지
- 요청한 변경사항만 적용하고 나머지는 그대로

변경 요청: ${prompt}`;
      } else if (designJson) {
        fullPrompt = SYSTEM_PROMPT + `

## 편집 요청

아래는 현재 화면의 JSON이야:
\`\`\`json
${designJson}
\`\`\`

이 JSON을 기반으로, 아래 변경사항만 적용해서 수정된 JSON을 반환해줘.
기본 구조(LNB, 페이지 제목, 테이블 컬럼 등)는 그대로 유지하고 요청한 부분만 바꿔.

변경 요청: ${prompt}`;
      } else if (imagePath) {
        fullPrompt = SYSTEM_PROMPT + `

## 베리에이션 요청

레퍼런스 이미지: ${imagePath}

위 이미지는 기존 화면이야. 아래 규칙을 반드시 지켜:
1. LNB 메뉴 구성, 활성 메뉴, 테이블 컬럼, 페이지 제목 등 기본 구조는 레퍼런스와 동일하게 유지
2. 아래 베리에이션 요청 사항만 추가/변경해서 JSON을 만들어줘
3. 레퍼런스에 없는 내용은 임의로 추가하지 마

베리에이션 요청: ${prompt}`;
      } else {
        fullPrompt = SYSTEM_PROMPT + '\n\n다음 화면을 JSON으로 설계해줘: ' + prompt;
      }

      const child = spawn('claude', ['-p', fullPrompt], {
        env: { ...process.env },
        timeout: 60000,
      });

      let output = '';
      let errOutput = '';

      child.stdout.on('data', data => output += data.toString());
      child.stderr.on('data', data => errOutput += data.toString());

      child.on('close', code => {
        // 임시 이미지 파일 삭제
        if (imagePath) { try { fs.unlinkSync(imagePath); } catch(e) {} }

        if (errOutput) console.error('[Claude stderr]', errOutput.substring(0, 500));
        console.log('[Claude exit code]', code, '[output length]', output.length);

        try {
          const match = output.match(/```json\n([\s\S]*?)\n```/) || output.match(/(\{[\s\S]*\})/);
          if (!match) throw new Error('JSON을 찾을 수 없음. 응답: ' + output.substring(0, 500));

          const design = JSON.parse(match[1] || match[0]);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ design }));
        } catch (err) {
          console.error('[Parse error]', err.message);
          reportErrorToGitHub({ prompt, error: err.message, mode: designJson ? '편집' : partialJson ? '부분편집' : '생성', claudeOutput: output });
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      child.on('error', err => {
        reportErrorToGitHub({ prompt, error: 'claude CLI 실행 실패: ' + err.message, mode: designJson ? '편집' : partialJson ? '부분편집' : '생성' });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'claude CLI 실행 실패: ' + err.message }));
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`MOIN AI Design 서버 실행 중: http://localhost:${PORT}`);
  console.log('Plugin reference 로드됨: ' + PLUGIN_REF);
});
