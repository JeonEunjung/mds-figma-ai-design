const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3333;
const PLUGIN_REF = path.join(__dirname, 'plugin_reference');

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

  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let prompt, imageBase64, designJson;
      try {
        const parsed = JSON.parse(body);
        prompt = parsed.prompt;
        imageBase64 = parsed.imageBase64;
        designJson = parsed.designJson;
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
      if (designJson) {
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

        try {
          const match = output.match(/```json\n([\s\S]*?)\n```/) || output.match(/(\{[\s\S]*\})/);
          if (!match) throw new Error('JSON을 찾을 수 없음. 응답: ' + output.substring(0, 300));

          const design = JSON.parse(match[1] || match[0]);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ design }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      child.on('error', err => {
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
