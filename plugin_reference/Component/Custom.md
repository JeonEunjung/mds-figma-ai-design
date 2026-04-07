# Custom

JSON 타입: `custom`
DS 컴포넌트에 없는 레이아웃을 Foundation 토큰 기반으로 직접 그리는 범용 타입. 재귀적으로 중첩 가능.

## 언제 쓰는가
- DS 컴포넌트로 표현할 수 없는 화면 요소
- 대시보드 KPI 카드, 요약 통계, 키-값 정보, 커스텀 배너 등
- Foundation 색상/폰트를 직접 지정해야 할 때

## 구성 요소
`custom`은 프레임, `text`는 텍스트 노드. children으로 재귀 중첩.

### custom (프레임)
| prop | 설명 |
|------|------|
| layout | horizontal / vertical (기본 vertical) |
| gap | children 간격 px (기본 8) |
| padding | 숫자(전체) 또는 { top, bottom, left, right } |
| bg | 배경 hex (예: "#FFFFFF") |
| border | 테두리 hex |
| borderWidth | 테두리 두께 (기본 1) |
| radius | border-radius px |
| width | "fill"(기본) 또는 px 숫자 |
| align | children 교차축 정렬: center / end |
| justify | children 주축 정렬: center / space-between |
| children | 중첩 custom/text 배열 |

### text (텍스트)
| prop | 설명 |
|------|------|
| value | 텍스트 내용 |
| size | 폰트 크기 px (기본 14) |
| weight | 500(Medium) 또는 700(Bold) |
| color | hex (기본 #1A1B22) |
| fill | true이면 width=FILL |

## 조합 예시

### 요약 카드 (KPI)
```json
{ "type": "custom", "bg": "#FFFFFF", "padding": 24, "radius": 20, "gap": 12, "children": [
  { "type": "text", "value": "송금 가능 잔액", "size": 12, "color": "#85878A" },
  { "type": "custom", "layout": "horizontal", "gap": 8, "align": "end", "children": [
    { "type": "text", "value": "50,000", "size": 36, "weight": 700, "color": "#1A1B22" },
    { "type": "text", "value": "USD", "size": 16, "color": "#6B6C74" }
  ]}
]}
```

### 키-값 정보 행
```json
{ "type": "custom", "layout": "horizontal", "gap": 16, "children": [
  { "type": "text", "value": "고객사", "size": 14, "color": "#85878A", "width": 120 },
  { "type": "text", "value": "(주)테크원", "size": 14, "weight": 700, "color": "#1A1B22" }
]}
```

### 대시보드 카드 가로 나열
```json
{ "type": "custom", "layout": "horizontal", "gap": 16, "children": [
  { "type": "custom", "bg": "#FFFFFF", "padding": 20, "radius": 16, "gap": 8, "children": [
    { "type": "text", "value": "총 송금 건수", "size": 12, "color": "#85878A" },
    { "type": "text", "value": "1,234건", "size": 28, "weight": 700 }
  ]},
  { "type": "custom", "bg": "#FFFFFF", "padding": 20, "radius": 16, "gap": 8, "children": [
    { "type": "text", "value": "총 송금 금액", "size": 12, "color": "#85878A" },
    { "type": "text", "value": "₩ 5.2억", "size": 28, "weight": 700 }
  ]}
]}
```

## 주의사항
- Foundation 색상 토큰을 반드시 참조 (임의 색상 금지)
- Foundation 타이포그래피 크기를 참조 (10/12/14/16/18/20/24/28/32/36px)
- DS 컴포넌트로 표현 가능하면 custom 대신 해당 컴포넌트 사용
- custom은 최후의 수단 — 먼저 기존 컴포넌트로 해결 가능한지 확인
