# Table

JSON 타입: `table`
데이터 목록 테이블.

## 언제 쓰는가
- 목록 데이터를 행/열로 표시할 때
- 정렬, 페이지네이션, 행 선택이 필요한 데이터 목록
- 로딩/에러/빈 데이터 상태를 표시해야 할 때

## 구성 요소
- **Header/Cell**: 컬럼 제목. 높이 32px 고정. contents=text 또는 contents=checkbox
- **Contents/Cell**: 데이터 셀. 최소 높이 48px, 패딩 좌우 8px. contents=text 또는 contents=badge
- **Pagination**: 테이블 하단 페이지 이동. range info("1-20 / 9990") + 페이지 버튼

## Header Cell Width 제한
다음 값만 사용 가능 (임의 픽셀 금지):
`40 / 60 / 80 / 90 / 100 / 120 / 160 / 200 / 240 / 320 / 360 / fill`

## 컬럼 타입별 정렬
- text: 좌측 정렬 (기본)
- badge: 중앙 정렬 (상태값)
- button: 우측 정렬 (액션)
- 숫자/금액: 우측 정렬

## Props
| prop | 설명 |
|------|------|
| state | default / loading / error |
| rowCount | 행 수 (기본 3) |
| columns | 컬럼 배열 `[{ label, width, type }]` |
| rows | 셀 데이터 배열 (선택사항) |
| pagination | true이면 테이블 하단에 Pagination 자동 포함 |

## 컬럼 type
- text: 일반 텍스트 (기본값, 대부분의 컬럼)
- badge: 상태 배지 (상태, 승인여부 등 enum 값)
- button: 행 액션 버튼 (상세보기, 다운로드)

## 조합 예시
- Top(large) + SearchBar + FilterBar + Tab + Table → 표준 목록 페이지
- Table(state: "loading") → 로딩 상태
- Table + Pagination → 대량 데이터 목록

## 예시
```json
{ "type": "table", "state": "default", "rowCount": 5,
  "columns": [
    { "label": "송금번호", "width": 160, "type": "text" },
    { "label": "수취인", "width": "fill", "type": "text" },
    { "label": "금액", "width": 120, "type": "text" },
    { "label": "상태", "width": 100, "type": "badge" },
    { "label": "상세보기", "width": 80, "type": "button" }
  ]
}
```

## 주의사항
- width는 반드시 허용된 값(40~360 + fill)만 사용. 가장 가까운 값으로 자동 매핑됨
- state=loading/error 시 columns 무시, 상태 컴포넌트만 표시
- selected 행은 배경색 #EBF5FF로 자동 구분
- Contents가 셀 높이를 넘어갈 경우 clip 처리
