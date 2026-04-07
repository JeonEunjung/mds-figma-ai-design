# DropdownMenu

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/form/DropdownMenu/index.tsx

## 언제 쓰는가
- 값 선택이 아닌 액션 메뉴가 필요할 때 (Dropdown과의 차이)
- 버튼 클릭 시 액션 목록을 드롭다운으로 표시 (내보내기, 편집, 삭제 등)
- 값 상태가 없고 항목 클릭 시 액션만 실행하면 될 때

## 조합 예시
- `DropdownMenu(label="더보기")` + 항목 목록 → 테이블 행 액션 메뉴
- `DropdownMenu` + `MdsTop.right` → 페이지 헤더 추가 액션 버튼
- `DropdownMenu` + `IconButton(트리거)` → 아이콘으로 메뉴 열기

## Props 요약
| prop | type | 설명 |
|------|------|------|
| label | `string` | 트리거 버튼 텍스트 (필수) |
| buttonSize | `"sm" \| "md" \| "lg"` | 트리거 버튼 크기 (필수) |
| menus | `{ items: MenuItem[], size: "sm" \| "md" \| "lg" }` | 메뉴 항목 목록 (필수) |
| prefix | `IconType \| ReactNode` | 트리거 버튼 왼쪽 아이콘 |
| disabled | `boolean` | 트리거 버튼 비활성 |

### menus.items 구조
| 필드 | type | 설명 |
|---|---|---|
| label | `string` | 메뉴 항목 텍스트 |
| onClick | `() => void` | 클릭 핸들러 |
| disabled | `boolean` | 항목 비활성 |

## 주의사항
- Dropdown과 달리 선택값(value/onChange)이 없음 — 순수 액션 메뉴
- 내부적으로 Radix UI DropdownMenu 기반
- 조합 서브컴포넌트: `MdsDropdownMenu.Root`, `MdsDropdownMenu.Trigger`, `MdsDropdownMenu.Content`, `MdsDropdownMenu.Item`
