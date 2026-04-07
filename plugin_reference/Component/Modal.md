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

## 예시
```json
{ "type": "modal", "title": "송금 신청 확인",
  "description": "선택한 3건을 송금 신청합니다. 신청 후 취소가 불가합니다.",
  "ctaLabel": "신청하기", "dismissLabel": "취소" }
{ "type": "modal", "title": "삭제 확인", "ctaLabel": "삭제", "dismissLabel": "취소" }
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
