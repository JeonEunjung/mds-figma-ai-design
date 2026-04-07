# Tooltip

JSON 타입: `tooltip`
대상 요소에 대한 간단한 설명이나 안내를 제공하는 말풍선 컴포넌트.

## 언제 쓰는가
- 아이콘 버튼의 용도 설명
- 줄임표(…) 처리된 텍스트의 전체 내용 표시
- 입력 필드의 추가 안내
- 짧은 도움말 제공

## 구성 요소
- **A. Container**: min-width 80px, max-width 320px, border-radius 8px, 어두운 배경(#2F3133)
- **B. Text**: 흰색 텍스트, 최대 3줄 (1줄 권장). max-width 초과 시 줄바꿈
- **C. Tip Arrow**: 대상 요소를 가리키는 화살표. 방향에 따라 8종 variant

## 방향 (direction)
| direction | 설명 |
|-----------|------|
| top-left | 대상 아래쪽, 좌측 정렬 |
| top-middle | 대상 아래쪽, 중앙 |
| top-right | 대상 아래쪽, 우측 정렬 |
| bottom-left | 대상 위쪽, 좌측 정렬 |
| bottom-middle | 대상 위쪽, 중앙 (기본값) |
| bottom-right | 대상 위쪽, 우측 정렬 |
| left | 대상 오른쪽 |
| right | 대상 왼쪽 |

## Props
| prop | 설명 |
|------|------|
| text | 툴팁 내용 텍스트 |
| direction | 방향 (기본 bottom-middle) |

## 예시
```json
{ "type": "tooltip", "text": "송금 신청 버튼입니다", "direction": "bottom-middle" }
{ "type": "tooltip", "text": "클릭하여 상세 내역을 확인하세요", "direction": "top-left" }
```

## 주의사항
- 대상 컴포넌트와 4px 간격 유지
- 화면 모서리에서 최소 16px 여백 확보
- 1줄 이내의 짧은 메시지 권장
- 긴 설명이 필요하면 Tooltip 대신 별도 도움말 영역 사용
