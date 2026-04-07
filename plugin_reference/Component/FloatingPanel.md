# FloatingPanel

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/overlay/FloatingPanel/index.tsx

## 언제 쓰는가
- 화면 위에 떠 있는 드래그 가능한 패널이 필요할 때
- 메인 화면을 가리지 않고 보조 정보를 표시해야 할 때
- 사용자가 위치와 크기를 자유롭게 조절해야 하는 도구 패널
- 여러 FloatingPanel을 동시에 열고 겹쳐서 사용해야 할 때

## 조합 예시
- `FloatingPanel` + 채팅 UI → 상담 도중 참조 정보 패널
- `FloatingPanel` + `MdsTable` → 비교 데이터 플로팅 뷰
- 여러 `FloatingPanel` 동시 → 포커스 클릭 시 최상위로 올라옴

## Props 요약
| prop | type | 설명 |
|------|------|------|
| placement | `DraggableDialogPlacement` | 초기 위치 기준 요소와 배치 설정 (필수) |
| onClose | `() => void` | 닫힌 후 콜백 (필수) |
| title | `string` | 헤더 제목 |
| children | `ReactNode` | 패널 본문 내용 |
| minSize | `{ width: number; height: number }` | 최소 크기 (기본: width=300, height=500) |
| contentClassName | `string` | 본문 영역 추가 클래스 |
| noPortal | `boolean` | Portal 없이 렌더링 |
| portalKey | `string` | Portal key |

### DraggableDialogPlacement
| 필드 | type | 설명 |
|---|---|---|
| ref | `RefObject<HTMLElement>` | 위치 기준 요소 (필수) |
| position | `"x" \| "y"` | 기준 요소 기준 방향 (기본 `"y"`) |
| align | `"start" \| "end" \| "center"` | 정렬 (기본 `"center"`) |

## 주의사항
- ESC 키로도 닫을 수 있음 (내부에 포커스된 요소가 없을 때)
- 헤더 더블클릭 또는 최소화 버튼으로 최소화/복원 가능
- 모서리와 변을 드래그해 크기 조절 가능
- Portal 루트: `#floating-panel-root` (없으면 자동 생성)
