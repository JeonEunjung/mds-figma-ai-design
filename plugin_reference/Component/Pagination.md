# Pagination

JSON 타입: `pagination` (독립 배치) 또는 Table의 `pagination: true` 옵션
테이블 하단 페이지 이동 컴포넌트.

## 언제 쓰는가
- 테이블 데이터가 많아 페이지 분할이 필요할 때
- table의 하위 옵션으로 사용하는 것을 권장

## 구성 요소
- **Range Info**: 현재 페이지 데이터 범위 (예: "1-20 / 9990"), 좌측 배치
- **Pagination Control**: 페이지 번호 버튼 + 이전/다음 버튼 + Ellipse(…), 중앙 배치
- Pagination Button: 32×32px 고정, 숫자 4자리 이상일 때 좌우 패딩 8px

## 조합 예시
- `table(pagination=true)` → 테이블 하단에 자동 포함 (권장)
- `pagination` 독립 배치 → card 안에 직접 배치

## Props (Table 옵션으로 사용 시)
```json
{ "type": "table", "pagination": true, "rowCount": 10, "columns": [...] }
```

## Props (독립 배치 시)
```json
{ "type": "pagination" }
```

## 주의사항
- 너비가 좁아지면 Range Info가 숨겨지고 Pagination Control만 표시됨
- 현재 페이지는 selected 상태 (어두운 배경)로 강조
- Ellipse(…)는 클릭 불가, 사이에 생략된 페이지가 있음을 표시
