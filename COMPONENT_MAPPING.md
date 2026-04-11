# Component Mapping 가이드

피그마 컴포넌트의 variant/property 변경 시 주의사항을 기록한다.

---

## 핵심 원칙

피그마 컴포넌트는 **중첩 구조**를 가질 수 있다. variant property를 변경할 때:

1. **셀/컨테이너 자체**에 property가 있을 수 있음 (ex: `ContentsCell`의 `contents`, `selected`)
2. **셀 안의 자식 인스턴스**에 property가 있을 수 있음 (ex: `Status Badge`의 `status`)

→ 항상 `cell.findAll(n => n.type === 'INSTANCE')`로 자식을 순회해서 원하는 property를 가진 인스턴스를 찾을 것.

---

## 컴포넌트별 구조

### ContentsCell (테이블 셀)

| type | 키 | 구조 | property 위치 |
|------|----|------|--------------|
| `text` | `ContentsCell.text` | ContentsCell > Text | cell 직접 (텍스트 노드) |
| `badge` | `ContentsCell.badge` | ContentsCell > **Status Badge** (INSTANCE) | **자식 인스턴스**의 `status` property |
| `button` | `ContentsCell.button` | ContentsCell > Button (INSTANCE) | 자식 인스턴스 |

**ContentsCell 자체의 properties**: `contents`, `selected`
**Status Badge의 properties**: `status` (값: `backlog`, `in progress`, `done`, `error`, `pending`)

### StatusBadge (단독 사용)

| 키 | property | 값 |
|----|----------|----|
| `KEYS.StatusBadge.backlog` (기본 키로 import) | `status` | `backlog`, `in progress`, `done`, `error`, `pending` |

**주의**: 5개 키가 KEYS에 등록되어 있지만, 실제로는 **1개 키로 import 후 `setProperties`로 variant 전환**하는 방식을 사용한다.

### Signal

status variant 구조가 StatusBadge와 유사할 수 있음. 확인 필요.

---

## 디버깅 방법

새 컴포넌트에서 variant 전환이 안 될 때:

```javascript
// 1. 해당 인스턴스의 property 이름 확인
var props = instance.componentProperties;
figma.notify('Props: ' + Object.keys(props).join(', '), { timeout: 15000 });

// 2. 자식 인스턴스 확인
var children = cell.findAll(function(n) { return n.type === 'INSTANCE'; });
figma.notify('Children: ' + children.map(function(n) { return n.name; }).join(', '), { timeout: 15000 });

// 3. 자식 인스턴스의 property 확인
children.forEach(function(inst) {
  var p = inst.componentProperties;
  figma.notify(inst.name + ': ' + Object.keys(p).join(', '), { timeout: 10000 });
});
```

## 트러블슈팅 이력

| 날짜 | 컴포넌트 | 문제 | 원인 | 해결 |
|------|---------|------|------|------|
| 2026-04-11 | StatusBadge (테이블 내) | status variant 전환 안 됨 | ContentsCell에서 직접 `status` property를 찾았으나, 실제로는 자식 인스턴스(Status Badge)에 있었음 | `cell.findAll(n => n.type === 'INSTANCE')` 순회 → `status` property 가진 인스턴스 찾아서 `setProperties` |
