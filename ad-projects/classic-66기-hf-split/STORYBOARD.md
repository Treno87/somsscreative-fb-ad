---
format: 1080x1920
duration: 33s
message: "외워서 자르면 매주 처음부터, 이해하고 자르면 매주 쌓인다"
arc: Hook → Problem → Turn → Proof → Offer → CTA
audience: 헤어커트 기초를 체계적으로 배우고 싶은 헤어디자이너
mode: collaborative
music: none
preset: broadside
variant: split
---

## Frame 1 — 두 사람

- scene: 화면이 상하로 갈리고 위·아래 칸에 각각 WEEK 01이 찍힌다
- duration: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/01-two-people.html
- poster: 3s
- blueprint: kinetic-type-beats
- asset_candidates: none

두 칸은 같은 크기, 같은 빈 상태로 시작한다 — 아직 아무 차이도 없다. 헤드라인이 두 줄로
얹힌다: `외워서 자르는 사람` / `이해하고 자르는 사람`. 신호색은 **`이해하고`** 한 단어에만.
경계선은 1px 헤어라인이고, 이 선은 영상이 끝날 때까지 **한 번도 움직이지 않는다.**

**Why:** 보는 사람이 스스로를 한쪽에 놓게 만든다. 두 칸이 지금은 똑같다는 사실이 다음 비트의 전제다.

**Shot sequence** (0–4.5s) · blueprint `comparison-split` + rules `split-tilt-cards`, `discrete-text-sequence`
- **0.0–0.6** 아이브로우가 상단에 얹힌다. 화면은 아직 하나의 면.
- **0.6–1.2** 가운데 헤어라인이 **좌에서 우로 그어지며** 화면을 상하로 가른다 (`svg-path-draw`). 이 선은 이후 절대 움직이지 않는다.
- **1.2–2.0** 두 칸이 각각 미세하게 기울었다 제자리로 눕는다 (`split-tilt-cards`, 3° → 0°). 두 칸에 `WEEK 01`이 동시에 찍힌다 — 지금은 똑같다는 선언.
- **2.0–3.4** 헤드라인 2행이 **행 단위로** 등장 (`discrete-text-sequence`, stagger 0.5). 「외워서 자르는 사람,」 → 「이해하고 자르는 사람」.
- **3.4–3.9** `이해하고`만 스케일 1→1.08→1 펄스 (`spring-pop-entrance`). 마젠타는 이때 처음 켜진다.
- **3.9–4.5** 정지. 여백이 신뢰다.

## Frame 2 — 8주가 흐른다

- scene: 경계선은 고정된 채 위·아래 칸이 WEEK 01→08을 순환하며 갈라진다
- duration: 10.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-eight-weeks.html
- poster: 7s
- blueprint: fixed-anchor-cycle
- asset_candidates: assets/s2-student-a.mp4

고정 앵커는 **가운데 경계선**이다. 그 위아래가 주차를 순환한다.
**위 칸(외워서):** 매주 형태가 하나 나타났다가 **다음 주에 사라진다.** 쌓이지 않는다. 매번 처음부터.
**아래 칸(이해하고):** `라인`(W02) → `라인 위드 그래쥬에이션`(W03·04) → `그래쥬에이션`(W05) →
`레이어 FLAT·CONVEX·CONCAVE`(W06·07·08)가 **아래에서 위로 층으로 얹힌다.** 지운 적이 없다.

주차 라벨은 커리큘럼 원문 표기를 그대로 쓴다(`courses/classic/imweb.html`).

**Why:** 「쌓인다」는 말을 하지 않고 화면이 8주 동안 실행한다. 이 프레임이 message 그 자체다.

**Shot sequence** (0–10.5s) · blueprint `fixed-anchor-cycle` + rules `vertical-spring-ticker`, `waterfall-entry`
- **0.0–0.4** 경계선은 이전 프레임에서 그대로 이어받는다 (handoff). 양쪽 칸 라벨이 켜진다.
- **0.4–5.2** **위 칸 — 리셋 루프.** WEEK 02→08, 한 주차당 0.68s. 매 주차마다 형태 블록이 위에서 떨어져 앉았다가 **다음 주차에 아래로 빠져 사라진다** (`vertical-spring-ticker`). 남는 것이 없다. 7회 반복.
- **0.4–5.2** **아래 칸 — 누적.** 같은 박자로 블록이 **아래에서 올라와 얹히고 지워지지 않는다** (`waterfall-entry`, stagger 0.68). W02 라인 → W03·04 라인 위드 그래쥬에이션 → W05 그래쥬에이션 → W06·07·08 레이어.
- **5.2–7.0** 주차 카운터 `WEEK 01 → 08`이 하단에서 숫자만 올라간다 (`counting-dynamic-scale`).
- **7.0–9.4** 아래 칸의 3층이 함께 미세하게 위로 밀린다 — 쌓인 무게를 보여주는 정착 동작.
- **9.4–10.5** 정지. 위 칸은 비어 있고 아래 칸은 차 있다.

## Frame 3 — 격차

- scene: 8주차에서 순환이 멈추고 두 칸의 결과가 확정된다
- duration: 5s
- transition_in: cut
- status: animated
- src: compositions/frames/03-gap.html
- poster: 3.5s
- blueprint: kinetic-type-beats
- asset_candidates: none

순환이 멈춘다. 위 칸에는 형태 하나만 남아 있고, 아래 칸에는 세 형태가 층으로 서 있다.
카피 한 줄이 경계선 위에 얹힌다: `커트에는 쌓이는 순서가 있습니다`. 신호색은 **`순서`**.

**Why:** 두 길의 결과를 나란히 확정한다. 판단은 보는 사람이 한다 — 우리는 비교만 놓는다.

**Shot sequence** (0–5s) · blueprint `kinetic-type-beats` + rules `kinetic-beat-slam`, `center-outward-expansion`
- **0.0–0.5** 순환이 멈춘 상태를 그대로 이어받는다 (handoff). 두 칸의 결과가 정지해 있다.
- **0.5–1.6** 카피 1행 「커트에는 쌓이는」이 경계선 위에 얹힌다.
- **1.6–2.1** **`순서`가 슬램** (`kinetic-beat-slam`) — 스케일 1.4에서 1.0으로 0.28s에 꽂히고 마젠타가 켜진다.
- **2.1–2.6** 슬램 충격으로 경계선이 좌우로 짧게 늘어났다 돌아온다 (`center-outward-expansion`).
- **2.6–3.4** 「가 있습니다」가 이어 붙는다.
- **3.4–5.0** 정지.

## Frame 4 — 매주 남는 것

- scene: 아래 칸이 화면 전체로 확장되고 개별훈련·리포트·디플로마가 카드로 얹힌다
- duration: 5.5s
- transition_in: wipe
- status: animated
- src: compositions/frames/04-what-remains.html
- poster: 4s
- blueprint: grid-card-assemble
- asset_candidates: assets/clip3.mp4, assets/instructor.png

경계선이 위로 밀려 사라지고 아래 칸이 화면을 다 먹는다 — **이해하고 자르는 쪽을 택한 화면.**
카드 3장이 아래에서 순차로 얹힌다: `매주 개별훈련 · 리포트 제출` / `WEEK 08 디플로마 수여` /
`심일보 수석강사 · 런던 비달사순 TTC · 교육경력 16년 · 클래식 64기 배출`.
첫 카드의 **`리포트`**에 신호색 — 원데이·영상 강의와 갈리는 지점이다.

**Why:** 「쌓인다」가 말뿐이 아님을 커리큘럼 원문의 사실로 받친다.

**Shot sequence** (0–5.5s) · blueprint `grid-card-assemble` + rules `waterfall-entry`, `spring-pop-entrance`, `scale-swap-transition`
- **0.0–0.7** **경계선이 위로 빠져나가고** 아래 칸이 화면 전체로 확장된다 (`anchored-layout-expand`) — 이해하고 자르는 쪽을 택한 화면.
- **0.7–1.4** clip3 클립이 상단에 들어온다 (②측면 섹션 격자 · ③뒷모습 격자 구간만).
- **1.4–1.9** 헤드 「8주, 이렇게 쌓습니다」.
- **1.9–3.3** 카드 3장이 아래에서 차례로 얹힌다 (`waterfall-entry`, stagger 0.42).
- **3.3–3.7** 첫 카드의 **`리포트`** 펄스 (`spring-pop-entrance`) — 원데이·영상 강의와 갈리는 지점.
- **3.7–4.6** 강사 크레딧 3행이 카드3 안에서 순차로.
- **4.6–5.5** 정지.

## Frame 5 — 오퍼

- scene: 개강일·정원·수강료가 한 판에 정지한다
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/05-offer.html
- poster: 3s
- blueprint: titlecard-reveal
- asset_candidates: none

한 번의 절제된 등장 후 정지. `10월 5일(월) 개강` / `매주 월요일 10–13시` / `소수정예 7명` /
`수강료 160만원`. 신호색은 **`7명`**. 시간대는 일정 정보로만 적는다 — 시간대 소구 금지.

**Why:** 결정에 필요한 사실만. 여백이 신뢰다.

**Shot sequence** (0–4s) · blueprint `titlecard-reveal` + rules `discrete-text-sequence`, `counting-dynamic-scale`
- **0.0–1.5** 헤드 3행이 행 단위로 (`discrete-text-sequence`, stagger 0.38). 단 하나의 절제된 등장.
- **1.5–1.9** **`7명`** 숫자가 스케일로 한 번 눌린다 (`counting-dynamic-scale`).
- **1.9–3.0** 정보 카드 4행이 마젠타 불릿과 함께 (stagger 0.18).
- **3.0–4.0** 완전 정지. 낮은 모션이 이 프레임의 페이로드다.

## Frame 6 — CTA

- scene: 브랜드 마크가 CTA 바로 압축된다
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/06-cta.html
- poster: 2.5s
- blueprint: cta-morph-press
- asset_candidates: none

`무엇을 배우는지 커리큘럼에 다 있습니다` → CTA 바(아이보리 면): `10월 5일 개강 · 정원 7명` /
`커리큘럼 보기` / `지금 →`. 잔여석 숫자는 쓰지 않는다.

**Why:** 목표 행동은 커리큘럼 확인 → 상담. 마지막 화면이 그 한 걸음만 요구한다.

**Shot sequence** (0–3.5s) · blueprint `cta-morph-press` + rules `card-morph-anchor`, `press-release-spring`
- **0.0–1.2** 헤드 2행 등장.
- **1.2–2.0** 하단에서 아이보리 면이 **위로 밀려 올라와** CTA 바가 된다 (`card-morph-anchor`).
- **2.0–2.4** `커리큘럼 보기`가 바 안에서 자리를 잡는다.
- **2.4–2.8** `지금 →` 버튼이 한 번 눌렸다 튀어오른다 (`press-release-spring`).
- **2.8–3.5** 정지. 마지막 프레임은 CTA 바가 화면의 3분의 1을 차지한 채 끝난다.

---

## Video direction

- **고정 앵커:** 가운데 헤어라인은 F1에서 그어진 뒤 F4에서 빠져나갈 때까지 **한 번도 움직이지 않는다.** 이 선의 부동성이 「비교」를 성립시킨다.
- **모션 대비:** 위 칸은 항상 **떨어졌다 사라지는** 수직 운동(리셋), 아래 칸은 항상 **올라와 남는** 수직 운동(누적). 두 방향이 영상 내내 반대다.
- **신호색 예산:** 마젠타는 프레임당 **한 곳**. F1 `이해하고` · F2 주차 카운터 · F3 `순서` · F4 `리포트` · F5 `7명` · F6 없음(아이보리 면이 대비를 진다).
- **이징:** 누적 계열은 `power3.out`, 리셋 계열은 `power2.in`(빠져나가는 느낌), 슬램만 `back.out(1.7)`.
- **금지:** 전 프레임 공통 페이드업 반복 금지. 같은 규칙을 연속 두 프레임에서 주모션으로 쓰지 않는다.
- **handoff:** F2→F3, F3→F4는 경계선 위치·양쪽 칸 내용이 그대로 이어진다. 컷이 아니라 상태 승계다.
