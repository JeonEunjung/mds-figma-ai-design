# RadioButton

JSON 타입: `radio`
단일 선택 라디오 버튼.

## 언제 쓰는가
- 여러 선택지 중 하나만 선택해야 할 때
- 폼에서 유형 선택 (예: 송금 방식, 계정 유형)
- 필터 패널에서 단일 조건 선택
- 결제 방식 선택 등

## 조합 예시
- `radio(selected=false)` + 라벨 텍스트 → 기본 라디오 항목
- 여러 `radio` 세로 나열 → 라디오 그룹 (같은 그룹은 시각적으로 묶어 배치)
- `radio` 목록 → 설정 화면 옵션 선택
- `radio(disabled=true)` → 선택 불가 상태

## Props
| prop | 설명 |
|------|------|
| selected | true/false (기본 false) |
| disabled | true이면 비활성 상태 (기본 false) |

## 예시
```json
{ "type": "radio", "selected": true }
{ "type": "radio", "selected": false }
{ "type": "radio", "selected": false, "disabled": true }
```

## 주의사항
- 같은 그룹의 라디오 버튼들은 시각적으로 가깝게 배치하여 그룹핑이 명확해야 함
- 라디오 버튼에는 반드시 라벨 텍스트를 함께 배치해야 함
- 한 그룹에서 하나만 selected: true일 수 있음
- 라벨과 라디오 버튼 사이 간격: 4px
