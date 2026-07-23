# HyperFrames 광고 영상 프로젝트 (소옴 스타터)

규약·명령·규칙은 `AGENTS.md`에 정리돼 있다 — **작업 전 반드시 읽는다.**

핵심 요약:
- 디자인 룩 = `ad-projects/_presets/{name}/FRAME.md` 토큰을 `index.html` `:root`에 붙여넣기.
- 타이밍 = 하단 GSAP 마스터 타임라인(절대초) → `window.__timelines["main"]`.
- `npm run dev`는 백그라운드, `npm run check`는 변경 후 항상.
- 공용 아웃트로/BGM은 `remotion/public/`, 합성은 `./build-final.sh`.
- 색=신호(마젠타=고통, 옐로/골드=약속). 안전영역 y 330~1580.

상위 프로세스: `docs/video-ad-process.md` · `docs/video-hyperframe.md`.
Skills: `npx skills add heygen-com/hyperframes` → `/hyperframes`, `/gsap`.
