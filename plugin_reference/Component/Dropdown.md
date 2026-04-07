# Dropdown

JSON 타입: FilterBar의 내부 컴포넌트 또는 독립 배치.
여러 옵션 중 하나를 선택할 수 있는 입력 컴포넌트.

## 언제 쓰는가
- 선택지가 많아 접어두는 것이 나을 때
- 날짜 범위, 국가, 상태 등 범위/선택 필터
- filterbar 안에서 가로로 나열
- 폼에서 독립적으로 사용 (예: 계정 유형 선택)

## 구성 요소
- **A. Label** (Optional): 드롭다운 용도 설명. 필수 선택 시 빨간 *. `Label#5242:0` boolean
- **B. Container**: 선택 영역. size별 높이 (small=32, medium=40, large=48px). width=Fixed 또는 Fill
- **C. Prefix** (Optional): 아이콘, 국기 등 보조 요소. `Prefix#6115:0` boolean
- **D. Placeholder**: 선택 전 임시 텍스트
- **E. Dropdown Indicator**: 화살표 아이콘 (펼침/접힘 표시)
- **F. Selected Value**: 선택된 항목 텍스트 (Placeholder 대체)
- **G. Dropdown/List**: 선택 가능 항목 리스트 (스크롤 가능)

## Dropdown/List/Item 구성
- **Container**: width=Fill, height=size별 32/40/48px
- **Prefix** (Optional): 아이콘, 아바타, 체크박스. `left icon#5241:0` boolean
- **Label**: 항목 텍스트, 최대 1줄 (초과 시 말줄임)
- **Suffix** (Optional): 체크 아이콘 등. `right icon#6163:0` boolean

## 조합 예시
- `filterbar(dropdowns=[...])` → 가로 나열 필터 (현재 방식)
- `dropdown` → 폼 내 독립 배치

## 현재 플러그인 지원
- FilterBar 내부에서 Dropdown 인스턴스로 사용 중
- Placeholder 텍스트 오버라이드 가능
- Label 숨기기 가능 (`Label#5242:0`: false)

## 주의사항
- 선택지가 한눈에 보여야 하면 chipgroup 사용
- size별 높이: small=32px, medium=40px, large=48px
- 리스트가 긴 경우 스크롤 자동 활성화
- destructive 옵션: 삭제 등 위험 액션 항목에 빨간색 표시
