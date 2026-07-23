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

## 1. 프로젝트 시작 — persona 원형에서 복사

새 프로젝트는 `ad-projects/persona-design-1기-hf/`를 원형으로 삼는다.

**복사할 파일** (프레임워크·빌드 인프라):

| 파일 | 역할 |
|---|---|
| `hyperframes.json` | 프로젝트 경로 스키마 |
| `package.json` | CLI 스크립트 (dev/check/render/publish · hyperframes@0.6.76 고정) |
| `AGENTS.md` · `CLAUDE.md` | **프레임워크 규칙 — 반드시 복제.** 빠뜨리면 규칙 없이 작업하게 된다 |
| `fonts/` | 임베드 폰트 (NotoKR woff2) |
| `build-final.sh` · `build-final-1x1.sh` · `make-feed-sizes.sh` | 후처리 스크립트 (파일명·파라미터를 새 캠페인에 맞게 수정) |

**새로 작성할 파일**: `meta.json`(id·name), `index.html`(컴포지션 — story-plan의 씬 구성대로), `images/`(자산), `README.md`(입력/출력/씬 요약).

---

## 2. 프레임워크 핵심 규칙 (AGENTS.md 요약)

상세는 프로젝트 폴더의 `AGENTS.md`/`CLAUDE.md`가 정본이다. 핵심만:

- 씬 요소는 `data-start`/`data-duration`/`data-track-index` 타이밍 속성 필수.
- 화면에 보이는 요소는 `class="clip"`.
- GSAP 타임라인은 **paused 상태로 만들고 `window.__timelines`에 등록** — 렌더러가 시간을 제어한다.
- `<video>`는 muted (오디오는 후처리에서 합성).
- **결정론적 로직만** — `Math.random()`·현재 시각 등 실행마다 달라지는 코드 금지 (렌더 재현성).

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

---

## 4. 후처리 — build-final.sh (아웃트로 + BGM)

Hyperframe render는 **본편(무음)만** 출력한다. 로고 아웃트로(`somss-outro.mp4`)와 BGM은 ffmpeg로 합성한다:

```bash
./build-final.sh              # renders/ 최신 mp4를 본편으로 사용
./build-final.sh renders/특정본편.mp4
```

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
