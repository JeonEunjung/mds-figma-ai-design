# Text Button

JSON 타입: `textbutton`
텍스트만 있는 링크형 버튼. 배경/테두리 없음.

## 언제 쓰는가
- 하이퍼링크 스타일 액션 (예: "자세히 보기", "더보기")
- 버튼 계층에서 가장 낮은 우선순위
- 공간 절약이 필요할 때

## 구성 요소
- **Text**: 텍스트만 표시 (`Button Text` 노드)
- 배경/테두리 없음, 텍스트 색상으로 구분

## Props
| prop | 설명 |
|------|------|
| label | 버튼 텍스트 |
| size | small / medium / large / xlarge (기본 medium) |
| status | enabled / visited / disabled |

## 조합 예시
- 테이블 셀 안 "상세보기" 링크
- 폼 하단 "비밀번호 찾기" 링크

## 주의사항
- 텍스트 길이가 넘치면 말줄임표(…) 처리
- enabled 색상: #0066FF (파란색), visited: 보라색
- size별 텍스트 크기: small=12, medium=14, large=16, xlarge=18px
