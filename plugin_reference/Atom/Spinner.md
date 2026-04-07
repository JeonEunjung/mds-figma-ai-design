# Spinner

JSON 타입: `spinner`
로딩/처리 중 상태 표시.

## 언제 쓰는가
- 데이터를 불러오는 중 로딩 상태를 표시할 때
- 인라인 로딩: 컴포넌트 내부에 작은 스피너를 배치 (size 32)
- 전체 화면 로딩: 화면 전체를 덮는 오버레이 위에 스피너 표시 (size 48 또는 64)
- API 요청 중, 파일 업로드 중, 페이지 전환 중 등

## 조합 예시
- `spinner(size=32)` → 컴포넌트 내 인라인 로딩
- `spinner(size=64)` → 전체 화면 로딩 오버레이 (큰 스피너)
- 테이블 로딩은 `table`의 `state: "loading"` 사용 (별도 spinner 배치 불필요)

## Props
| prop | 설명 |
|------|------|
| size | 32 / 48 / 64 (기본 32). 32=sm, 48=md, 64=lg |

## 예시
```json
{ "type": "spinner", "size": 32 }
{ "type": "spinner", "size": 64 }
```

## 주의사항
- 테이블 로딩 상태에서는 spinner를 직접 배치하지 말고 `table`의 `state: "loading"`을 사용
- 인라인 로딩(작은 영역)에는 size 32, 전체 화면 로딩에는 size 48 또는 64 사용
- 색상은 파란색(blue) 고정
