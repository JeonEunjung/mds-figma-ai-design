# ChatBubble

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/chat/Bubble.tsx

## 언제 쓰는가
- 채팅 인터페이스에서 메시지, 이미지, 파일을 말풍선 형태로 표시할 때
- 발신(`right`) / 수신(`left`) 방향을 구분해야 할 때
- 이미지 또는 파일 첨부 메시지에 다운로드 버튼을 함께 표시할 때

## 조합 예시
- `ChatBubble(type="text", variant="right")` → 내가 보낸 텍스트 메시지
- `ChatBubble(type="text", variant="left")` → 상대방 텍스트 메시지
- `ChatBubble(type="image", fileUrl)` → 이미지 메시지 (다운로드 버튼 자동 포함)
- `ChatBubble(type="file", fileName, fileUrl)` → 파일 메시지
- `ChatBubble` + `MdsProfile` → 프로필 + 말풍선 조합
- `ChatBubble` 목록 + `MessageInput` → 채팅 화면 전체

## Props 요약
| prop | type | 설명 |
|------|------|------|
| type | `"text" \| "image" \| "file"` | 메시지 타입 (필수) |
| variant | `"left" \| "right"` | 방향 (필수): left=수신, right=발신 |
| time | `string` | 메시지 시간 표시 (필수) |
| message | `string` | 텍스트 내용 (`type="text"` 시 필수) |
| fileUrl | `string` | 파일 URL (`type="image" \| "file"` 시) |
| fileName | `string` | 파일명 (`type="file"` 시 필수) |
| onClick | `() => void` | 다운로드 클릭 커스텀 핸들러 (없으면 자동 다운로드) |

## 주의사항
- `type="image"`: 이미지 높이 고정 `h-48`, 다운로드 버튼 자동 포함
- `type="file"`: 파일 아이콘 + 파일명 표시, 다운로드 버튼 포함
- 최대 너비 `max-w-51` 고정
- `variant="right"`: `bg-surface-tertiary rounded-tr-none`
- `variant="left"`: `bg-surface-secondary rounded-tl-none`
