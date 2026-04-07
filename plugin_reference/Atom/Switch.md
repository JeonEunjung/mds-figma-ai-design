# Switch

JSON 타입: `switch`
토글 스위치.

## 언제 쓰는가
- ON/OFF 토글이 필요한 설정 항목에 사용
- 기능 활성화/비활성화 (알림 설정, 기능 토글 등)
- Checkbox보다 즉각적인 상태 전환을 의미할 때 (저장 없이 바로 적용되는 설정)

## 조합 예시
- `switch(on=true)` + 레이블 텍스트 → 설정 항목 행
- `switch` → 테이블 행의 상태 토글
- `switch(disabled=true)` → 변경 불가 상태

## Props
| prop | 설명 |
|------|------|
| on | true/false (기본 false) |
| disabled | true이면 비활성 상태 (기본 false), opacity 60% 처리 |

## 예시
```json
{ "type": "switch", "on": true }
{ "type": "switch", "on": false, "disabled": true }
```

## 주의사항
- Checkbox와 구분: Switch는 "즉시 적용"되는 설정에 사용, Checkbox는 폼 제출 후 반영되는 선택에 사용
- disabled 시 전체 opacity 60% 처리되며 indicator 색상이 변경됨
- 라벨과 스위치 사이 간격: 최소 8px
