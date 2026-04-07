# TextArea

JSON 타입: `textarea`
여러 줄 텍스트 입력 필드.

## 언제 쓰는가
- 메모, 설명, 비고 등 긴 텍스트 입력
- 폼/설정 페이지에서 사용
- formgroup 안에서 사용 가능

## 구성 요소
- **A. Label** (Optional): 필드 라벨. 필수 입력 시 빨간 * 추가
- **B. Container**: 여러 줄 입력 영역. 상태에 따라 스타일 변경
- **C. Placeholder**: 입력 전 힌트 텍스트
- **D. Helper Text** (Optional): 안내 문구, 글자 수 제한 정보, 오류 메시지 (기본값 "0/200")
- **E. Scroll** (Optional): 입력 내용이 영역 초과 시 세로 스크롤바 표시

## 조합 예시
- `textarea(label="메모")` → 기본 메모 입력
- `textarea` + `formgroup` → 구조화된 폼 레이아웃
- `textarea` + `card` → 상세 페이지 메모 패널
- `textarea(status="error")` → 유효성 검사 실패 상태

## Props
| prop | 설명 |
|------|------|
| label | 필드 라벨 (예: "메모") |
| placeholder | 입력 힌트 (예: "내용을 입력하세요") |
| helperText | 안내 문구, 글자 수 제한 정보, 에러 메시지 등 (예: "최대 500자", "0/200") |
| status | enabled(기본) / focused / error / disabled |

## 예시
```json
{ "type": "textarea", "label": "메모", "placeholder": "내용을 입력하세요", "helperText": "최대 500자" }
{ "type": "textarea", "label": "사유", "status": "error", "helperText": "필수 항목입니다" }
```

## 주의사항
- helperText 미지정 시 기본값 "0/200" (글자수 카운터) 표시
- TextField과 달리 clearable, leftIcon 옵션 없음
- status=error이면 테두리와 카운터 텍스트가 빨간색으로 변경됨
