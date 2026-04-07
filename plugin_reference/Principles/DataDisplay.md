# Data Display

## 목적

데이터 표현과 테이블 스타일의 일관성을 정의한다.
사용자가 데이터 종류를 색상과 스타일로 즉시 구분할 수 있게 한다.

---

## 1. 데이터 표현 스타일

| 데이터 종류 | 스타일 |
|---|---|
| 금액 | `font-bold text-contents-primary` |
| 양수 (+) | `text-contents-blue font-bold` |
| 음수 (−) | `text-contents-red font-bold` |
| ID / 해시 | `font-mono text-[12px] text-contents-tertiary` |
| 타임스탬프 | `text-[13px] text-contents-secondary` |

---

## 2. 테이블 원칙

### 헤더
```
bg-surface-secondary rounded-t-lg px-3 py-3 border-b border-primary
```

### 데이터 행
```
px-3 py-4 border-b border-secondary hover:bg-surface-secondary
```

### 규칙
- 헤더와 데이터 행의 `px` 값은 반드시 일치시킨다
- StatusBadge 컬럼: 최소 `w-36` — 텍스트 넘침 방지
- ID/해시 컬럼: `font-mono text-[12px] text-contents-tertiary`
