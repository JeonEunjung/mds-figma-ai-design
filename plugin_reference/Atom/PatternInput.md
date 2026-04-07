# PatternInput

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/form/PatternInput.tsx

## 언제 쓰는가
- 정해진 패턴 형식의 숫자 입력이 필요할 때
- 주민등록번호, 사업자등록번호, 외국인등록번호 입력
- 날짜(YYYY-MM-DD), 시간(HH:MM) 형식 입력

## 조합 예시
- `PatternInput(type="resident-registration-number")` → 회원 정보 폼
- `PatternInput(type="business-registration-number")` → 사업자 정보 입력
- `PatternInput(type="date")` → 날짜 직접 입력 필드

## Props 요약
| prop | type | 설명 |
|------|------|------|
| type | `"resident-registration-number" \| "alien-registration-number" \| "business-registration-number" \| "time" \| "date"` | 패턴 형식 (필수) |
| onValueChange | `(values: { floatValue, value, formattedValue }) => void` | 값 변경 콜백 |
| + TextField 모든 props | | label, errorText, helperText, size 등 |

## 주의사항
- 각 type별 패턴: `resident-registration-number` = `######-#######`, `business-registration-number` = `###-##-######`, `date` = `####-##-##`, `time` = `##:##`
- `react-number-format`의 `PatternFormat`을 `MdsTextField`에 바인딩한 래퍼
- DatePicker가 있을 경우 PatternInput보다 DatePicker 사용 권장
