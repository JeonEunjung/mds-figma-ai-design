# Color Tokens

## 목적

색상 토큰은 이름만 보고 추론하면 반드시 틀린다.
토큰의 실제 값과 올바른 조합을 정의해 일관성 있는 색상 사용을 보장한다.

---

## 1. 핵심 토큰 실제 값

| 토큰 | 실제 색상 | hex |
|---|---|---|
| `surface-accent1` | 진한 파랑 (primary-700) | `#0066ff` |
| `surface-blue` | 연한 파랑 (primary-50) | `#ebf5ff` |
| `contents-blue` | 진한 파랑 (primary-700) | `#0066ff` |
| `contents-white` | 흰색 | `#ffffff` |

> **`surface-accent1`과 `contents-blue`는 같은 색(`#0066ff`)이다.**
> 둘을 배경+텍스트로 함께 쓰면 글자가 보이지 않는다.

---

## 2. 선택/활성 상태 조합 규칙

| 용도 | 배경 | 텍스트 | 근거 |
|---|---|---|---|
| 선택된 태그, 카운트 배지, 필터 칩 | `bg-surface-blue` | `text-contents-blue` | Chip `isEnabled=true` 구현 |
| 주요 버튼 (Button primary) | `bg-surface-accent1` | `text-contents-white` | Button.tsx 구현 |
| LNB 서브메뉴 선택 항목 | `bg-surface-blue` | `text-contents-blue` | 소프트 강조 |

**`bg-surface-accent1`은 버튼 전용이다.** 태그, 배지, 메뉴 항목의 선택 상태에 쓰지 않는다.

---

## 3. 상태 표시

커스텀 색상 조합 대신 `MdsStatusBadge`를 사용한다.

| type | 배경 토큰 | 용도 |
|---|---|---|
| `inProgress` | `bg-surface-blue` | 진행 중 |
| `done` | `bg-surface-green` | 완료, 성공 |
| `error` | `bg-surface-red` | 실패, 오류 |
| `pending` | `bg-surface-yellow` | 대기, 보류 |
| `backlog` | `bg-surface-secondary` | 미처리 |
