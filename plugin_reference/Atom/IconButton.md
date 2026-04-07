# Icon Button

JSON 타입: `iconbutton`
아이콘만 있는 정사각형 버튼.

## 언제 쓰는가
- 텍스트 라벨 없이 아이콘 하나만으로 액션을 표현할 때
- 닫기(X), 더보기(…), 설정(톱니바퀴), 삭제(휴지통) 등
- 공간이 좁아 텍스트 버튼을 쓸 수 없을 때

## 구성 요소
- **Container**: 정사각형, size별 크기 고정 (small=32, medium=40, large=48, xlarge=56px)
- **Icon**: 중앙 배치, size별 아이콘 크기 (18/24/28/32px)

## Variant
| variant | 설명 |
|---------|------|
| primary | 주요 아이콘 액션 (#0066FF) |
| secondary | 보조 (#2F3133) |
| tertiary | 낮은 우선순위 (#F9FAFB) |
| tertiary2 | 아웃라인 |

## Props
| prop | 설명 |
|------|------|
| variant | primary / secondary / tertiary / tertiary2 |
| size | small / medium / large / xlarge (기본 medium) |

## 주의사항
- Button과 같은 variant 체계를 공유함
- 아이콘만으로 의미가 명확하지 않으면 Tooltip 추가 권장
- size별 컨테이너와 아이콘 크기가 모두 고정됨
