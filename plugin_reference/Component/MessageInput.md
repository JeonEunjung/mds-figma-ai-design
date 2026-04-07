# MessageInput

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/chat/MessageInput.tsx

## 언제 쓰는가
- 채팅 인터페이스 하단의 메시지 입력 영역
- 파일 첨부, 액션 버튼(이모지, 파일 첨부 등)이 있는 메시지 입력창
- 전송 버튼과 textarea가 하나의 컨테이너에 통합되어야 할 때

## 조합 예시
- `MessageInput(sendButtonText="전송")` → 기본 채팅 입력창
- `MessageInput` + `actionButtons=[IconButton(파일첨부), IconButton(이모지)]` → 액션 버튼 있는 입력창
- `MessageInput(files, onFilesChange)` → 파일 첨부 미리보기 + 제거 칩 있는 입력창
- `ChatBubble` 목록 + `MessageInput` → 채팅 화면 전체

## Props 요약
| prop | type | 설명 |
|------|------|------|
| sendButtonText | `string` | 전송 버튼 텍스트 (필수) |
| actionButtons | `JSX.Element[] & { length: 0 \| 1 \| 2 \| 3 }` | 왼쪽 액션 버튼 (최대 3개) |
| files | `string[]` | 첨부된 파일 이름 목록 |
| onFilesChange | `(files: string[]) => void` | 파일 목록 변경 핸들러 |
| disabled | `boolean` | 전체 비활성 (기본 `false`) |
| containerClassName | `string` | 컨테이너 추가 클래스 |
| textareaClassName | `string` | textarea 추가 클래스 |
| + textarea 표준 props | | placeholder, value, onChange 등 |

## 주의사항
- `actionButtons` 최대 3개 제한 (타입 레벨 강제)
- `files`가 있고 `onFilesChange`가 있을 때만 파일 칩 표시 (X 버튼으로 개별 삭제)
- `form` 내부에서 사용 시 `actionButtons`의 button은 자동으로 `type="button"` 적용
- 전송 버튼은 `type="submit"` — 폼과 함께 사용 시 자동 submit 발생
