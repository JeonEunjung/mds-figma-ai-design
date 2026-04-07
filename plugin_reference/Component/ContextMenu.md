# ContextMenu

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/overlay/ContextMenu/index.tsx

## 언제 쓰는가
- 테이블 행 우클릭 또는 버튼 클릭 시 컨텍스트 액션 메뉴가 필요할 때
- 복수의 액션 항목을 팝업 메뉴로 제공할 때
- 아이템 체크박스, 라디오, 검색 기능이 있는 복잡한 메뉴

## 조합 예시
- `ContextMenu` + `ContextMenuTrigger` + `ContextMenuContent` + `ContextMenuItem` 목록 → 기본 컨텍스트 메뉴
- `ContextMenuSub` + `ContextMenuSubTrigger` + `ContextMenuSubContent` → 서브메뉴
- `ContextMenuSearchBar` → 검색 가능한 필터 메뉴

## Props 요약 (exported 컴포넌트)

| 컴포넌트 | 설명 |
|---|---|
| `MdsContextMenu` | Root (Radix DropdownMenu.Root) |
| `MdsContextMenuTrigger` | 메뉴를 여는 트리거 |
| `MdsContextMenuContent` | 메뉴 패널 |
| `MdsContextMenuItem` | 일반 메뉴 항목 |
| `MdsContextMenuCheckboxItem` | 체크박스 항목 |
| `MdsContextMenuRadioGroup` + `MdsContextMenuRadioItem` | 라디오 항목 |
| `MdsContextMenuLabel` | 그룹 레이블 |
| `MdsContextMenuSeparator` | 구분선 |
| `MdsContextMenuShortcut` | 단축키 표시 |
| `MdsContextMenuSearchBar` | 검색 가능한 헤더 |
| `MdsContextMenuSub` + `MdsContextMenuSubTrigger` + `MdsContextMenuSubContent` | 서브메뉴 |

### MdsContextMenuItem Props
| prop | type | 설명 |
|---|---|---|
| inset | `boolean` | 왼쪽 패딩 추가 (아이콘 있는 항목과 정렬 시) |
| disabled | `boolean` | 비활성 |

## 주의사항
- 내부에서 `SearchContext`를 통해 검색 텍스트 필터링 가능 (`MdsContextMenuSearchBar` 사용 시)
- Radix UI `@radix-ui/react-dropdown-menu` 기반
