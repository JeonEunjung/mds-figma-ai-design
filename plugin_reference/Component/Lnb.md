# Lnb

> ⚠ 미구현 — 이 컴포넌트는 아직 플러그인에서 렌더링할 수 없습니다. JSON에 포함하지 마세요.
source: src/navigation/Lnb/index.tsx

## 언제 쓰는가
- 어드민/대시보드 레이아웃의 좌측 사이드바 네비게이션
- 아이콘 전용(닫힌) / 아이콘+텍스트(열린) 두 가지 상태를 토글
- 카테고리 → 서브 메뉴 계층 구조 네비게이션
- 현재 URL에 따라 자동으로 활성 메뉴 항목 강조

## 조합 예시
- `Lnb` + `main 콘텐츠` → 전체 페이지 레이아웃 (fixed 좌측 + 나머지 콘텐츠)
- `Lnb` + `Breadcrumb` + 카드 → 표준 어드민 페이지 구조
- `pages/_shared/InlineLnb.tsx` → Storybook/개발용 간소화된 Lnb

## Props 요약
| prop | type | 설명 |
|------|------|------|
| navigationCategories | `Category[]` | 네비게이션 카테고리 목록 (필수) |
| utilityCategories | `UtilityCategory[]` | 하단 유틸리티 카테고리 (설정, 로그아웃 등) |
| opened | `boolean` | 사이드바 열림/닫힘 상태 (필수) |
| onChangeOpened | `(opened: boolean) => void` | 열림 상태 변경 콜백 (필수) |
| selectedHref | `string` | 현재 페이지 URL (활성 메뉴 강조용) |
| linkAs | `ElementType` | 링크 컴포넌트 (`<a>` 기본, Next.js Link 주입 가능) |

### Category 구조
| 필드 | type | 설명 |
|---|---|---|
| key | `React.Key` | 고유 키 |
| icon | `IconType` | 카테고리 아이콘 |
| title | `string` | 카테고리 이름 |
| menus | `MenuItem[]` | 하위 메뉴 목록 |
| disabled | `boolean` | 비활성 |

### MenuItem 타입
- `LeafItem`: href 링크 또는 onClick 핸들러를 가진 단말 메뉴
- `GroupItem`: `{ title, children: LeafItem[] }` 아코디언 그룹
- `"spacer"`: 빈 공간 구분자

## 주의사항
- `position: fixed` — 페이지 레이아웃에서 LNB 너비만큼 margin/padding 필요 (내부 spacer div 자동 생성)
- 닫힌 상태 `w-12(48px)`, 열린 상태 `w-62(248px)`
- `selectedHref`로 현재 카테고리 자동 인식 후 하이라이트
