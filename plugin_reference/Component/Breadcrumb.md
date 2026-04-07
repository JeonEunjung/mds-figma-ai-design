# Breadcrumb

JSON 타입: `breadcrumb`
페이지 경로를 단계적으로 표시하는 내비게이션 컴포넌트. 이전 경로로 쉽게 이동할 수 있도록 탐색성을 높여줌.

## 언제 쓰는가
- 상세 페이지, 설정 하위 페이지 등 depth가 있을 때
- main 최상단(card 밖)에 배치
- 목록 페이지에는 불필요

## 구성 요소
- **Link**: 상위 경로 텍스트 (클릭 가능, 회색)
- **Divider**: `/` 자동 삽입
- **Current Location**: 마지막 항목, 현재 위치 (진한 검정)
- **Copy Button**: optional, 경로 복사 버튼

## 조합 예시
- `breadcrumb(items: ["설정", "알림", "메일 설정"])` → 설정 > 알림 > 메일 설정 (마지막이 현재 위치)
- `breadcrumb(items: ["당발송금", "송금 상세"])` → 당발송금 > 송금 상세

## Props
| prop | 설명 |
|------|------|
| items | 경로 텍스트 배열 (최대 3개, 마지막이 현재 위치) |

## 예시
```json
{ "type": "breadcrumb", "items": ["설정", "알림", "메일 설정"] }
```
