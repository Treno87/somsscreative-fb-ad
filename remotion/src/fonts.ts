import { staticFile } from "remotion";

// 등록할 폰트 — 라틴 브랜드 폰트 3종 + 한글 Pretendard.
// Clash·Cabinet·Space Grotesk는 라틴 전용이라 한글 글리프가 없어,
// 한글은 Pretendard로 폴백시킨다.
const FACES = [
	{ family: "Clash Grotesk", file: "fonts/ClashGrotesk-Variable.woff2" },
	{ family: "Cabinet Grotesk", file: "fonts/CabinetGrotesk-Variable.woff2" },
	{ family: "Space Grotesk", file: "fonts/SpaceGrotesk-Variable.woff2" },
	{ family: "Pretendard Variable", file: "fonts/PretendardVariable.woff2" },
];

// 폰트 패밀리 스택 — 라틴 글자는 브랜드 폰트, 한글은 Pretendard로 자동 폴백.
export const BRAND_FONTS = {
	display: "'Clash Grotesk', 'Pretendard Variable', sans-serif",
	body: "'Cabinet Grotesk', 'Pretendard Variable', sans-serif",
	mono: "'Space Grotesk', 'Pretendard Variable', sans-serif",
} as const;

// 폰트를 fire-and-forget으로 등록한다 — delayRender로 렌더를 막지 않는다.
// 이유: 긴 렌더 도중 Remotion이 페이지를 재로드하면 모듈이 다시 평가되며
// delayRender가 다시 호출되는데, 이때 FontFace.load()가 멈추면
// continueRender가 호출되지 않아 렌더 전체가 타임아웃으로 죽는다
// (StorytellingAd 660프레임 렌더가 이 이유로 프레임 597·635에서 실패).
// 폰트는 로컬 파일이라 보통 1초 안에 로드되며, 그 사이 극초반 일부
// 프레임만 폴백 폰트로 그려질 수 있다 — 영상 전체로는 보이지 않는 수준.
if (typeof document !== "undefined") {
	for (const f of FACES) {
		new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: "100 900" })
			.load()
			.then((loaded) => {
				document.fonts.add(loaded);
			})
			.catch(() => {
				// 폰트 로드 실패 시에도 렌더는 진행 — 폴백 폰트로 그려진다.
			});
	}
}
