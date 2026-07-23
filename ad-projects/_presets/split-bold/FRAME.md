---
name: split-bold
label: "Split Bold (Before/After)"
source: courses/classic/ads/0618/D-split.html · remotion/src/ClassicSplitAd.tsx
mood: 정체 → 변화를 화면 분할로 시각화 · 웜다크 + 마젠타/옐로 강렬
frame: { width: 1080, height: 1920, safe_area_y: [330, 1580] }
font: { family: Pretendard, weights: [400, 600, 800] }
colors:
  bg: "#15120f"           # 웜다크 (BEFORE 면)
  card: "#26221f"
  ink_dark: "#171310"
  light: "#f5f1ea"        # 아이보리 텍스트
  accent_pain: "#ff3bff"    # 마젠타 — 고통/BEFORE 강조
  accent_promise: "#ffd400" # 옐로 — 약속/AFTER·CTA
  on_promise: "#5a2a00"     # 옐로 위 텍스트 (진한 브라운)
  grad_after: "linear-gradient(120deg, #ff3bff 0%, #ffba2a 100%)"
typography:
  eyebrow:    { size: 22, weight: 800, tracking: "0.08em" }   # BEFORE·AFTER 라벨
  brand_mark: { size: 23, weight: 800, tracking: "0.22em" }
  badge:      { size: 28, weight: 800 }
  headline:   { size: 96, weight: 800, line: 1.17, tracking: "-0.035em" }
  after_big:  { size: 84, weight: 800, tracking: "-0.03em" }
  cta_pre:    { size: 30, weight: 600 }
  watermark:  { size: 19, weight: 600, tracking: "0.28em" }
radius: { pill: 999, card: 24 }
components:
  eyebrow: "BEFORE·지금 / AFTER·8주 뒤 라벨 — 분할의 두 면을 표시"
  after_panel: "그라데이션 면(grad_after)이 솟아오르며 '완전히 달라집니다'"
  arrow: "경계에서 팝/바운스하는 화살표 — 정체→변화 전환 신호"
  cta: "옐로 pill 버튼 (#ffd400 / #5a2a00)"
---

# Split Bold (Before/After)

**화면 분할로 "정체 → 변화"를 시각화**한다. 상단 BEFORE(고통) / 하단 AFTER(약속·그라데이션)가
솟아오르며 대비된다. remotion의 `ClassicSplitAd`가 이 룩의 코드 버전.

## 색 = 신호 (반드시 지킴)
- **마젠타 `#ff3bff`** = BEFORE·고통점 강조.
- **옐로 `#ffd400` / 그라데이션** = AFTER·약속·CTA. 분할의 "변화하는 쪽"에 색이 몰린다.
- 베이스는 웜다크 `#15120f`, 텍스트 아이보리 `#f5f1ea`.

## 골격 (분할)
- **BEFORE 면(상단)**: 브랜드·배지·질문 헤드라인 (마젠타 강조)
- **경계**: 화살표가 팝/바운스 (정체→변화 신호)
- **AFTER 면(하단)**: 그라데이션 면이 솟으며 "완전히 달라집니다" + 옐로 CTA
- 비율별 분할 방향: 9:16·1:1 상하 분할 / 1.91:1 좌우 분할.

## 모션 노트
AFTER 면이 **솟아오르는(rise/spring)** 것이 핵심 동작. 화살표 팝. remotion `ClassicSplitAd.tsx`의
`panelRise` 스프링·`arrowPop`을 GSAP로 재현.

## 언제 쓰나
Before/After 대비가 메시지의 핵심일 때. "배웠는데 제자리 → 8주 뒤 달라짐" 같은 변화 서사.
(주의: 이 룩은 remotion `ClassicSplitAd` 1회성 버전이 이미 있음. Hyperframe으로 새로 갈 때 이 프리셋 사용.)
