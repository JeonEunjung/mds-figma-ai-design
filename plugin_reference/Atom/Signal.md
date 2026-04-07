# Signal

JSON 타입: `signal`
작업이나 송금의 상태를 색상과 아이콘으로 직관적으로 전달하는 원형 아이콘 컴포넌트.

## 언제 쓰는가
- 테이블 셀이나 목록에서 상태를 아이콘으로 간결하게 표시
- StatusBadge보다 더 작고 간결한 상태 표시가 필요할 때
- 텍스트 없이 아이콘만으로 상태 전달

## 구성 요소
- **A. Container**: 24x24px 고정, pill 형태(border-radius 1000px), 상태별 배경색
- **B. Icon**: 14x14px, Solid 스타일 아이콘 권장

## status별 색상
| status | 배경색 | 용도 |
|--------|--------|------|
| backlog / 대기 | #F9FAFB (회색) | 미처리 |
| in progress / 처리중 | #EBF5FF (파랑) | 진행 중 |
| done / 완료 | #EAF6ED (초록) | 완료 |
| error / 실패 | #FDF2F2 (빨강) | 에러 |
| pending / 보류 | #FFFDE8 (노랑) | 보류 |

## Props
| prop | 설명 |
|------|------|
| status | backlog / in progress / done / error / pending (또는 한글) |

## 예시
```json
{ "type": "signal", "status": "done" }
{ "type": "signal", "status": "처리중" }
```

## 주의사항
- 텍스트 없음 — 아이콘+배경색만으로 상태 표현
- 텍스트가 필요하면 StatusBadge 사용
- StatusBadge와 같은 status 체계 공유
