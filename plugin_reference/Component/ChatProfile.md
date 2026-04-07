# ChatProfile

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/chat/Profile.tsx

## 언제 쓰는가
- 채팅 참여자의 프로필 이미지와 이름을 표시할 때
- ChatBubble 옆에 발화자 정보를 표시할 때
- 상담원/고객 목록에서 사용자 아이콘을 표시할 때

## 조합 예시
- `ChatProfile(username, avatarUrl)` → 아바타 이미지가 있는 프로필
- `ChatProfile(username)` → 이미지 없을 때 기본 아이콘 표시
- `ChatProfile` + `ChatBubble(variant="left")` → 수신 메시지 + 발화자 프로필

## Props 요약
| prop | type | 설명 |
|------|------|------|
| username | `string` | 사용자 이름 (필수, 최대 40px 너비 말줄임) |
| avatarUrl | `string` | 아바타 이미지 URL (없으면 기본 아이콘 표시) |

## 주의사항
- 프로필 이미지/아이콘 크기 고정 `size-10` (40px)
- 이름은 최대 `max-w-[40px]` 너비로 말줄임 처리
- `avatarUrl` 없을 때 `TbUserFilled` 아이콘으로 대체
