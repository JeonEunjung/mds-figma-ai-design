# StatusBadge

JSON 타입: `statusbadge`
콘텐츠나 작업의 상태를 색상과 텍스트 조합으로 시각적으로 전달하는 pill 형태 배지.

## 언제 쓰는가
- 테이블 셀에서 상태값 표시 (테이블 badge 컬럼과 연동)
- 목록 아이템의 상태 표시
- 카드 내 작업 상태 표시

## 구성 요소
- **A. Container**: height 24px 고정, border-radius pill(1000px), 상태별 배경색
- **B. Label**: 상태 텍스트, 최대 1줄 (max-width 300px 초과 시 말줄임). `label#6829:0` TEXT 프로퍼티
- **C. Prefix** (Optional): 상태 원형 도트 (8x8px). `prefix#5248:0` BOOLEAN
- **D. Suffix** (Optional): 정보 아이콘 등. `suffix#5247:0` BOOLEAN

## status별 색상
| status | 배경색 | 도트 색 | 용도 |
|--------|--------|---------|------|
| backlog / 대기 | #F9FAFB (회색) | #DADDDF | 미처리, 초기 상태 |
| in progress / 처리중 | #EBF5FF (파랑) | #0066FF | 진행 중 |
| done / 완료 | #EAF6ED (초록) | #009A51 | 완료 |
| error / 실패 | #FDF2F2 (빨강) | #F9354D | 에러, 실패 |
| pending / 보류 | #FFFDE8 (노랑) | #FFC414 | 보류, 대기 중 |

## Props
| prop | 설명 |
|------|------|
| status | backlog / in progress / done / error / pending (또는 한글: 대기/처리중/완료/실패/보류) |
| label | 상태 텍스트 (예: "완료", "처리중") |

## 예시
```json
{ "type": "statusbadge", "status": "done", "label": "완료" }
{ "type": "statusbadge", "status": "처리중", "label": "처리중" }
{ "type": "statusbadge", "status": "error", "label": "실패" }
```

## 주의사항
- 테이블 badge 컬럼 셀에서 자동으로 사용됨 (별도 배치 불필요한 경우 많음)
- 독립 배치 시 card 또는 main의 children으로 사용
- label 텍스트가 max-width 300px 초과 시 말줄임 처리
