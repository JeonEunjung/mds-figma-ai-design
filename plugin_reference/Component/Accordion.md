# Accordion

JSON 타입: `accordion`
섹션 단위로 정보를 구분하고, 헤더 클릭으로 콘텐츠를 접거나 펼칠 수 있는 컴포넌트. 내부에 리스트, 테이블, 뷰어 등 다양한 콘텐츠 포함 가능.

## 언제 쓰는가
- 상세 페이지에서 여러 섹션을 접기/펼치기로 관리할 때
- 설정 페이지에서 카테고리별 항목을 그룹핑할 때
- 송금 상세, 계정 정보 등 섹션이 많은 페이지

## 구성 요소

### Accordion 컴포넌트
- **A. Container**: width=Flexible (부모 따라감), height=Hug, border-radius 20px
- **B. Header**: Accordion/Header 인스턴스 — 섹션 제목 + 버튼
- **C. Contents**: 내부 콘텐츠 — list / table / file viewer

### Accordion/Header
- **A. Container**: width=Flexible, height=Hug
- **B. Section Title**: 섹션 제목 (Bold 20px)
- **C. Text Button** (Optional): 보조 텍스트 버튼. `Text Button#6785:0` boolean
- **D. Dropdown Button**: 접기/펼치기 아이콘 (32x32px)
- variant: `dropdown` = true(펼침)/false(접힘)

### Accordion/List
- 행 단위 리스트 아이템
- `subtitle` TEXT, `information` TEXT
- `copy button`, `button1`, `button2` BOOLEAN
- variant: `row` = odd/even (배경색 교대: 흰색/#F9FAFB)

## Props
| prop | 설명 |
|------|------|
| title | 섹션 제목 |
| contents | list(기본) / table |
| open | true(기본, 펼침) / false(접힘) |

## 예시
```json
{ "type": "accordion", "title": "송금 정보", "contents": "list", "open": true }
{ "type": "accordion", "title": "거래 내역", "contents": "table", "open": false }
```

## 주의사항
- 접힌 상태(open=false)에서는 Header만 표시, Contents 숨김
- Contents 영역은 list/table/file viewer 중 선택
- Header의 Dropdown Button 아이콘이 접힘/펼침 상태에 따라 회전
- List 행은 odd/even으로 배경색 교대 (가독성)
