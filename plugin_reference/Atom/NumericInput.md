# NumericInput

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/form/NumericInput.tsx

## 언제 쓰는가
- 숫자만 입력받되 자동 포맷팅이 필요할 때
- 금액 입력 (1,234,567 형식의 천 단위 구분자)
- 일반 숫자 입력 (포맷팅 없이 숫자만 제한)

## 조합 예시
- `NumericInput(type="currency")` → 송금 금액 입력
- `NumericInput(type="plain")` → 수량, 코드 등 단순 숫자 입력
- `NumericInput` + `MdsCard` → 상세 폼 금액 섹션

## Props 요약
| prop | type | 설명 |
|------|------|------|
| type | `"plain" \| "currency"` | 입력 형식 (필수) |
| onValueChange | `(values: { floatValue, value, formattedValue }) => void` | 값 변경 콜백 |
| value | `string \| number` | 제어 컴포넌트 값 |
| + TextField 모든 props | | label, errorText, helperText, size 등 |

## 주의사항
- `currency` 타입은 천 단위 쉼표 자동 삽입 (예: `1234567` → `1,234,567`)
- `onValueChange`의 `floatValue`(숫자), `value`(포맷 없는 문자열), `formattedValue`(포맷된 문자열) 중 용도에 맞게 선택
- `react-number-format`의 `NumericFormat`을 `MdsTextField`에 바인딩한 래퍼
