# Button

JSON 타입: Top의 `rightButtons` 또는 독립 배치 가능.
사용자가 액션을 실행할 수 있는 버튼.

## 언제 쓰는가
- 폼 제출, 데이터 저장/삭제 등 모든 클릭 액션
- Top 컴포넌트의 rightButtons 안에서 사용
- Modal의 ctaLabel/dismissLabel로 사용
- 독립 컴포넌트로 페이지 내 단독 배치 가능 (예: 폼 하단 저장 버튼)

## 구성 요소
- **Container**: size별 높이 고정 (small=32, medium=40, large=48, xlarge=56px)
- **Label**: 행동을 유도하는 텍스트 (`Text#5054:16` 프로퍼티로 제어)
- **Left Icon**: optional, `left icon#5054:8` boolean으로 on/off
- **Right Icon**: optional, `right icon#5054:12` boolean으로 on/off

## Variant
| variant | 설명 | 사용 예 |
|---------|------|---------|
| primary | 주요 CTA, 화면당 1개 (#0066FF) | 송금 신청, 저장, 확인 |
| secondary | 보조 액션 (어두운 배경 #2F3133) | 보조 버튼 |
| tertiary | 낮은 우선순위 (회색 배경 #F9FAFB) | 내보내기, 더보기, 필터 |
| tertiary2 | 흰 배경+테두리 (아웃라인) | 엑셀 다운로드, 취소, 닫기 |

## 조합 예시
- `top(rightButtons=[{label, variant: "primary"}])` → 페이지 헤더 CTA
- `button(variant="tertiary2")` + `button(variant="primary")` → 취소 + 확인 조합
- `button(variant="tertiary")` + 아이콘 → 검색 버튼, 다운로드 버튼

## Props
| prop | 설명 |
|------|------|
| label | 버튼 텍스트 |
| variant | primary / secondary / tertiary / tertiary2 (필수) |
| size | small / medium / large / xlarge (기본 medium) |
| disabled | true이면 비활성 상태 (기본 false) |

## 예시
```json
{ "label": "송금 신청", "variant": "primary" }
{ "label": "취소", "variant": "tertiary2" }
```

## 주의사항
- primary는 화면당 1개만 사용
- 삭제/초기화 같은 위험 액션에는 primary 사용 금지
- disabled 상태에서는 회색 배경 + 회색 텍스트로 자동 처리
- size별 높이 고정: small=32, medium=40, large=48, xlarge=56px
- 아이콘 미지정 시 Icon-wrapper를 숨겨야 함 (visible=false)
