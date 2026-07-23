# HyperFrames 광고 영상 프로젝트 (소옴 스타터)

이 프로젝트는 `ad-projects/_template-hf/`에서 복사된 것이다. 디자인 룩은
`ad-projects/_presets/`의 프리셋을 채택한다. 상위 프로세스: `docs/video-ad-process.md`(관문) ·
`docs/video-hyperframe.md`(제작 세부).

## Skills — 먼저 사용

작곡(HTML) 작성·수정 전에 관련 skill 을 먼저 부른다. 없으면 설치:
```bash
npx skills add heygen-com/hyperframes
```
주요 skill: `/hyperframes`, `/hyperframes-cli`, `/gsap`. (framework 패턴은 일반 웹 문서에 없다.)

## Commands
```bash
npm run dev      # 프리뷰 서버 (long-running — 반드시 백그라운드로 실행)
npm run check    # lint + validate + inspect (변경 후 항상)
npm run render   # MP4 렌더 → renders/
./build-final.sh # 아웃트로 + BGM 합성 (공용 자산은 remotion/public/ 참조)
```
> `npm run dev`는 멈추지 않는 서버다. Claude Code에서는 `run_in_background: true`로 띄운다.
> 포그라운드로 실행하면 타임아웃으로 서버가 죽어 프리뷰가 깨진다.

## 이 레포의 규약 (일반 HyperFrames 규칙 위에 얹음)

1. **타이밍 = GSAP 마스터 타임라인.** 요소별 `data-start/duration/track-index`가 아니라,
   하단 `<script>`의 `gsap.timeline({paused:true})`에 **절대초**로 타이밍을 지정하고
   `window.__timelines["main"]`에 등록한다. (이게 이 레포 두 기존 프로젝트의 실제 방식.
   framework의 per-element data-* 방식은 대안이며 여기선 쓰지 않는다.)
2. **결정론만** — `Math.random()`·`Date.now()`·network fetch 금지 (렌더 재현성).
3. **비디오는 muted** + 오디오는 별도(`build-final.sh`가 BGM/아웃트로 합성).
4. **디자인 = 프리셋 토큰.** `:root` 색·타이포는 `_presets/{name}/FRAME.md`에서 가져온다.
   **색=신호**: 마젠타=고통, 옐로/골드=약속. 강조색을 남발하지 않는다.
5. **자립형 유지** — 폰트는 프로젝트 `fonts/`에, 공용 아웃트로/BGM만 `remotion/public/` 참조.

## Atoms sacred / composition free

- **모션 관용구**(마스터 타임라인 · fade-up/slide/stagger reveal · ease 세트)는 **재사용 고정 세트** — 스타터에서 이어받아 쓴다.
- **레이아웃·구도·팔레트**는 **매번 자유** — story-plan 씬대로 새로 짠다. 여기가 소재마다 달라지는 곳이다.

## 안전영역

9:16(1080×1920)에서 텍스트는 y **330~1580** 안에 둔다. 그래야 4:5 중앙크롭(`make-feed-sizes.sh`)에서
무손실. 1:1은 중앙크롭 금지 — 전용 레이아웃(`index-1x1.html`) 별도 제작.

Full docs: https://hyperframes.heygen.com/introduction
