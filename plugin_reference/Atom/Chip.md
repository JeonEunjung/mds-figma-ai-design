# Chip / ChipGroup

JSON 타입: `chipgroup`
선택형 칩 필터를 가로로 나열한 그룹.

## 언제 쓰는가
- 선택지가 한눈에 보여야 하는 필터
- 카테고리, 상태 태그를 버튼처럼 나열할 때
- 삭제 가능한 태그를 표시할 때 (Suffix로 X 버튼 포함)
- "칩", "chip", "태그 필터", "카테고리 버튼" 요청 시 사용

## 구성 요소 (Chip 단일)
- **A. Container**: height size별 (small=24, medium=32, large=40, xlarge=48px). Selected 여부로 배경색 변경 (미선택=#FFFFFF, 선택=#EBF5FF)
- **B. Label**: 텍스트, max-width 300px 초과 시 말줄임. `label#5658:0` TEXT 프로퍼티
- **C. Prefix** (Optional): 아이콘/기호. `prefix#5327:10` BOOLEAN — 인터랙션 불가
- **D. Suffix** (Optional): 보조 아이콘 (예: 닫기 X). `suffix#5327:13` BOOLEAN — 인터랙션 가능 (삭제 등)

## 조합 예시
- `chipgroup(items=[...])` → 기본 필터 칩 나열
- `chipgroup` + `table` → 테이블 위 카테고리 필터
- Suffix(X 버튼) 포함 칩 → 삭제 가능한 태그

## Props
| prop | 설명 |
|------|------|
| items | 라벨 배열 또는 `[{ label, selected }]` |

## 예시
```json
{ "type": "chipgroup", "items": ["전체", "처리중", "완료", "실패"] }
{ "type": "chipgroup", "items": [{ "label": "전체", "selected": true }, { "label": "처리중", "selected": false }] }
```

## 주의사항
- 칩 간 간격: 8px 권장
- 텍스트가 길면 말줄임표 처리 (max-width 300px)
- Suffix는 인터랙션 가능 영역 (닫기/삭제), Prefix는 인터랙션 불가
- Selected 상태: 파란 배경(#EBF5FF) + 파란 테두리 없음
