# Changelog

## v0.6.1 (2026-04-11)

### StatusBadge variant 버그 수정
- 테이블 내 StatusBadge의 status variant 전환이 안 되던 문제 수정
- ContentsCell > Status Badge 중첩 구조에서 자식 인스턴스를 순회하여 property 변경하도록 수정
- COMPONENT_MAPPING.md, CLAUDE.md 추가 (트러블슈팅 기록 체계화)

## v0.6.0 (2026-04-11)

### AI 디자인 품질 가드레일 추가

[Impeccable](https://impeccable.style/) 디자인 스킬 프레임워크를 참고하여 AI 생성 품질 규칙을 추가.

- **`QualityGuard.md`**: 안티패턴 방지 규칙
  - 레이아웃 반복 방지 (매번 Top+Table 금지)
  - 버튼 계층 강제 (Primary 1개/화면)
  - 테이블 컬럼 과다 방지, 동일 카드 반복 금지
- **`CognitiveLoad.md`**: 인지 부하 관리
  - 8항목 체크리스트 (단일 초점, 청킹, 점진적 공개 등)
  - 화면 유형별 적정 복잡도 가이드
  - 선택지 수 관리 규칙 (버튼 3~4개, 탭 5개, 컬럼 5~7개)
- **시스템 프롬프트 강화**: 품질 가드레일 규칙을 Claude 프롬프트에 직접 포함

## v0.5.0

- 초기 버전
- 자연어 → Claude → JSON → Figma 렌더링 파이프라인
- 생성 모드 + 편집 모드 (빠른 편집 / Claude 편집)
- 28개 컴포넌트 지원
- 디자인 원칙 6개 (ButtonHierarchy, ColorTokens, ComponentSelection, DataDisplay, DesignPhilosophy, Layout)
