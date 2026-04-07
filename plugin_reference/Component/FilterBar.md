# FilterBar

JSON 타입: `filterbar`
드롭다운 필터 모음. 날짜, 상태, 국가 등 범위/선택 필터.

## 언제 쓰는가
- 선택지가 많거나 접어두는 게 나을 때 (날짜 범위, 국가 선택 등)
- 선택지가 항상 보여야 하면 chipgroup 사용

## Props
| prop | 설명 |
|------|------|
| dropdowns | 드롭다운 배열 `[{ placeholder }]` |

## 예시
```json
{ "type": "filterbar", "dropdowns": [
  { "placeholder": "전체 상태" },
  { "placeholder": "기간 선택" },
  { "placeholder": "수취국가" }
]}
```
