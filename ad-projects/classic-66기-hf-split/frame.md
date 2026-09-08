---
version: alpha
name: Broadside — Frame (video / frame layer)
description: >
  Video-first companion to Broadside's design.md. The unit is the frame (1920×1080). Atoms are
  identical and sacred — the two-register surface system (dark ink-black / fire-orange), massive
  Pretendard in lowercase weight 900 treated as graphic primitive, IBM Plex Mono chrome (uppercase,
  0.14em), the single fire-orange accent, the flat plane, and 1px hairline dividers. Composition +
  frame scale rewritten for the frame. Motion out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  ink-black: "#121010"
  ink-black-alt: "#1A181A"
  fire-orange: "#ff3bff"
  cream: "#f5f1ea"
  cream-muted: "#a59d92"
  cream-hint: "#504850"
  border-dark: "#282628"
  ink-on-orange-muted: "rgba(17,17,17,0.75)"
  ink-on-orange-hint: "rgba(17,17,17,0.55)"
  ink-on-orange-faint: "rgba(17,17,17,0.40)"
  ink-on-orange-border: "rgba(17,17,17,0.20)"

typography:
  # — reading ramp —
  body:    { fontFamily: "Pretendard", cqw: 1.2, weight: 400, lineHeight: 1.6 }
  lead:    { fontFamily: "Pretendard", cqw: 1.6, weight: 400, lineHeight: 1.5 }
  caption: { fontFamily: "Pretendard", cqw: 0.9, weight: 400, lineHeight: 1.5 }
  label:   { fontFamily: "IBM Plex Mono", cqw: 0.72, weight: 500, tracking: "0.14em", upper: true }
  # — display / hero ramp (Pretendard, lowercase, negative tracking) —
  h3:      { fontFamily: "Pretendard", cqw: 2.8, weight: 600, lineHeight: 1.2, lower: true }
  quote-text:{ fontFamily: "Pretendard", cqw: 3.8, weight: 700, lineHeight: 1.15, tracking: "-0.02em", lower: true }
  h2:      { fontFamily: "Pretendard", cqw: 4.5, weight: 700, lineHeight: 1.1, tracking: "-0.02em", lower: true }
  stat-value:{ fontFamily: "Pretendard", cqw: 5.5, weight: 900, lineHeight: 1.0, tracking: "-0.04em" }
  h1:      { fontFamily: "Pretendard", cqw: 7.5, weight: 800, lineHeight: 0.9, tracking: "-0.03em", lower: true }
  fadelist-item:{ fontFamily: "Pretendard", cqw: 7.5, weight: 900, lineHeight: 1.0, tracking: "-0.03em", lower: true }
  quote-mark:{ fontFamily: "Pretendard", cqw: 10.0, weight: 900, lineHeight: 0.6 }
  fadelist-title:{ fontFamily: "Pretendard", cqw: 10.5, weight: 900, lineHeight: 0.9, tracking: "-0.04em", lower: true }
  display: { fontFamily: "Pretendard", cqw: 13.0, weight: 900, lineHeight: 0.88, tracking: "-0.04em", lower: true }

spacing:
  pad-x: "5.5cqw"
  pad-y: "5.5cqw"
  gap-lg: "3.5cqw"
  gap-md: "2cqw"
  gap-sm: "1cqw"

components:
  registers:
    dark: "ground {colors.ink-black}, text {colors.cream}, accent {colors.fire-orange}"
    orange: "ground {colors.fire-orange}, text {colors.ink-black}"
    description: "Two surfaces only — no cream/paper register. One register per frame."
  slide-chrome:
    rule: "1px solid {colors.border-dark} (dark) / 20% ink (orange)"
    placement: "top + bottom bars (label left, number right)"
    description: "SUPPRESSED on cover/chapter/statement/quote/end — declarative frames let type fill the field."
  kicker:
    typography: "{typography.label}"
    color: "{colors.fire-orange} (dark) / 55% ink (orange)"
    description: "Uppercase mono eyebrow."
  rule:
    backgroundColor: "{colors.fire-orange} (dark) / {colors.ink-black} (orange)"
    size: "36×2px"
    description: "Stub accent bar — the system's only ornament."
  broadside-num:
    typography: "{typography.label}"
    placement: "top-left of orange cover/chapter, low opacity"
    description: "Mono catalogue numeral."
  stat-card:
    borderTop: "1px solid {colors.border-dark}"
    typography: "{typography.stat-value} (orange on dark / ink on orange) + {typography.body} + {typography.label}"
    description: "Top-border-only block, no other borders."
  bullet:
    marker: "orange `/` mono via ::before"
    typography: "{typography.lead}"
    description: "Capped at THREE items."
  bar-track:
    borderLeft: "1px solid {colors.border-dark}"
    bars: "{colors.cream-hint}, one .accent {colors.fire-orange}"
    typography: "{typography.label} axis"
    description: "Vertical bar chart, left axis only."
  compare-panel:
    layout: "two equal panels split by a 1px vertical rule"
    payoff: "right panel may fill {colors.fire-orange}"
    description: "Before/after."
  fadelist:
    typography: "{typography.fadelist-item} ×3 at opacity 1.0/0.5/0.22 + {typography.fadelist-title}"
    description: "Three stacked words + one oversized title opposite."
---

# Broadside — Frame (video / frame layer)

## Brand adaptation (READ FIRST — the frontmatter is the source of truth)

This is the **broadside** preset remixed onto the captured brand. The YAML frontmatter above (colors · typography · components) is **normative and already correct — use it verbatim.** The prose below is the ORIGINAL preset's intent; read it THROUGH the frontmatter:

- **Fonts** — already set to **Pretendard** (display) / **Pretendard** (body); ignore any preset font name lingering in prose.
- **Colors** — use the frontmatter hex; preset color NAMES in prose (e.g. "cobalt", "cream") mean the remapped brand values.


## Overview

Broadside at frame scale is a **protest-poster system where type is so large it stops reading as
text and becomes graphic primitive.** Pretendard `display` at 13cqw puts a single lowercase word
nearly across the frame. The system runs in **two registers**: a dark ink-black ground with cream
text for documentation, and a fire-orange ground with dark ink for declaration. Fire-orange is the
_only_ color — accent on dark, environment on orange. The plane is flat; hierarchy is weight, size,
and 1px hairlines.

**Pretendard** carries every text role from display to body — expressive range from weight (400–900)
and size, not face contrast. **IBM Plex Mono** is chrome only (numbers, kickers, tags, axis labels,
the `/` bullet marker), always uppercase and tracked. Display is **lowercase** — the system's most
distinctive single decision, a deliberate inversion of the brutalist norm.

**Key characteristics at frame scale:**

- **Two registers** — dark (cream text) / orange (ink text). No cream/paper register.
- **Massive lowercase Pretendard 900**, negative-tracked, as graphic primitive (display 13cqw).
- **Fire-orange is the only color** — accent on dark, full environment on orange.
- **IBM Plex Mono chrome** — uppercase, 0.14em; the `/` bullet marker; mono catalogue numbers.
- **Flat plane** — no shadow, no radius (save nav dots), no gradient; 1px hairlines carry structure.
- **Low density** — one statement per frame, bullets capped at three, chrome suppressed on declarative frames.

## The Frame

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — exactly **one display moment dominates** at 3–6× everything else; nothing competes.
- **Silence** — declarative frames read **45–55% empty**; the **stat grid is the one dense exception**.
- **Restraint** — **one register per frame**; **fire-orange is the only color** (accent on dark, environment on orange); one display moment; bullets capped at three.
- **Reference** — aim at **broadside printing / a SPACE10 report / a Wim Crouwel grid with one loud color**; failure looks like a **multi-accent corporate slide deck**.

- **Primary:** 1920×1080 (16:9). Type authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`; or carry the source's `vw` 1:1).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `pad-x`/`pad-y` 5.5cqw — deliberately tight so the massive type crowds the frame edge.

**The container law (load-bearing).** Every frame ground sets `container-type: size`; ALL
frame-relative units are `cqw`/`cqh` against it — never `vw` (a `vw`-sized frame inflates when not
full-screen). 1px hairlines stay 1px.

## Colors

Tokens identical to the source, in two registers. **Dark:** `{colors.ink-black}` ground,
`{colors.cream}` text, `{colors.fire-orange}` accent (kickers, accent stat, bullet `/`, lead bar,
quote mark, rule stub). **Orange:** `{colors.fire-orange}` ground, `{colors.ink-black}` headlines +
body, with the dark-ink overlays (75/55/40/20%) as the muted tones. Choose one register per frame
and commit. **No second accent color** — on orange, emphasis is weight/opacity on the ink, never a
new hue. Cream text on orange does not exist (ink-on-fire is absolute).

## Typography

Two ramps. The **reading ramp** (Pretendard body 1.2cqw, mono label 0.72cqw) carries copy + chrome; the
**display ramp** (Pretendard `h2` 4.5cqw → `display` 13cqw, weight 700–900) carries every statement.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw**; mono labels are chrome only.
- **Fit-to-measure:** size the headline to its length. Cap the block at **≤ 78cqw**; ≤2 words → `display`; 3–4 → `h1`; 5+ → `h2`. Broadside packs only ONE display moment per frame.
- **Pretendard display is lowercase, weight 700–900, negative-tracked** (−0.04em largest, −0.02em h2). **Mono chrome is uppercase, 0.1em+.** No italic, no underline, no uppercase display.

## Depth & Surface

Flat plane, the only technique. Hierarchy from:

- **Weight + size contrast** — the dominant signal (900 lowercase display).
- **1px hairlines** — chrome bars, stat-card top, compare divider, bar-track left, chart baseline.
- **Color shift** — orange on ink, ink on cream, cream-muted on cream.
- **Negative space** — generous, intentional empty regions.

**Ceiling:** no box-shadow, no elevation, no rounded surface (save nav dots), no gradient ground.

## Shapes

- **0 radius everywhere** except nav dots (50%). Cards, panels, tags, stat blocks, bars — sharp rectangles.

## Components

- **registers** — the two-surface system. **slide-chrome** — optional hairline bars, suppressed on declarative frames.
- **kicker** (mono eyebrow) / **rule** (36×2 stub) / **broadside-num** (catalogue mark) — the chrome ornament set.
- **stat-card** (top-border only) / **bullet** (orange `/`, max 3) / **bar-track** (one accent bar) / **compare-panel** (orange payoff) / **fadelist** (1.0/0.5/0.22 stack).

## Frame Treatments

> Recipe: ground · register · composes · focal · chrome · accent · silence · Fixed/Free · density.
> One statement per frame; chrome suppressed on declarative frames.

### 1 · Cover (identity · move: massive type · ORANGE register · left)

**Ground** fire-orange. **Composes** broadside-num, rule, kicker, display, lead. **Focal** a 1–2 word
Pretendard `display` (13cqw) lowercase in ink, left-anchored, over a small ink rule stub + mono kicker; a
Pretendard lead line beneath in 75% ink. **Chrome** mono catalogue number top-left, mono meta top-right
(no chrome bars). **Accent** the ink itself is the pop on orange. **Silence** ~45%. **Fixed** ink-on-fire,
lowercase 900, flat. **Free** the word, kicker, lead. **Density** low.

### 2 · Statement (declarative · move: type IS composition · DARK register · left)

**Ground** ink-black. **Composes** kicker, display. **Focal** a 2–4 word Pretendard `display`/`h1`
lowercase in cream, with ONE clause inked `{colors.fire-orange}`. **Chrome** mono kicker; no bars.
**Accent** the orange clause. **Silence** ~55%. **Fixed** lowercase 900, one orange clause, flat.
**Free** the statement, which clause is orange. **Density** low.

### 3 · Stat Grid (data · move: top-border cards · DARK · the dense frame)

**Ground** ink-black, chrome bars present. **Composes** slide-chrome, kicker, 3× stat-card. **Focal** a
row of three top-border-only stat-cards — big Pretendard-900 numeral in `{colors.fire-orange}`, Pretendard
label, mono note. **Chrome** top + bottom hairline bars (label + number). **Accent** the orange
numerals. **Silence** moderate — the density exception. **Fixed** top-border-only cards, orange
numerals, 1px hairlines. **Free** figures (from script), labels. **Density** dense-exception.

### 4 · Fadelist (narrative · move: opacity stack · DARK)

**Ground** ink-black. **Composes** fadelist (3 stacked Pretendard-900 words at 1.0/0.5/0.22), fadelist-title.
**Focal** the three-stage word stack opposite an oversized display title in `{colors.fire-orange}`
(before/during/after). **Accent** the orange title. **Silence** moderate. **Fixed** the opacity
ladder, lowercase 900. **Free** the three words, the title. **Density** low-moderate.

### 5 · Pull Quote (quote · move: oversized mark · DARK · left)

**Ground** ink-black, chrome suppressed. **Composes** quote-mark, quote-text, attribution. **Focal** a
Pretendard `quote-text` (700, lowercase) at ≤78cqw under an oversized fire-orange `quote-mark` (10cqw,
line-height 0.6). **Chrome** mono attribution (name + role). **Accent** the orange quote mark. **Silence**
~50%. **Fixed** orange mark, lowercase quote. **Free** quote, attribution. **Density** low.

### 6 · Compare (argument · move: split + orange payoff · DARK→ORANGE)

**Ground** ink-black left panel + fire-orange right (payoff) panel, 1px divider. **Composes**
compare-panel pair, kicker, h3. **Focal** two panels — left documents (cream on dark), right declares
(ink on orange). **Chrome** mono panel labels. **Accent** the orange payoff panel. **Silence** moderate.
**Fixed** ink-on-fire right panel, 1px divider, flat. **Free** the before/after content. **Density** standard.

## Composition Rules

### Do

- Set every Pretendard display in **lowercase weight 900**, negative-tracked — the system's signature.
- Use **fire-orange as full environment** on declarative frames, the **lone accent** on dark.
- Keep chrome in **IBM Plex Mono uppercase, 0.14em**; use the `/` mono bullet marker.
- **Cap bullets at three; one statement per frame**; build hierarchy from weight, size, 1px hairlines.
- Suppress chrome bars on cover/chapter/statement/quote/end; let type fill the field.
- Lean left on most frames; the type IS the composition.

### Don't

- Never uppercase Pretendard display; never add a second accent color.
- Never put cream text on orange (ink-on-fire is absolute); never a cream/paper register.
- No drop shadow, no rounded surface (save nav dots), no gradient ground.
- No serif companion; chrome is never Pretendard.
- Don't pack two display moments into one frame; don't blow a long line edge-to-edge — step down.

## Aspect-Ratio Behavior

| Treatment  | 16:9                       | 9:16                       | 1:1              |
| ---------- | -------------------------- | -------------------------- | ---------------- |
| Cover      | word left, lead below      | word top, lead below       | centered word    |
| Statement  | display left               | display stacked taller     | display centered |
| Stat Grid  | 3 across                   | 3 stacked                  | 2+1              |
| Fadelist   | stack + title side-by-side | stack over title           | stack over title |
| Pull Quote | mark + quote left          | mark top, quote below      | centered         |
| Compare    | side-by-side panels        | stacked (dark over orange) | stacked          |

`pad-x` holds tight on the short edge; re-step display so the one big line stays ≤78cqw and above the
1.4cqw floor. Mono chrome stays Latin/digit-only.

## Approved Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder (the dashed `img-placeholder` at 55cqh). The system supplies type and one color, not brands.

## Numerals & Claims (hard rule)

Never invent figures, percentages, dates, or counts at frame scale. Render slots as `— figure —`,
`{metric}`, `NN%`. Stat-card numerals and bar heights carry placeholders until the script supplies
them. Catalogue numbers (No. 01) are decorative chrome and may be sequential.

## Pre-Render Self-Audit

- **Squint** — exactly one display moment dominates; nothing competes.
- **Silence** — declarative frames ~45–55% empty; only the stat grid runs dense.
- **Register** — one register per frame; ink-on-fire on orange, cream on dark; no second hue.
- **Type** — Pretendard lowercase 900 negative-tracked, fit-to-measure; mono chrome uppercase 0.14em; ≥1.4cqw floor.
- **Depth** — 0 shadow, 0 radius (save nav dots); 1px hairlines only.
- **Bullets** — capped at three, orange `/` marker.
- **Fabrication** — every numeral traces to the script, else placeholder.

## Known Gaps

- **Motion intentionally out of scope.** frame.md specifies composition only; the source's 0.8s deck slide + per-element entry animations are deck mechanics.
- **Pretendard + IBM Plex Mono via Google Fonts**; Noto Sans SC is the CJK fallback (the lowercase-display signal has no CJK equivalent — the two-register color system carries the identity, per the source).
- **9:16 / 1:1 are guidance**; verify the one big line stays ≤78cqw and above the floor per ratio.
- Bars, compare panels, and the dashed image placeholder are CSS-only; no external imagery is required.


---

# 소옴 브랜드 정본 — 프리셋보다 우선하는 규칙

> 아래는 `ad-projects/_brand/frame.md`에서 승계된다. 프리셋이 무엇이든 이 절은 지킨다.

## 색 = 신호 (반드시 지킴)

- **강조색은 마젠타 `#ff3bff` 하나다.** 한 씬에서 가장 중요한 단어 **하나**에만 찍는다.
  색이 곧 카피의 강조다.
- 그 외 텍스트는 아이보리 `#f5f1ea` / 뮤트 그레이. 색을 남발하면 신호가 죽는다.
- **이야기의 전환은 색이 아니라 카피·연출(취소선·밑줄·모션)이 진다.**

> 2026-07-30 개정으로 2색 체계(마젠타=고통 / 옐로 `#ffd400`=약속)는 **폐지**됐다. 실제 소재에서
> 2색이 룩을 산만하게 만들었다(65기 영상) — 광고주 결정. 그 기수 「디렉터 합의」에 명시했을
> 때만 예외로 옐로를 쓴다.

## 톤 & 보이스

- **진지하고 직접적.** 위로하지 않고 문제를 정확히 짚는다.
- **짧고 단호한 문장.** 감성적이되 감상적이지 않다. 수치와 구체성으로 신뢰를 얻는다.
- **여백은 신뢰다.** 서두르지 않는다.
- **한 문장, 압도적 크기.** 헤드라인이 화면의 주인공이다.

## 권장어

구조 · 체계 · 이해 · 원리 · 재현 · 분석 · 기초 · 눈이 트이다 · 자신감 · "처음 보는 커트도"

## 금지 (하나라도 있으면 FAIL)

**표현** — 출처: `.claude/brand-context.md` Words to avoid · `.claude/creative-rubric.md` 차원 2

- `스타일` 단독 사용 → `형태` 또는 `헤어스타일`
- `이론` 단독 → `구조` · `체계`
- 한 단락에 `원리` 2회 이상 반복
- `최고` · `최강` · `넘버원` · `업계 1위` 등 과장
- 이모지 7개 이상

**사실** — 출처: `courses/classic/campaigns/66기.md` 「쓰지 않기로 한 것」 (2026-09-05 광고주 확인)

- **`36년`** — 미검증 (강사 이력의 검증된 값은 **교육경력 16년**)
- **`60기 배출`** — 불일치 (검증된 값은 **클래식 64기 배출**)
- **박성훈 수치** (`단골 3명→11명`, `1달 ROI 회수`) — 미검증
- **수강생 후기 인용 전면 금지** — 랜딩 게시판 후기는 실제 수강생 작성분이 아님이 확인됨.
  광고주가 동의받은 실제 후기를 확보하면 그때 해금한다.
- **강사 카메라 발화 / 대사체 인용** — 심일보 강사 촬영 불가(광고주 확인). 실제 발화가 아닌
  문장을 강사 입에 넣지 않는다. 자막으로 처리한다.

> ⚠️ `.claude/brand-context.md`(2026-03-16)에는 위 금지 사실들이 아직 Proof Points로 남아 있고,
> 「Visual identity」의 색·폰트(차콜 `#1e1e1e` / 라임 `#eefd95` / 사이언 `#00B8FF` / Raleway)도
> 실제 소재와 다르다. **색·폰트·증거는 이 파일이 정본이고 brand-context.md보다 우선한다.**
> brand-context.md는 페르소나·VoC·반론 처리에 대해서는 여전히 유효하다.

## 검증된 강사 이력 (이 값만 쓴다)

심일보 수석강사 · 런던 비달사순 TTC 수료 · 비달사순 커트콘테스트 2위 · 교육경력 16년 ·
클래식 64기 배출

## Do / Don't

| Do | Don't |
|---|---|
| 강조어 1개에만 마젠타 | 여러 단어에 색 뿌리기 |
| 씬 역할에 맞는 모션을 매번 고른다 | 직전 기수 모션을 이유 없이 그대로 답습 |
| 검증된 사실만 화면에 | 미검증 수치·허구 후기 |
| 여백을 남긴다 | 화면을 채워 밀도를 올린다 |
| 문제를 정확히 지목 | 위로·응원·장황한 수식 |
