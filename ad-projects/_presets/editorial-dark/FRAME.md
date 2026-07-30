---
name: editorial-dark
label: "Editorial Dark (Noir)"
source: courses/classic/ads/0618/A-noir.html
mood: 절제된 다크 럭셔리 · 큰 타이포 · 여백. Aesop/Dyson 톤.
frame: { width: 1080, height: 1920, safe_area_y: [330, 1580] }
font: { family: Pretendard, weights: [400, 600, 800] }
colors:
  bg: "radial-gradient(120% 80% at 50% 0%, #272320 0%, #1a1715 55%, #121010 100%)"
  surface: "#1a1715"
  ink: "#f5f1ea"          # 아이보리 본문 (다크 위)
  muted: "#a59d92"
  muted2: "#9a9189"
  accent_pain: "#ff3bff"    # 마젠타 — "제자리" 고통점에만
  accent_promise: "#ffd400" # ⚠️ 2색 체계 잔재(2026-07-30 폐지). 기본은 마젠타 단색 — 그 기수 「디렉터 합의」에 명시했을 때만 쓴다
  on_promise: "#171310"     # 옐로 위 텍스트
  on_promise_sub: "#5a4b00"
typography:
  eyebrow:    { size: 20, weight: 600, tracking: "0.02em" }
  brand_mark: { size: 23, weight: 800, tracking: "0.22em" }
  badge:      { size: 28, weight: 800 }
  headline:   { size: 104, weight: 800, line: 1.16, tracking: "-0.035em" }
  cta_pre:    { size: 30, weight: 600 }
  cta_big:    { size: 64, weight: 800, tracking: "-0.03em" }
  watermark:  { size: 19, weight: 600, tracking: "0.28em" }
radius: { pill: 999, card: 20 }
components:
  badge: "옐로 pill (#ffd400 bg / #171310 텍스트)"
  cta_bar: "하단 풀블리드 옐로 바 — 좌: pre+big, 우: 다크 pill 버튼(#171310 bg / #ffd400 텍스트)"
  grain: "SVG fractalNoise 오버레이, opacity .05, mix-blend overlay"
---

# Editorial Dark (Noir)

원본 `A-noir.html`의 정제. **다크 위 아이보리 + 대형 타이포 + 여백**으로 "원리·구조"의 무게를 표현한다.

## 색 = 신호 (반드시 지킴)
- **마젠타 `#ff3bff`** = 고통의 지점("제자리")에만 찍는다.
- **옐로 `#ffd400`** = 약속의 지점("달라진다")·CTA·모집 배지에만.
- 그 외 텍스트는 전부 아이보리 `#f5f1ea` / 뮤트 그레이. 색을 남발하면 신호가 죽는다.

## 골격 (상단 → 중앙 → 하단)
1. **상단**: 브랜드 마크 + 모집 배지(옐로 pill) + 얇은 hr 라인
2. **중앙**: 압도적 크기 헤드라인 한 문장 (마젠타 강조어 1개)
3. **하단**: 풀블리드 옐로 CTA 바 (약속 카피 + pill 버튼) + 워터마크

## 모션 노트
- 느리고 절제된 전환(0.6–1s). fade/blur/scale만. 화려한 이펙트 금지.
- 헤드라인은 단어/줄 단위 fade-up. 여백이 신뢰다 — 서두르지 않는다.

## 언제 쓰나
프리미엄·진지·에디토리얼 톤. 클래식과정 같은 "기술이 아니라 기준" 메시지. 기본 추천.
