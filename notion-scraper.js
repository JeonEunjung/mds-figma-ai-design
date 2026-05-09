// Notion Page Scraper — Playwright 기반
// 브라우저 세션으로 Notion 페이지를 읽어 마크다운으로 변환
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, '.notion-session.json');

async function ensureSession() {
  // 저장된 세션이 있으면 재사용
  if (fs.existsSync(SESSION_FILE)) {
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  }
  return null;
}

async function loginAndSaveSession() {
  console.log('[Notion] 브라우저를 열어 Notion 로그인을 진행합니다...');
  const browser = await chromium.launch({ headless: false }); // 사용자에게 보이게
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.notion.so/login');
  console.log('[Notion] Notion에 로그인해주세요. 로그인 완료 후 자동으로 진행됩니다.');

  // 로그인 완료 대기 (대시보드나 워크스페이스 페이지가 뜰 때까지)
  await page.waitForURL(/notion\.so\/(?!login)/, { timeout: 300000 }); // 5분 대기
  console.log('[Notion] 로그인 완료! 세션을 저장합니다.');

  // 세션 상태 저장
  const storageState = await context.storageState();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(storageState));

  await browser.close();
  return storageState;
}

async function scrapeNotionPage(url) {
  let storageState = await ensureSession();

  // 세션이 없으면 로그인 진행
  if (!storageState) {
    storageState = await loginAndSaveSession();
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  try {
    console.log('[Notion] 페이지 로딩:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Notion 콘텐츠 로딩 대기
    await page.waitForSelector('.notion-page-content, [class*="page-content"], .layout-content', { timeout: 15000 })
      .catch(() => console.log('[Notion] 콘텐츠 셀렉터 타임아웃, 현재 상태로 추출 시도'));

    // 추가 렌더링 대기
    await page.waitForTimeout(3000);

    // 로그인 페이지로 리다이렉트됐는지 확인
    if (page.url().includes('/login')) {
      console.log('[Notion] 세션 만료. 재로그인 필요.');
      await browser.close();
      fs.unlinkSync(SESSION_FILE);
      storageState = await loginAndSaveSession();
      // 재시도
      const browser2 = await chromium.launch({ headless: true });
      const context2 = await browser2.newContext({ storageState });
      const page2 = await context2.newPage();
      await page2.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page2.waitForSelector('.notion-page-content, [class*="page-content"], .layout-content', { timeout: 15000 }).catch(() => {});
      await page2.waitForTimeout(3000);
      const content = await extractContent(page2);
      await browser2.close();
      return content;
    }

    const content = await extractContent(page);
    await browser.close();
    return content;

  } catch (err) {
    await browser.close();
    throw err;
  }
}

async function extractContent(page) {
  // Notion 페이지에서 텍스트 콘텐츠 추출
  const content = await page.evaluate(() => {
    function getTextContent(el, depth = 0) {
      const lines = [];
      const indent = '  '.repeat(depth);

      for (const node of el.childNodes) {
        // 텍스트 노드
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          if (text) lines.push(indent + text);
          continue;
        }

        if (node.nodeType !== 1) continue;
        const el = node;
        const tag = el.tagName.toLowerCase();
        const cls = el.className || '';

        // 숨겨진 요소 스킵
        if (el.offsetParent === null && tag !== 'body' && tag !== 'html') continue;

        // Notion 블록 타입별 처리
        if (tag === 'h1' || cls.includes('header-block') && cls.includes('notion-header')) {
          lines.push('\n# ' + el.textContent.trim());
        } else if (tag === 'h2' || cls.includes('sub_header')) {
          lines.push('\n## ' + el.textContent.trim());
        } else if (tag === 'h3' || cls.includes('sub_sub_header')) {
          lines.push('\n### ' + el.textContent.trim());
        } else if (tag === 'table') {
          // 테이블 추출
          const rows = el.querySelectorAll('tr');
          for (const row of rows) {
            const cells = [...row.querySelectorAll('td, th')].map(c => c.textContent.trim());
            lines.push('| ' + cells.join(' | ') + ' |');
          }
        } else if (tag === 'li' || cls.includes('bulleted_list') || cls.includes('numbered_list')) {
          const bullet = cls.includes('numbered') ? '1. ' : '- ';
          lines.push(indent + bullet + el.textContent.trim());
        } else if (cls.includes('to_do')) {
          const checked = el.querySelector('[aria-checked="true"]') ? '[x]' : '[ ]';
          lines.push(indent + checked + ' ' + el.textContent.trim());
        } else if (cls.includes('toggle')) {
          lines.push(indent + '> ' + el.textContent.trim());
        } else if (cls.includes('callout')) {
          lines.push(indent + '> ' + el.textContent.trim());
        } else if (cls.includes('code')) {
          lines.push('```\n' + el.textContent.trim() + '\n```');
        } else if (cls.includes('divider')) {
          lines.push('---');
        } else if (tag === 'p' || cls.includes('text-block')) {
          const text = el.textContent.trim();
          if (text) lines.push(indent + text);
        } else {
          // 재귀 탐색
          const childContent = getTextContent(el, depth);
          if (childContent) lines.push(childContent);
        }
      }

      return lines.join('\n');
    }

    // 페이지 제목
    const titleEl = document.querySelector('[data-block-id] h1, .notion-page-block .notranslate, [placeholder="Untitled"]');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // 본문 콘텐츠
    const contentEl = document.querySelector('.notion-page-content') ||
                      document.querySelector('[class*="page-content"]') ||
                      document.querySelector('.layout-content') ||
                      document.body;

    const body = getTextContent(contentEl);

    return (title ? '# ' + title + '\n\n' : '') + body;
  });

  console.log('[Notion] 추출 완료:', content.length, '자');
  return content;
}

module.exports = { scrapeNotionPage, loginAndSaveSession, ensureSession };
