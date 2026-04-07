# FormGroup

JSON 타입: `formgroup`
폼 필드를 세로로 묶는 그룹 컴포넌트.

## 언제 쓰는가
- 설정 페이지, 입력 폼, 등록 화면에서 여러 필드를 묶을 때
- card 안에 배치

## Props
| prop | 설명 |
|------|------|
| title | 그룹 제목 |
| fields | 필드 배열 `[{ type: "textfield" | "textarea" | "checkbox" | "radio" | "switch", ... }]` |

## 예시
```json
{ "type": "formgroup", "title": "기본 정보", "fields": [
  { "type": "textfield" },
  { "type": "textfield" },
  { "type": "textarea" }
]}
```
