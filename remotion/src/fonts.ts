import { continueRender, delayRender, staticFile } from "remotion";

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

// 모듈 로드 시점에 폰트를 등록하고, 로드 완료 전까지 렌더를 지연시킨다.
if (typeof document !== "undefined") {
	for (const f of FACES) {
		const handle = delayRender(`Loading font: ${f.family}`);
		const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {
			weight: "100 900",
		});
		face
			.load()
			.then((loaded) => {
				document.fonts.add(loaded);
				continueRender(handle);
			})
			.catch(() => continueRender(handle));
	}
}
