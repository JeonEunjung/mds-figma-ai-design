# Button Hierarchy & Priority

## 목적

SaaS 인터페이스에서 버튼 우선순위와 시각적 위계를 일관성 있게 설계하기 위한 원칙.
인지 부하를 줄이고 사용자가 주요 목표를 빠르게 완료할 수 있게 한다.

---

## 1. 핵심 원칙

### 1.1 Primary는 화면당 하나

- 각 화면(또는 Dialog/Modal)에 Primary 버튼은 **반드시 1개**
- Primary = 사용자의 현재 주요 목표를 완료하는 액션

### 1.2 계층 분류

| 레벨 | 역할 | 예시 |
|------|------|------|
| Primary | 목표 완료 | 저장, 제출, 결제, 확인 |
| Secondary | 보조 또는 대안 경로 | 취소, 쿠폰 적용, 미리보기 |
| Tertiary | 선택적·낮은 우선순위 | 더 보기, 내보내기, 도움말 |

> **취소(Cancel)는 Secondary**다. 사용자가 의도적으로 흐름을 중단하는 중요한 대안 경로이므로, 선택적인 Tertiary로 분류하지 않는다.

### 1.3 시각적 강조 우선순위

```
색상 > Fill(채움) > 크기 > 위치
```

색상이 가장 강한 강조 수단이므로, 브랜드 컬러는 Primary에만 사용한다.

---

## 2. 분류 기준

### Primary

다음 조건을 **모두** 만족해야 한다:

- 사용자의 현재 목표를 직접 완료한다
- 진행을 위해 필수적이다
- **파괴적(Destructive) 액션이 아니다**

### Secondary

- Primary를 지원하거나 대안 경로를 제공한다
- 취소(Cancel), 뒤로 가기, 보조 편집 액션 등

### Tertiary

- 없어도 목표 완료에 지장 없는 선택적 액션
- 텍스트 버튼 스타일 사용

### Destructive (파괴적 액션)

- **절대 Primary로 지정하지 않는다**
- 단, 삭제 전용 화면(예: 계정 삭제 확인 Dialog)에서는 Destructive 스타일의 Primary 허용
- 반드시 파괴적 스타일(빨간색 계열) 적용
- 다른 버튼과 시각적으로 분리 배치
- 해당 액션: 삭제(Delete), 제거(Remove), 초기화(Reset), 나가기(Leave)

---

## 3. 시각 스타일 매핑

| 레벨 | 스타일 | 색상 |
|------|--------|------|
| Primary | Filled | 브랜드 컬러 |
| Secondary | Outline 또는 subtle fill | 중립 계열 |
| Tertiary | Text only | 중립 계열 |
| Destructive | Filled 또는 Outline | 빨간색 계열 |

---

## 4. 레이아웃 규칙

- Primary는 **오른쪽** 또는 **하단 가장 끝**에 배치
- Primary와 Secondary는 시각적으로 그룹화
- Tertiary는 분리 배치 가능
- 한 화면에 노출되는 버튼은 **3~4개 이하** 유지

---

## 5. 상태 처리

- 조건 미충족 시 Primary는 disabled
- 조건 충족 시 Primary가 활성화되며 시각적으로 강조됨

---

## 6. 범위 정의

- "화면(Screen)"은 전체 페이지뿐 아니라 **Modal, Dialog, Drawer 등 독립적인 컨텍스트 단위**를 포함한다
- 각 컨텍스트 단위마다 Primary는 1개 규칙을 적용한다

---

## 7. 피해야 할 패턴

- Primary 버튼이 2개 이상
- 브랜드 컬러를 Secondary/Tertiary에 사용
- Destructive 액션을 Primary로 강조 (삭제 전용 화면 제외)
- 모든 버튼에 동일한 강조 수준 적용
- 한 화면에 5개 이상의 버튼 노출

---

## 8. 설계 알고리즘

새 화면의 버튼 위계를 설계할 때 순서:

1. 사용자의 현재 주요 목표를 파악한다
2. 목표를 완료하는 액션 → **Primary**
3. 대안 경로 또는 보조 액션 → **Secondary** (취소 포함)
4. 없어도 되는 선택적 액션 → **Tertiary**
5. 파괴적 액션 확인 → Primary에서 제외, Destructive 스타일 적용
6. 인지 부하 확인: 노출 액션 ≤ 4개

---

## 9. 출력 형식 (AI 설계 시)

```json
{
  "primary": {
    "label": "",
    "style": "filled",
    "color": "brand"
  },
  "secondary": [],
  "tertiary": [],
  "destructive": [],
  "layout": "",
  "reason": ""
}
```

---

## 10. 예시

### 결제 화면

```json
{
  "primary": { "label": "Pay now", "style": "filled", "color": "brand" },
  "secondary": ["Apply coupon", "Cancel"],
  "tertiary": [],
  "destructive": [],
  "layout": "primary right-aligned, secondary left of primary",
  "reason": "Payment completes the main goal. Cancel is a key alternative path (Secondary). Coupon is supporting action (Secondary)."
}
```

### 삭제 확인 Dialog

```json
{
  "primary": { "label": "Delete", "style": "filled", "color": "destructive" },
  "secondary": ["Cancel"],
  "tertiary": [],
  "destructive": ["Delete"],
  "layout": "primary right-aligned",
  "reason": "Destructive-only dialog. Delete is the sole purpose, so it takes Primary position with destructive styling."
}
```
