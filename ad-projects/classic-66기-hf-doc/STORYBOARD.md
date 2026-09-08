---
format: 1080x1920
duration: 32.5s
message: "8주에 무엇을 배우는지 커리큘럼에 다 적혀 있다"
arc: Hook → Evidence → Evidence → Turn → Authority → CTA
audience: 헤어커트 기초를 체계적으로 배우고 싶은 헤어디자이너
mode: collaborative
music: none
preset: cartesian
variant: doc
---

## Frame 1 — WEEK 01

- scene: WEEK 01이 화면을 가득 채운 채 시작해 아래로 흐르기 시작한다
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/01-week-01.html
- poster: 2s
- blueprint: titlecard-reveal
- asset_candidates: none

문서가 아니라 **선언**으로 읽혀야 한다. `WEEK 01`이 화면 폭을 넘칠 만큼 크게 정지해 있고,
그 아래 원문 한 줄이 작게 붙는다: `용어 및 커트 이론`. 3.2초에 화면 전체가 **위로 흐르기
시작**한다 — 이 순간부터 끝까지 글자는 가만히 있고 **카메라만 움직인다.**

**Why:** 이 편의 승부처는 첫 1초다. 문서처럼 열면 피드에서 지나간다 — 한 단어로 붙잡는다.

**Shot sequence** (0–4s) · blueprint `titlecard-reveal` + rules `center-outward-expansion`, `viewport-change`
- **0.0–0.5** 헤어라인 격자가 옅게 깔린다 (`css-marker-patterns`). 배경은 정지.
- **0.5–1.3** **`WEEK 01`이 화면 중앙에서 바깥으로 열린다** (`center-outward-expansion`, 자간 -0.12em → -0.05em). 문서가 아니라 선언으로 읽히는 지점.
- **1.3–2.1** 그 아래 원문 한 줄 `용어 및 커트 이론`이 붙는다. 다시 아래 작은 설명행.
- **2.1–3.2** 정지 — 읽을 시간.
- **3.2–4.0** **화면 전체가 위로 흐르기 시작한다** (`viewport-change`, 등속 진입). 이후 글자는 가만히 있고 카메라만 움직인다.

> **금지어 예외 (2026-09-05 광고주 승인):** `커트 이론`의 「이론」은 브랜드 금지어이나,
> 이 프레임은 커리큘럼 **원문을 인용**하는 것이지 우리가 쓴 카피가 아니다. 원문 표기를 유지한다.

## Frame 2 — 라인, 그리고 그래쥬에이션

- scene: 카메라가 WEEK 02~05 원문 위를 세로로 훑는다
- duration: 9s
- transition_in: cut
- status: animated
- src: compositions/frames/02-line-grad.html
- poster: 5s
- blueprint: transcript-scroll-artifact-reveal
- asset_candidates: assets/s3-instructor.mp4

1px 헤어라인 격자 위를 카메라가 일정한 속도로 내려간다. 지나가는 것은 전부 원문이다 —
`WEEK 02 라인 데모 & 실습` / `WEEK 03 라인 위드 그래쥬에이션 데모 & 실습` /
`WEEK 04 라인 위드 그래쥬에이션 워크샵` / `WEEK 05 그래쥬에이션 워크샵`.
왼쪽 여백에는 각 주차 번호가 모노 표기로 고정되어 진행 위치를 알려준다.

**Why:** 설득 문장을 하나도 쓰지 않고 「체계가 있다」를 증명한다. 원문이 곧 증거다.

**Shot sequence** (0–9s) · blueprint `transcript-scroll-artifact-reveal` + rules `viewport-change`, `svg-path-draw`
- **0.0–8.2** 카메라가 **등속으로** 문서를 내려간다 (`viewport-change`, y −1850px). 이전 프레임의 속도를 그대로 이어받는다 (handoff, 감속 없음).
- **주차 진입 시점마다** 왼쪽 인덱스 숫자(`02`·`03`·`04`·`05`)가 화면 중앙 높이에 닿는 순간 마젠타로 0.3s 점등했다 꺼진다 — 진행 위치 표시.
- **각 주차 사이 구분선**은 카메라가 닿기 직전 좌→우로 그어진다 (`svg-path-draw`, 0.35s).
- **2.4–4.0** s3-instructor 클립이 오른쪽 여백에 작은 판형으로 들어왔다 나간다 (스크롤과 같은 속도로 함께 이동).
- **8.2–9.0** 속도 유지. 다음 프레임으로 끊김 없이 넘긴다.

## Frame 3 — 레이어 세 형태

- scene: 카메라가 WEEK 06~08을 지나 디플로마 줄에서 멈춘다
- duration: 7s
- transition_in: cut
- status: animated
- src: compositions/frames/03-layer-three.html
- poster: 4s
- blueprint: transcript-scroll-artifact-reveal
- asset_candidates: assets/clip3.mp4

`WEEK 06 레이어, 라인 위드 레이어 (FLAT)` / `WEEK 07 레이어 워크샵 & 실습 (CONVEX)` /
`WEEK 08 레이어 워크샵 & 실습 (CONCAVE)`. FLAT·CONVEX·CONCAVE 세 단어가 지나갈 때
속도가 미세하게 느려진다. 마지막 줄 `디플로마 수여, 졸업식`에서 **카메라가 멈춘다.**

**Why:** 8주의 끝이 눈에 보인다. 완주가 상상 가능해지는 지점이다.

**Shot sequence** (0–7s) · blueprint `transcript-scroll-artifact-reveal` + rules `viewport-change`, `depth-of-field-blur`
- **0.0–4.6** 카메라가 계속 내려간다 (`viewport-change`, 이전 속도 승계). `06`·`07`·`08` 인덱스가 차례로 점등.
- **3.0–4.6** `FLAT` · `CONVEX` · `CONCAVE` 세 단어를 지날 때 **속도가 미세하게 느려진다** (등속 → 0.82배). 세 형태가 이 과정의 정점이라는 신호.
- **4.6–5.4** 마지막 줄 `디플로마 수여, 졸업식`에서 **카메라 완전 정지**. 이 정지가 8주의 끝이다.
- **5.4–5.9** 그 줄만 마젠타로 켜진다.
- **5.9–7.0** 주변 원문이 옅게 흐려지고 (`depth-of-field-blur`) 그 줄만 선명하게 남는다.

## Frame 4 — 매주 반복되던 한 줄

- scene: 문서 여백에 계속 있던 한 줄이 확대되어 화면을 먹는다
- duration: 5s
- transition_in: cut
- status: animated
- src: compositions/frames/04-every-week.html
- poster: 3.5s
- blueprint: transcript-scroll-artifact-reveal
- asset_candidates: none

멈춘 화면에서 초점이 바뀐다 — 스크롤 내내 각 주차 옆에 작게 붙어 있던 문장 하나가
확대되며 화면을 채운다: `매주 개별훈련 시간 부과 및 리포트 제출`. 신호색은 **`리포트`**.

**Why:** 훑고 지나간 증거 중 하나를 골라 못 박는다. 원데이·영상 강의와 갈리는 지점이고,

**Shot sequence** (0–5s) · blueprint `transcript-scroll-artifact-reveal` (artifact 단계) + rules `coordinate-target-zoom`, `spring-pop-entrance`
- **0.0–1.6** 스크롤 내내 각 주차 옆에 작게 붙어 있던 한 줄이 **제자리에서 확대되며 화면을 채운다** (`coordinate-target-zoom`, 24px → 88px). 새로 등장하는 게 아니라 **줄곧 거기 있었던 것**이다 — 그게 이 프레임의 논지다.
- **1.6–2.6** 두 행으로 자리 잡는다: 「매주 개별훈련 시간 부과 및」 / 「리포트 제출」.
- **2.6–3.0** **`리포트`** 펄스 (`spring-pop-entrance`) + 마젠타 점등.
- **3.0–3.6** 상하 헤어라인이 좌우로 그어져 문장을 가둔다.
- **3.6–5.0** 정지.
65기 소재가 한 번도 쓰지 않은 차별점이다.

## Frame 5 — 가르치는 사람

- scene: 강사 사진과 검증된 이력이 한 판으로 정지한다
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-who-teaches.html
- poster: 3s
- blueprint: titlecard-reveal
- asset_candidates: assets/instructor.png

문서가 물러나고 처음으로 사람이 나온다. `심일보 수석강사` / `런던 비달사순 TTC 수료` /
`비달사순 커트콘테스트 2위` / `교육경력 16년 · 클래식 64기 배출`.
**이 컨셉에서 사람은 여기 한 번만 나온다** — 중간에 넣으면 「문서 하나만 훑는다」가 깨진다.

**Why:** 원문 → 확신 → 누가 가르치는가. 권위는 증거 다음에 와야 증거를 덮지 않는다.

**Shot sequence** (0–4s) · blueprint `titlecard-reveal` + rules `spring-pop-entrance`, `discrete-text-sequence`
- **0.0–0.8** 문서면이 위로 물러나며 빈 면이 된다 (`viewport-change`, 짧은 마무리 이동).
- **0.8–1.6** 강사 사진이 원형 마스크 안에서 스케일 0.86 → 1.0 (`spring-pop-entrance`). **이 컨셉에서 사람이 나오는 유일한 지점.**
- **1.6–2.1** 이름 `심일보 수석강사`.
- **2.1–2.5** 짧은 헤어라인이 이름 아래 그어진다.
- **2.5–3.4** 이력 3행이 행 단위로 (`discrete-text-sequence`, stagger 0.28).
- **3.4–4.0** 정지.

## Frame 6 — CTA

- scene: 오퍼 사실과 CTA 바가 한 화면에 놓인다
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/06-cta.html
- poster: 2.5s
- blueprint: cta-morph-press
- asset_candidates: none

`10월 5일(월) 개강` / `매주 월요일 10–13시` / `소수정예 7명` / `수강료 160만원`이 한 줄로
압축되고, CTA 바(아이보리 면)로 모인다: `커리큘럼 보기` / `지금 →`. 신호색은 **`7명`**.
잔여석 숫자는 쓰지 않는다.

**Why:** 방금 커리큘럼 전체를 본 사람에게 남은 행동은 하나뿐이다.

**Shot sequence** (0–3.5s) · blueprint `cta-morph-press` + rules `card-morph-anchor`, `press-release-spring`
- **0.0–0.9** 오퍼 사실 2행이 상단에 작게 (`discrete-text-sequence`). `7명`에만 마젠타.
- **0.9–1.8** 헤드 2행 「무엇을 배우는지 / 커리큘럼에 다 있습니다」.
- **1.8–2.5** 아이보리 CTA 바가 하단에서 올라와 자리를 잡는다 (`card-morph-anchor`).
- **2.5–2.9** `지금 →`이 한 번 눌렸다 튀어오른다 (`press-release-spring`).
- **2.9–3.5** 정지.

---

## Video direction

- **카메라가 유일한 배우:** F1 후반부터 F5 초반까지 **글자는 한 번도 움직이지 않는다.** 움직이는 것은 뷰포트뿐이다. 이 규율이 「원문을 보고 있다」는 감각을 만든다.
- **속도 곡선:** 등속 진입(F1 3.2s) → 등속 유지(F2 전체) → 0.82배 감속(F3 FLAT/CONVEX/CONCAVE) → 완전 정지(F3 4.6s). 감속은 **한 번만** 쓴다.
- **신호색 예산:** 프레임당 한 곳. F1 없음 · F2 인덱스 점등(순간) · F3 `디플로마 수여, 졸업식` · F4 `리포트` · F5 없음 · F6 `7명`.
- **원문 불가침:** 화면의 커리큘럼 문구는 `courses/classic/imweb.html` 520~600행과 **글자 단위로 일치**해야 한다. 다듬거나 줄이지 않는다 — 원문이라는 사실이 이 영상의 전부다.
- **금지:** 텍스트 자체에 등장 애니메이션을 붙이지 않는다(카메라가 드러낸다). 스크롤 중 감속·가속을 임의로 넣지 않는다.
- **handoff:** F2→F3는 스크롤 속도가 **끊기지 않는다.** 두 프레임은 하나의 연속 이동이다.
