# TextField

JSON 타입: `textfield`
단일 행 텍스트 입력 필드. 입력값과 상태를 명확하게 전달하며 Label, Helper Text, Prefix, Suffix 등 보조 요소를 포함할 수 있음.

## 언제 쓰는가
- 사용자로부터 텍스트 입력을 받는 모든 단일 라인 입력 필드
- 이름, 이메일, 계좌번호 등 짧은 텍스트 입력
- 에러 메시지, 도움말, 레이블, 필수 표시가 필요한 폼 필드
- formgroup 안에서 사용 가능

## 구성 요소
- **A. Label** (Optional): 입력 필드 용도 설명. 필수 입력 시 빨간 * 추가
- **B. Container**: 입력 영역. size별 높이 (small=32px, medium=40px, large=48px)
- **C. Helper Text** (Optional): 추가 안내 문구, 오류 메시지로 활용
- **D. Placeholder**: 입력 전 힌트 텍스트. 입력값이 들어오면 사라짐
- **E. Prefix** (Optional): 왼쪽 아이콘/텍스트 (검색 아이콘, 통화 기호, 단위 등)
- **F. Suffix** (Optional): 오른쪽 아이콘/텍스트 (지우기 버튼, 단위, 액션 아이콘)

## 조합 예시
- `textfield(label, required=true)` → 폼의 필수 입력 필드 (라벨 옆 빨간 *)
- `textfield(status="error", helperText="...")` → 유효성 검사 실패 상태
- `textfield` + `formgroup` → 구조화된 폼 레이아웃
- `textfield(status="disabled")` → 입력 불가 상태

## Props
| prop | 설명 |
|------|------|
| label | 필드 라벨 (예: "이메일") |
| placeholder | 입력 힌트 (예: "example@moin.com") |
| helperText | 안내 문구 또는 에러 메시지 (예: "업무용 이메일을 입력하세요") |
| status | enabled(기본) / focused / error / disabled |

## 예시
```json
{ "type": "textfield", "label": "이메일", "placeholder": "example@moin.com", "helperText": "업무용 이메일을 입력하세요" }
{ "type": "textfield", "label": "계좌번호", "status": "error", "helperText": "올바른 계좌번호를 입력하세요" }
{ "type": "textfield", "label": "참조", "status": "disabled" }
```

## 주의사항
- status=error이면 helperText가 빨간색으로 표시됨 (에러 메시지 역할)
- Prefix/Suffix는 Figma 컴포넌트 프로퍼티(`Prefix#5204:0`, `Suffix#5204:6`)로 표시/숨김 제어
- size별 Container 높이: small=32px, medium=40px, large=48px
