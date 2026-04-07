# SearchBar

JSON 타입: `searchbar`
카테고리 선택, 검색어 입력, 초기화, 검색 실행을 단일 UI 안에서 제공하는 복합 검색 컴포넌트.

## 언제 쓰는가
- 목록 페이지에서 카테고리별 검색이 필요할 때
- 검색 대상 종류가 여러 개인 경우 (예: 이름/계좌번호/이메일)
- filterbar 위에 배치

## 구성 요소
- **A. Dropdown Field**: 검색 카테고리 선택. 선택된 카테고리에 따라 검색 범위가 달라짐. min-width: 100px, 높이 size별 고정 (32/40/48px)
- **B. Textfield**: 검색어 입력. Placeholder로 입력 가이드 제공. min-width: 180px, 높이 size별 고정 (32/40/48px)
- **C. Clear Button**: 입력 내용 한번에 삭제. 검색어가 입력되었을 때만 노출
- **D. Search Button**: 검색 실행. Disabled 제외 검색어 없어도 활성화. 돋보기 아이콘 사용

## 조합 예시
- `searchbar` + `filterbar` + `tab` → 목록 페이지 필터 영역
- `searchbar` → Top 아래 단독 배치
- `top` + `searchbar` + `tab` + `table` → 목록 페이지 전체 구조

## Props
| prop | 설명 |
|------|------|
| size | small / medium / large (기본 medium). 높이: small=32px, medium=40px, large=48px |

## 예시
```json
{ "type": "searchbar" }
{ "type": "searchbar", "size": "small" }
```

## 주의사항
- 내부 구조(Dropdown + Textfield + Clear + Search 버튼)는 고정 — 별도 props로 텍스트 변경 불가
- 카테고리, 검색어 등 동적 콘텐츠는 런타임에서 처리
- 정적 목업에서는 enabled 상태(빈 입력 필드)로 배치
- Dropdown Field와 Textfield의 너비는 디자인 시 자유롭게 조정 가능하나 min-width 준수
