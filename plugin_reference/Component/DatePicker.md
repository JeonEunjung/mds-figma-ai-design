# DatePicker

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/picker/DatePicker/index.tsx

## 언제 쓰는가
- 날짜 단일 선택 또는 날짜 범위(from~to) 선택이 필요할 때
- 목록 페이지의 날짜 필터 (특정 기간 조회)
- 폼에서 날짜 입력 (생년월일, 예약일 등)
- 프리셋 버튼(오늘, 이번 주, 지난 30일 등)으로 빠른 날짜 선택 지원

## 조합 예시
- `DatePicker(mode="range")` + 프리셋 → 목록 페이지 날짜 필터
- `DatePicker(mode="single")` + `MdsTextField(트리거)` → 폼 날짜 입력
- `DatePicker` + `SearchBar` + `Dropdown` → 고급 필터 영역

## Props 요약

### 공통 (MdsDatePickerBaseProps)
| prop | type | 설명 |
|------|------|------|
| children | `ReactNode` | 팝오버를 여는 트리거 요소 (필수) |
| confirmText | `string` | 확인 버튼 텍스트 (필수) |
| dismissText | `string` | 취소 버튼 텍스트 (필수) |
| hasTime | `boolean` | 시간 선택 포함 여부 |
| align | `"start" \| "end" \| "center"` | 팝오버 정렬 |

### 단일 선택 (mode="single")
| prop | type | 설명 |
|------|------|------|
| mode | `"single"` | 필수 |
| label | `string` | 날짜 입력 레이블 |
| selected | `Date` | 선택된 날짜 |
| onSelect | `(date: Date) => void` | 선택 콜백 |

### 범위 선택 (mode="range")
| prop | type | 설명 |
|------|------|------|
| mode | `"range"` | 필수 |
| fromLabel | `string` | 시작 날짜 레이블 |
| toLabel | `string` | 종료 날짜 레이블 |
| selected | `{ from: Date; to: Date }` | 선택된 범위 |
| onSelect | `(range: DateRange) => void` | 선택 콜백 |
| preset | `{ titleText: string; items: PresetItem[] }` | 프리셋 버튼 목록 |

### preset.items.getRange 값
`"today"`, `"yesterday"`, `"lastWeek"`, `"lastMonth"`, `` `recent${N}Days` ``, `` `last${N}Days` ``, `` `last${N}Weeks` ``, `` `last${N}Months` ``, 또는 커스텀 함수 `(now: Date) => DateRange`

## 주의사항
- 트리거는 children으로 넘기며 Popover로 열림
- 취소 버튼 클릭 시 임시 선택값 초기화 후 닫힘
- 확인 버튼 클릭 시에만 `onSelect` 호출
