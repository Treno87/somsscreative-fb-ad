---
name: somss-brand
label: "소옴크리에이티브 — 브랜드 정본"
source: courses/classic/ads/0618/PHILOSOPHY.md (2026-07-30 개정) · ad-projects/_presets/editorial-dark/FRAME.md · .claude/brand-context.md
mood: 진지하고 직접적. 절제된 다크 + 큰 타이포 + 여백. 위로하지 않고 문제를 정확히 짚는다.
frame: { width: 1080, height: 1920, safe_area_y: [330, 1580] }
font: { family: Pretendard, weights: [400, 600, 800] }
colors:
  bg: "radial-gradient(120% 80% at 50% 0%, #272320 0%, #1a1715 55%, #121010 100%)"
  surface: "#1a1715"
  ink: "#f5f1ea"
  muted: "#a59d92"
  muted2: "#9a9189"
  accent: "#ff3bff"
  on_accent: "#171310"
typography:
  eyebrow:    { size: 20, weight: 600, tracking: "0.02em" }
  brand_mark: { size: 23, weight: 800, tracking: "0.22em" }
  badge:      { size: 28, weight: 800 }
  headline:   { size: 104, weight: 800, line: 1.16, tracking: "-0.035em" }
  cta_pre:    { size: 30, weight: 600 }
  cta_big:    { size: 64, weight: 800, tracking: "-0.03em" }
  watermark:  { size: 19, weight: 600, tracking: "0.28em" }
spacing:
  gutter: 60
  block: 40
  safe_top: 330
  safe_bottom: 340
radius: { pill: 999, card: 20 }
components:
  badge: "아이보리 pill (#f5f1ea bg / #171310 텍스트)"
  cta_bar: "하단 풀블리드 아이보리 면 — 좌: pre+big, 우: 다크 pill 버튼"
  grain: "SVG fractalNoise 오버레이, opacity .05, mix-blend overlay"
---

# 소옴크리에이티브 — 브랜드 정본 (frame.md)

소옴크리에이티브 클래식과정은 **원리와 구조**를 가르친다. 화려한 결과물이 아니라 보이지 않는
체계를 다룬다. 그래서 광고 소재도 장식이 아니라 **구조**로 말한다.

> **이 파일의 위치** — 새 영상 프로젝트를 만들 때 이 파일을 프로젝트 루트에 `frame.md`(소문자)로
> 복사한다. HyperFrames가 Step 1에서 자동으로 읽는다
> (`hyperframes-creative/references/design-spec.md`의 해석 순서: `frame.md` → `design.md` → `DESIGN.md`).

## 이 스펙이 구속하는 것 / 구속하지 않는 것

HyperFrames의 소비 규칙(`hyperframes-creative/references/video-composition.md` — "The Design Spec Is
Brand, Not Layout")을 그대로 따른다.

- **엄격히 지킨다:** 위 프론트매터의 hex 값·폰트·굵기 관계, 그리고 아래 「색 = 신호」·「금지」 절.
  값을 반올림하거나 새로 만들지 않는다.
- **자유롭게 정한다:** 레이아웃·구도·씬 구조·**모션**·전환. 소재마다 달라지는 지점이며,
  달라지는 것이 정상이다.

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
