---
name: magenta-block
label: "Magenta Block"
source: courses/classic/ads/0618/C-magenta.html
mood: 색으로 압도하는 대담한 컬러-포워드 · 블록 레이아웃
frame: { width: 1080, height: 1920, safe_area_y: [330, 1580] }
font: { family: Pretendard, weights: [400, 600, 800] }
colors:
  bg: "#ff3bff"           # 마젠타 — 화면을 지배
  block_deep: "#d11fc2"   # 딥 마젠타 블록
  block_dark: "#7a0f86"   # 자주빛 다크 블록
  ink: "#ffffff"          # 마젠타 위 화이트 본문
  ink_dark: "#3a0340"     # 밝은 블록 위 다크 텍스트
  accent_promise: "#ffd400" # 옐로 — 이 프리셋은 마젠타가 배경이라 대비색이 필수. 단색 규칙의 유일한 예외
  on_promise: "#7a0f86"     # 옐로 위 텍스트
typography:
  eyebrow:    { size: 20, weight: 600, tracking: "0.14em" }
  brand_mark: { size: 23, weight: 800, tracking: "0.22em" }
  badge:      { size: 28, weight: 800 }
  headline:   { size: 108, weight: 800, line: 1.12, tracking: "-0.04em" }
  cta_pre:    { size: 30, weight: 600 }
  cta_big:    { size: 64, weight: 800, tracking: "-0.03em" }
  watermark:  { size: 19, weight: 600, tracking: "0.28em" }
radius: { pill: 999, card: 0 }
components:
  badge: "옐로 pill (#ffd400 / #7a0f86 텍스트)"
  block: "색면 블록으로 씬을 분할 — radius 0, 하드 엣지. 딥마젠타·자주다크 블록 대비"
  cta_bar: "하단 옐로 바 — 마젠타 위 최고 대비 CTA"
---

# Magenta Block

**마젠타가 화면을 지배**하는 컬러-포워드. 색면(블록)으로 씬을 나누고, 큰 타이포를 얹는다.
가장 대담하고 눈에 띄는 프리셋 — 스크롤 정지력이 강하다.

## 색 = 신호 (변주)
- 이 프리셋은 마젠타가 **배경 자체**라, "고통 신호"가 아니라 브랜드 컬러로 쓰인다.
- **옐로 `#ffd400`** = 약속점·CTA. 마젠타 위 옐로가 최고 대비를 만든다 — 여기서 옐로가 유일한 신호색.
- 텍스트는 화이트 `#ffffff` / 밝은 블록 위 다크.

## 골격
색면 블록(radius 0, 하드 엣지)으로 화면 분할 → 블록 위에 헤드라인. 딥마젠타·자주다크 블록으로 깊이.
상단 정체성 / 중앙 대형 질문 / 하단 옐로 CTA는 공통.

## 모션 노트
블록이 슬라이드로 밀려 들어오는 대담한 전환. 색면 wipe. editorial보다 빠르고 리드미컬(0.3–0.5s).

## 언제 쓰나
젊고 대담한 톤, 강한 주목이 필요한 리타겟·프로모션. 절제보다 임팩트가 우선일 때.
