# Modal

JSON 타입: `modal`
사용자의 주요 작업 흐름을 잠시 멈추고 중요한 정보 확인이나 액션을 수행하도록 유도하는 컴포넌트. 경고, 확인, 입력 요청 등에 사용.

## 언제 쓰는가
- 사용자 확인이 필요한 액션 (삭제, 신청, 승인 등)
- 경고, 확인, 입력 요청
- sections 최상위에 lnb/main과 같은 레벨로 추가

## 구성 요소
- **A. Container**: 기본 너비 400px 고정, 뷰포트 중앙 정렬, border-radius 16px
- **B. Contents**: 본문 영역 — 텍스트, 입력폼, 경고 메시지 등 배치
- **C. Close Button**: 우측 상단 닫기 아이콘. ESC 키와 동일
- **D. Action Button**: 주요 액션 버튼 (Primary). Support Button 없으면 width Fill
- **E. Support Button** (Optional): 보조 버튼. 닫기는 Close Button 사용 권장
- **F. Title** (Optional): 모달 제목. 글자수 제한 없이 자동 줄바꿈. `title#7455:0` boolean으로 표시/숨김
- **G. Description** (Optional): 설명 텍스트. 글자수 제한 없이 자동 줄바꿈. `description#7455:3` boolean으로 표시/숨김

## Dimmed Overlay
Modal Template로 감쌀 때 4단계 어둡기 사용:
| 단계 | 설명 |
|------|------|
| primary | 가장 어두움 (rgba 0,0,0,0.85) |
| secondary | 기본값 (rgba 0,0,0,0.6) |
| tertiary | 중간 (rgba 0,0,0,0.5) |
| tertiary2 | 가장 밝음 (rgba 0,0,0,0.3) |

## 조합 예시
- `modal(title, description, ctaLabel, dismissLabel)` → 기본 확인 모달
- `modal(title만)` → title만 표시, description 숨김
- `modal` + 오버레이 → Dimmed Overlay 위에 중앙 배치

## Props
| prop | 설명 |
|------|------|
| title | 모달 제목. 행동 동사로 시작 권장 (예: "송금 신청 확인") |
| description | 사용자가 결정할 내용 1-2줄 |
| ctaLabel | 주요 액션 버튼 텍스트 (예: "신청하기", "삭제") |
| dismissLabel | 보조/취소 버튼 텍스트 (예: "취소", "돌아가기") |
| body | (선택) 본문 children 배열. 입력폼/파일선택/칩선택/테이블 등 자유 구성. body가 있으면 자동으로 Page Modal 스타일로 렌더 |
| width | (선택) body가 있을 때 모달 너비. 기본: body 3개 미만 560, 이상 720. 대량 데이터는 1200 권장 |

## 어떤 모달을 써야 하나

- **body 없음** → published Modal(400px). 텍스트만으로 의사결정이 끝나는 확인/안내 (삭제 확인, 완료 안내 등)
- **body 있음** → composite. width: 작음 480~560(자동) / 중간 720 / 큼 1200(Page Modal급)

### body에 무엇을 넣을지
**진짜 DS 컴포넌트를 우선 사용한다.** textfield/formgroup/chipgroup/table/tab/searchbar/filterbar 등.
custom은 DS에 없는 비표준 UI(드래그 영역, 빈 상태 일러스트 등)에만 쓴다. text만 잔뜩 쌓지 말 것.

### 절대 금지
- body에 들어가야 할 본문을 description에 길게 풀어쓰기
- 확인 모달인데 body를 억지로 채우기 (published Modal이 더 깔끔)
- body 안에 custom > text를 도배 (실제 입력/선택 UI가 없는 모달은 모달이 아니다)

## 예시 — 단순 확인 모달
```json
{ "type": "modal", "title": "송금 신청 확인",
  "description": "선택한 3건을 송금 신청합니다. 신청 후 취소가 불가합니다.",
  "ctaLabel": "신청하기", "dismissLabel": "취소" }
```

## 예시 — 본문 있는 모달 (Page Modal 스타일)
파일 업로드:
```json
{ "type": "modal", "title": "Excel 파일 업로드",
  "description": "다운로드한 템플릿에 데이터를 작성한 후 업로드하세요.",
  "body": [
    { "type": "custom", "frame": { "padding": 24, "background": "#F9FAFB", "cornerRadius": 8 },
      "children": [{ "type": "text", "value": "여기에 파일을 끌어다 놓거나 클릭하여 선택", "color": "#5C5F66" }] }
  ],
  "ctaLabel": "업로드", "dismissLabel": "취소" }
```

오류 목록:
```json
{ "type": "modal", "title": "업로드 오류",
  "description": "Excel 파일에 오류가 있습니다.",
  "width": 720,
  "body": [
    { "type": "table", "rowCount": 3,
      "columns": [{ "label": "시트", "width": 80, "type": "text" },
                  { "label": "행", "width": 60, "type": "text" },
                  { "label": "컬럼", "width": 120, "type": "text" },
                  { "label": "오류 내용", "width": "fill", "type": "text" }] }
  ],
  "ctaLabel": "확인", "dismissLabel": "" }
```

---

## Page Modal

콘텐츠 양이 많거나 페이지 단위의 검토/입력 작업이 필요할 때 사용하는 Large Modal. Modal과 별개 컴포넌트.

### 구성 요소
- **A. Container**: width 1200px 고정, min-height 320px, 80vh, border-radius 32px
- **B. Contents**: 내부 콘텐츠 영역 — 테이블, 폼 등 자유 구성
- **C. Close Button**: 우측 상단 닫기 아이콘

### Modal vs Page Modal
| 항목 | Modal | Page Modal |
|------|-------|------------|
| 너비 | 400px | 1200px |
| border-radius | 16px | 32px |
| title/description | 있음 (텍스트 프로퍼티) | 없음 (내부 콘텐츠로 자유 구성) |
| Action/Support Button | 있음 | 없음 (내부에서 직접 배치) |
| 용도 | 확인/경고/간단 입력 | 대량 데이터 조회/입력/검토 |

### Page Modal Dimmed Overlay
Modal Template과 동일한 4단계 사용.

## 주의사항
- Container 기본 너비 400px 고정, 뷰포트 중앙 정렬
- 상하좌우 최소 마진 20px
- Close Button은 자동 포함 (우측 상단 X 아이콘)
- Support Button(dismissLabel)이 없으면 Action Button이 width Fill로 확장
- 닫기 기능은 Close Button 사용 권장, Support Button은 보조 액션용
- title은 행동 동사로 시작 권장 (예: "삭제 확인", "신청 확인")
