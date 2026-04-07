# FilePreview

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/viewer/FilePreview.tsx

## 언제 쓰는가
- 이미지 또는 PDF 파일을 탭 전환과 함께 미리볼 때
- 여러 파일을 Tab으로 전환하면서 뷰어로 표시해야 할 때
- 이미지 확대/축소/회전과 다운로드 기능이 필요한 파일 뷰어

## 조합 예시
- `FilePreview` + `FloatingPanel` → 플로팅 파일 뷰어 패널
- `FilePreview` + `Modal(isPageModal)` → 모달 내 파일 미리보기
- `FilePreview` → 상세 페이지 우측 첨부파일 뷰어 섹션

## Props 요약
| prop | type | 설명 |
|------|------|------|
| files | `FilePreviewItem<TKey>[]` | 파일 목록 (필수) |
| selectedFileKey | `TKey` | 현재 선택된 파일 key (필수) |
| onSelectFile | `(key: TKey) => void` | 파일 선택 변경 콜백 (필수) |

### FilePreviewItem 구조
```ts
type FilePreviewItem<TKey> = {
  key: TKey;
  title: string;
} & (
  | { status: 'pending' }         // 로딩 중 → Spinner 표시
  | { status: 'success'; blob: Blob }  // 완료 → 이미지/PDF 렌더링
  | { status: 'error'; error: Error }  // 에러 → 에러 메시지 표시
)
```

## 주의사항
- 파일 타입은 `blob.type`으로 자동 판별: `pdf`이면 PDF 뷰어, 나머지는 이미지 뷰어
- 이미지 뷰어: 드래그 이동, 확대/축소, 회전 지원
- PDF 뷰어: `<embed>` 태그 사용, 브라우저 기본 PDF 뷰어
- `status="pending"` → Spinner, `status="error"` → 빨간 에러 메시지 자동 표시
- 상단 Tab + Dropdown으로 파일 전환, 우측 컨트롤 버튼으로 이미지 조작
- 최소 높이 `min-h-120`
