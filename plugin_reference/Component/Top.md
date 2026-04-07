# Top

JSON 타입: `top`
페이지나 화면 내 구역을 구분하고, 제목과 부가 설명을 함께 제공하는 컴포넌트. 필요 시 액션 버튼이나 필터 등 보조 컴포넌트를 함께 배치.

## 언제 쓰는가
- 페이지 또는 카드 섹션의 제목과 설명을 표시할 때
- 오른쪽에 액션 버튼(내보내기, 추가 등)을 배치해야 할 때
- 목록 건수(총 N건) 표시가 필요할 때

## 구성 요소
- **A. Title**: 섹션 주제 텍스트. 항상 표시. `Title#6398:0` TEXT 프로퍼티로 제어
- **B. Description** (Optional): 보조 설명 텍스트. `Description#6398:5` TEXT, `show description#6398:10` BOOLEAN으로 표시/숨김
- **C. Component** (Optional): 우측 보조 요소 영역 — 버튼, 드롭다운, 토글 등 배치. Horizontal Layout 슬롯

## size별 사양
| size | 높이 | Title 폰트 | 용도 |
|------|------|-----------|------|
| xlarge | 62px | Bold 32px | 페이지 최상단 대제목 |
| large | 56px | Bold 28px | 페이지 헤더 또는 주요 섹션 제목 |
| medium | 48px | Bold 24px | 카드 내부 섹션 제목 |
| small | 44px | Bold 20px | 서브 섹션 또는 보조 제목 |

## 조합 예시
- `top(size="xlarge")` → 페이지 최상단 대제목
- `top(size="large")` + rightButtons → 페이지 헤더 (제목 + 액션 버튼)
- `top(size="medium")` + description("총 N건") + rightButtons → 카드 내 섹션 헤더
- `top` + `searchbar` + `tab` + `table` → 목록 페이지 전체 구조

## Props
| prop | 설명 |
|------|------|
| size | xlarge / large / medium / small (필수) |
| title | 섹션 제목 |
| description | 부제목 (예: "총 124건") |
| rightButtons | 오른쪽 버튼 배열 `[{ label, variant }]` |

## 예시
```json
{ "type": "top", "size": "large", "title": "당발송금 목록", "description": "총 124건",
  "rightButtons": [{ "label": "엑셀 다운로드", "variant": "tertiary2" }, { "label": "송금 신청", "variant": "primary" }] }
{ "type": "top", "size": "xlarge", "title": "대시보드" }
{ "type": "top", "size": "medium", "title": "최근 거래 내역", "description": "총 5건" }
```

## 주의사항
- size는 필수이며 Title/Description 폰트 크기와 컨테이너 높이를 결정
- 내부 레이아웃은 가로 정렬 — Title/Description이 왼쪽, Component(rightButtons)가 오른쪽 끝
- rightButtons의 variant는 Button의 variant 규칙을 따름 (primary는 1개만)
- Description이 없으면 `show description` boolean이 false로 설정되어 영역 자체가 숨겨짐
