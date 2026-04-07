# 레이아웃 원칙

## 기본 구조
모든 페이지는 반드시 lnb + main으로 구성한다.

```json
{ "sections": [ { "type": "lnb", ... }, { "type": "main", ... } ] }
```

## LNB
- menuItems는 다음 중에서만 사용: 당발송금, 타발송금, 잔액, 집금관리, 문의, 설정, 내 계정
- 하위 페이지(대량송금, 당발송금 목록 등)는 부모 메뉴를 active로 설정

## Main
- padding: 16, gap: 16 기본값
- children에 card, top, table, searchbar, filterbar, tab, chipgroup, spinner, breadcrumb 배치

## Card
- 콘텐츠를 감싸는 흰색 박스
- main의 children으로 사용
- card 안에 top, table, searchbar, filterbar, tab, chipgroup 배치

## Modal
- sections 최상위에 lnb/main과 같은 레벨로 추가
- 화면 중앙 오버레이로 렌더링됨
