# Dialog

JSON 타입: `dialog`
주요 사용자 행동을 유도하기 위한 모달 컴포넌트. Modal보다 간결하고 구조적.

## 언제 쓰는가
- 삭제 확인, 로그아웃 확인 등 짧은 의사결정
- Modal보다 가벼운 확인/경고가 필요할 때
- sections 최상위에 lnb/main과 같은 레벨로 추가

## Modal vs Dialog
| 항목 | Modal | Dialog |
|------|-------|--------|
| 너비 | 400px | 320px |
| 용도 | 폼 입력, 상세 내용 | 짧은 확인/경고 |
| Close 버튼 | 있음 (X) | 없음 (버튼으로만 닫힘) |
| 버튼 | CTA + Support | 최대 3개 (가로/세로) |

## 구성 요소
- **A. Container**: width 320px 고정, min-height 120px, max-height 480px, border-radius 16px
- **B. Title**: 핵심 메시지. 짧고 명확하게 의도 전달
- **C. Description** (Optional): 타이틀 보완 설명
- **D. Button Group**: horizontal(최대 2개) / vertical(최대 3개), 최소 1개 필수
- **E. Contents** (Optional): 이미지, 체크박스, 라디오 등 추가 컴포넌트

## Props
| prop | 설명 |
|------|------|
| title | 핵심 메시지 |
| description | 보완 설명 (선택) |
| buttons | 버튼 텍스트 배열 (예: ["취소", "삭제"]) |
| layout | horizontal(기본) / vertical |

## 예시
```json
{ "type": "dialog", "title": "삭제하시겠습니까?", "description": "삭제된 데이터는 복구할 수 없습니다.", "buttons": ["취소", "삭제"] }
{ "type": "dialog", "title": "로그아웃", "buttons": ["취소", "로그아웃"], "layout": "horizontal" }
{ "type": "dialog", "title": "알림 설정", "buttons": ["모두 허용", "필수만 허용", "거부"], "layout": "vertical" }
```

## 주의사항
- horizontal 레이아웃은 최대 2개 버튼, vertical은 최대 3개
- 최소 1개 이상의 버튼 필수
- 버튼 2개 이상일 때 주요 행동 버튼에 시각적 위계 부여 (Primary + Secondary)
- Close 버튼 없음 — 반드시 버튼을 통해서만 닫힘
- 버튼 탭 시 자동으로 닫히며 해당 액션 실행
