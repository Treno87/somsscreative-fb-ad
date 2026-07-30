# Hyperframe 제작 세부 — 광고 동영상 (HTML + GSAP)

HTML+GSAP로 자유 연출하는 **Hyperframe 경로** 표준. 원형(참고 템플릿)은 `ad-projects/persona-design-1기-hf/`.

> **진입점** — 공통 관문 `docs/video-ad-process.md`에서 경로 선택 후 들어온다. 승인된
> 씬 기획 `courses/{course}/campaigns/{기수}-story-plan.md`를 전제로 한다.
>
> 기준일 2026-07-23 · 러닝 예시: persona-design 1기 · 대상 시스템: `ad-projects/{course}-{기수}-hf/` (hyperframes 0.6.76)

---

## 0. 개요

프로젝트 폴더 하나(`ad-projects/{course}-{기수}-hf/`)가 self-contained다 — 컴포지션(HTML)·자산·폰트·빌드 스크립트가 전부 그 안에 있고, `npx hyperframes` CLI가 그 안에서 동작한다.

```
index.html (HTML+GSAP 컴포지션, 9:16 1080×1920)
  → npm run render → renders/*.mp4 (본편, 무음, 스크래치)
  → build-final.sh (아웃트로+BGM 합성) → {course}-{기수}-reels.mp4
  → make-feed-sizes.sh (4:5 파생) / build-final-1x1.sh (1:1 전용)
```

**9:16 세로(1080×1920) 원본을 먼저 완성**하고, 다른 비율은 후처리로 파생한다.

---

## 1. 프로젝트 시작 — 스타터 복사 + 프리셋 선택

새 프로젝트는 **`ad-projects/_template-hf/` 스타터를 복사**한다 (프레임워크 설정·공용 컴포넌트·중앙 자산 배선·GSAP 골격이 이미 들어 있다).

```bash
cp -r ad-projects/_template-hf "ad-projects/{course}-{기수}-hf"
```

그다음 **디자인 프리셋을 고른다** (showcase-first):

1. `ad-projects/_presets/`의 `showcase.html`들을 브라우저로 열어 룩을 고른다 — editorial-dark · ivory-premium · magenta-block · split-bold (`_presets/README.md`).
2. 고른 프리셋 `FRAME.md`의 `colors`·`typography` 값을 새 프로젝트 `index.html`의 `:root` 슬롯에 붙여넣는다.
3. `meta.json`의 id/name 수정, story-plan 씬대로 씬 작성. 공용 컴포넌트(`.eyebrow`·`.badge`·`.headline`·`.card`·`.info-list`·`.cta`)는 스타터에 이미 있다.

> **왜 프리셋 먼저?** 정해진 템플릿으로만 만들면 매번 비슷해진다. 프리셋은 "디자인 룩을 재사용 단위로" 분리해, 소재마다 **새 룩을 고르거나 기존 걸 재사용**하게 한다. 새 룩이 필요하면 `_presets/README.md`의 "새 프리셋 추가(~10분)".

---

## 2. 프레임워크 핵심 규칙 (AGENTS.md 요약)

상세는 프로젝트 폴더의 `AGENTS.md`/`CLAUDE.md`가 정본이다. 핵심만:

- **타이밍 = GSAP 마스터 타임라인.** `gsap.timeline({paused:true})`에 **절대초**로 타이밍을 지정하고 `window.__timelines["main"]`에 등록한다 — 렌더러가 이 paused 타임라인을 seek한다. (HyperFrames는 요소별 `data-start/duration/track-index` 방식도 지원하지만, 이 레포는 GSAP 마스터 타임라인 방식으로 표준화한다 — 기존 두 프로젝트의 실제 방식.)
- `<video>`는 muted (오디오는 후처리에서 합성).
- **결정론적 로직만** — `Math.random()`·현재 시각 등 실행마다 달라지는 코드 금지 (렌더 재현성).

---

## 2-1. 디자인 도크트린 — Atoms sacred, composition free

레이아웃·연출을 **매번 바꾸되** 브랜드 일관성은 지키는 원칙. (`courses/classic/ads/0618/PHILOSOPHY.md` "Disciplined Edge"에서 승격.)

- **모션은 고정 재사용 세트** — 마스터 타임라인 구조, reveal 이디엄(fade-up·slide·stagger), ease 세트는 스타터에서 이어받아 그대로 쓴다. 매번 새로 짜지 않는다.
- **레이아웃·구도·팔레트는 매번 자유** — 씬 배치와 프리셋 선택이 소재마다 달라지는 지점이다. 여기서 "매번 다른 연출"이 나온다.
- **색 = 신호 (전 프리셋 공통)**: 강조색은 마젠타 `#ff3bff` **단색**. 한 씬에서 가장 중요한 단어 하나에만 찍는다. 전환·약속은 색이 아니라 카피·연출(취소선·밑줄·모션)이 진다. (2026-07-30 2색 체계 폐지 — `PHILOSOPHY.md` 참조.)
- **같은 골격, 다른 옷** — 상단(정체성·모집) → 중앙(질문) → 하단(약속) 골격은 유지하고, 프리셋으로 옷을 갈아입힌다.

---

## 3. 제작 루프

```bash
cd ad-projects/{course}-{기수}-hf
npm run dev       # 미리보기 서버 (백그라운드 장기 실행 — 포그라운드로 띄우면 타임아웃 주의)
# index.html 편집
npm run check     # lint + validate + inspect — 매 변경 후 필수
npm run render    # 본편 MP4 → renders/ (무음·스크래치)
```

- 자산(실사 클립·이미지)이 아직 없으면 플레이스홀더 패널로 두고 구조부터 렌더해 확인한다.
- `renders/`는 스크래치다 — gitignore 대상, 확정본만 배달한다 (관문 문서 참조).
- **디자인 QA**: 렌더/프레임을 `hallmark` 스킬로 안티-슬롭·대비 감사한다 (뻔한 그라디언트·중앙정렬 남용·저대비 텍스트 점검).

---

## 4. 후처리 — build-final.sh (아웃트로 + BGM)

Hyperframe render는 **본편(무음)만** 출력한다. 로고 아웃트로와 BGM은 ffmpeg로 합성한다:

```bash
./build-final.sh              # renders/ 최신 mp4를 본편으로 사용
./build-final.sh renders/특정본편.mp4
```

- **공용 자산은 중앙에서 참조** — 스타터의 `build-final.sh`는 아웃트로 `remotion/public/brand/somss-outro-1080.mp4`, BGM `remotion/public/audio/{트랙}.mp3`를 가리킨다(프로젝트마다 복제하지 않는다). 다른 BGM은 스크립트 상단 `BGM` 변수만 바꾼다.
- **전체 기능 ffmpeg 필요** — Remotion 번들 ffmpeg(`.localbin/ffmpeg`)는 pad·setpts 필터가 없는 최소 빌드라 사용 불가. 우선순위: `$FFMPEG` env > `ad-projects/.localbin/ffmpeg-full` > PATH.
- 스크립트 상단 파라미터: `DUR`(본편 컷 지점 — CTA 풀 노출 직후로), `BGM_VOL`(볼륨), `BGM`(음원 파일 — 로열티프리만).
- BGM은 자동 페이드(인 1.5s/아웃 2.5s), 아웃트로 스팅 오디오는 그대로 얹힌다.

---

## 5. 비율 파생

| 비율 | 방법 | 규칙 |
|---|---|---|
| 9:16 (릴스·스토리) | 원본 — index.html 그대로 | 기준 비율 |
| 4:5 (피드) | `./make-feed-sizes.sh` — 세로 중앙 크롭(y 285~1635) | **설계 규칙: 텍스트를 안전영역 y 285~1635 안에 배치**해야 무손실 크롭 가능 |
| 1:1 (피드) | `index-1x1.html` 전용 레이아웃 + `./build-final-1x1.sh` | **중앙 크롭 금지** — eyebrow·하단 텍스트가 잘린다. 반드시 전용 레이아웃으로 별도 제작 |

---

## 6. 검수·배달

- 검수: 최종본을 Windows 플레이어로 열어 오디오 포함 확인 (WSL은 `explorer.exe`로 폴더 열기). 렌더 exit 0은 "인코딩 완료"일 뿐 — 핵심 장면을 눈으로 확인한다.
- 배달(`public/ads/{course}/{기수}/v{NN}/video/`)·마감(`{기수}-assets.md` 갱신)은 **관문 문서 `docs/video-ad-process.md`의 공통 출력·마감 절차**를 따른다.
- 수정 사이클도 관문 문서의 공통 5원칙(확정 → 전 비율 → 자가검수 → 즉시처리 → 기획문서 동기화)을 따른다.

---

## 7. 부록 — 자주 막히는 곳

| 증상 | 원인 · 대응 |
|---|---|
| dev 서버가 멈춘 것처럼 보임 | 포그라운드 실행 타임아웃 — 백그라운드로 띄우고 브라우저로 확인 |
| build-final.sh가 "pad 필터 없음"으로 중단 | 최소 빌드 ffmpeg — `ad-projects/.localbin/ffmpeg-full` 준비(`npm i ffmpeg-static`로 받은 정적 바이너리) 또는 `FFMPEG=` env 지정 |
| 1:1에서 텍스트 잘림 | 중앙 크롭을 쓴 것 — `index-1x1.html` 전용 레이아웃으로 제작 |
| 클립 위 엉뚱한 글자 | 클립 자체 자막·로고 — 후처리로 못 지운다, 깨끗한 클립으로 교체 |
| 렌더마다 결과가 다름 | 비결정론적 코드(`Math.random()` 등) — 제거 |

---

*소옴크리에이티브 · Hyperframe 제작 세부 · 기준일 2026-07-23*
*공통 관문: `docs/video-ad-process.md` · 상위 워크플로우: `docs/PROCESS.md` · 원형: `ad-projects/persona-design-1기-hf/`*
