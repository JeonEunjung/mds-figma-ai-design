# Tab

JSON 타입: `tab`
여러 콘텐츠 영역을 전환할 수 있는 내비게이션 컴포넌트.

## 언제 쓰는가
- 테이블 위에서 전체/처리중/완료/실패 등 상태 전환
- 동일 페이지에서 여러 뷰/필터를 전환할 때
- 상세 페이지의 섹션 간 전환
- 콘텐츠 전체가 바뀌는 전환에 사용

## 구성 요소

### Tab 컴포넌트
- **A. Selected Tab Item**: 현재 선택된 탭. 반드시 1개 선택 상태
- **B. Enabled Tab Item**: 미선택 탭. 클릭 시 전환, hover 시 배경색 변경
- **C. Line**: 하단 구분선 (#F3F5F8 1px)
- 내부에 Tab/item 인스턴스 10개 포함 (사용하지 않는 항목은 숨김 처리)

### Tab/item
- **A. Label**: 탭 이름 텍스트. 선택 상태에 따라 스타일 변경
- **B. Container**: width=Flexible, height=40px 고정
- **C. Selected Line**: 선택된 탭 하단 파란 강조선 (2px, #0066FF)
- variant: `status` (enabled/hover) × `selected` (true/false)

## 조합 예시
- `tab` → 목록 페이지 searchbar 아래 상태 필터
- `tab` + `table` → 탭 전환에 따라 다른 데이터 표시
- `top` + `searchbar` + `tab` + `table` → 목록 페이지 전체 구조

## Props
| prop | 설명 |
|------|------|
| items | 탭 라벨 배열 |
| activeIndex | 선택된 탭 인덱스 (기본 0) |

## 예시
```json
{ "type": "tab", "items": ["전체", "처리중", "완료", "실패"] }
{ "type": "tab", "items": ["전체", "처리중", "완료", "실패"], "activeIndex": 1 }
```

## 주의사항
- 탭이 많아도 줄바꿈 없이 가로 스크롤 처리
- 탭 컴포넌트 자체는 콘텐츠를 렌더링하지 않음 — 탭 아래 콘텐츠 영역은 별도로 구성
- 선택된 탭은 파란 밑줄(#0066FF 2px)로 표시
- Tab/item 높이 40px 고정
- 반드시 1개는 선택된 상태여야 함
