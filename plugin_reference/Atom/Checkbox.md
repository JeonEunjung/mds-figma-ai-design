# Checkbox

JSON 타입: `checkbox`
복수 선택 가능한 체크박스.

## 언제 쓰는가
- 여러 항목 중 복수 선택이 필요할 때
- 테이블 헤더의 전체 선택 / 행별 개별 선택
- 필터 패널에서 복수 조건 선택
- 약관 동의, 설정 on/off 등
- 부분 선택 상태(intermediate)가 필요한 경우 (예: 테이블 헤더에서 일부만 선택됨)

## 조합 예시
- `checkbox(selected=false)` + 라벨 텍스트 → 기본 체크박스 항목
- `checkbox(intermediate=true)` → 테이블 헤더 전체 선택 (일부만 선택된 상태)
- `checkbox` + `table` rowSelection → 행 다중 선택
- `checkbox(disabled=true)` → 선택 불가 상태

## Props
| prop | 설명 |
|------|------|
| selected | true/false (기본 false) |
| intermediate | true이면 부분 선택 상태 (체크 아이콘 대신 마이너스 아이콘) |
| disabled | true이면 비활성 상태 (기본 false) |

## 예시
```json
{ "type": "checkbox", "selected": true }
{ "type": "checkbox", "intermediate": true }
{ "type": "checkbox", "selected": false, "disabled": true }
```

## 주의사항
- 체크박스에는 라벨 텍스트를 반드시 함께 배치해야 사용자가 용도를 이해할 수 있음
- disabled 상태에서는 시각적으로 비활성 처리됨
- intermediate는 테이블 헤더 전체 선택에서 일부만 선택된 경우에만 사용
- 라벨과 체크박스 사이 간격: 4px
