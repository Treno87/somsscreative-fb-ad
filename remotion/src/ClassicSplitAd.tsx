import React from "react";
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { BRAND_FONTS } from "./fonts";

// ─────────────────────────────────────────────────────────────────────────────
// 클래식과정 — Before/After Split 애니메이션 광고 (영상)
//
// 소스 재료: classic0618-D-split01.png(톤앤매너 기준) + classic0618-D-split02.png.
// D-split.html의 디자인 토큰(마젠타 #ff3bff · 옐로 #ffd400 · 다크 라디얼 ·
// Pretendard)을 Remotion 네이티브 레이어로 재구성해 하나의 서사로 만든다.
//
//   SCENE 1  Before/After — 상단 BEFORE(브랜드·배지·헤드라인)는 0프레임부터 떠
//            있는 상태로 시작(타임라인 썸네일에서도 후킹이 보이게). 하단 AFTER
//            패널만 솟아오르며 "완전히 달라집니다"가 등장. CTA 없음.
//   SCENE 2  Endcard     — split02 기반. 글로우 오브 + "지금 확인해 보세요!" +
//            노란 모집 박스 + 큼직한 화이트 CTA 캡슐.
//
// 반응형: 세로/정사각(9:16·1:1)은 상하 분할, 가로(1.91:1)는 좌우 분할로 배치가
// 바뀌어 어느 비율에서도 잘리지 않는다. 타이포는 비율별 스케일(s)로 축소된다.
// ─────────────────────────────────────────────────────────────────────────────

export type ClassicSplitAdProps = {
	accent: string; // 마젠타 — 고통/강조
	highlight: string; // 옐로 — 약속/모집
	brandName: string;
	courseName: string;
	badge: string;
	beforeEyebrow: string;
	headlineL1: string; // "분명히 배웠는데"
	headlineL2: string; // "커트실력은 왜"
	headlineEmphasis: string; // "제자리" (마젠타)
	headlinePost: string; // "일까요?"
	afterEyebrow: string;
	afterPreMark: string; // "클래식과정" — 다른 색으로 강조 (big 사이즈)
	afterPreRest: string; // "을 마치면"
	afterBig: string; // "완전히 달라집니다"
	ctaText: string;
	endLead: string;
	endTitleMagenta: string;
	endTitlePre: string;
	endTitleHighlight: string;
	endTitlePost: string;
	cohort: string;
	cohortBadge: string;
	music: string; // staticFile 경로. "" 이면 무음
};

export const classicSplitDefaults: ClassicSplitAdProps = {
	accent: "#ff3bff",
	highlight: "#ffd400",
	brandName: "SOMSSCREATIVE",
	courseName: "클래식과정",
	badge: "7월 20일 개강반 모집중",
	beforeEyebrow: "BEFORE · 지금",
	headlineL1: "분명히 배웠는데",
	headlineL2: "커트실력은 왜",
	headlineEmphasis: "제자리",
	headlinePost: "일까요?",
	afterEyebrow: "AFTER · 8주 뒤",
	afterPreMark: "클래식과정",
	afterPreRest: "을 마치면",
	afterBig: "완전히 달라집니다",
	ctaText: "무료 상담 신청",
	endLead: "소움크리에이티브의",
	endTitleMagenta: "클래식과정",
	endTitlePre: "지금 ",
	endTitleHighlight: "확인해",
	endTitlePost: " 보세요!",
	cohort: "클래식과정 64기",
	cohortBadge: "7월 20일 개강반 모집중!",
	music: "audio/classic-bgm2.mp3",
};

// 9초 = 270프레임.
export const classicSplitDuration = 270;

const DARK = "#15120f";
const LIGHT = "#f5f1ea";
const INK = "#171310";

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

export const ClassicSplitAd: React.FC<ClassicSplitAdProps> = (props) => {
	const {
		accent,
		highlight,
		brandName,
		courseName,
		badge,
		beforeEyebrow,
		headlineL1,
		headlineL2,
		headlineEmphasis,
		headlinePost,
		afterEyebrow,
		afterPreMark,
		afterPreRest,
		afterBig,
		ctaText,
		endLead,
		endTitleMagenta,
		endTitlePre,
		endTitleHighlight,
		endTitlePost,
		cohort,
		cohortBadge,
		music,
	} = props;

	const frame = useCurrentFrame();
	const { fps, width, height, durationInFrames } = useVideoConfig();

	// ── 반응형 스케일 ──────────────────────────────────────────────────────────
	const isLandscape = width / height >= 1.3;
	const s = isLandscape
		? height / 820
		: Math.min(width / 1080, height / 1480);
	const px = (n: number) => n * s;

	// ── 공통 헬퍼 ──────────────────────────────────────────────────────────────
	const enter = (delay: number, damping = 18, mass = 0.6) =>
		spring({ frame: frame - delay, fps, config: { damping, mass } });
	const fade = (a: number, b: number) =>
		interpolate(frame, [a, b], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// ── 막 전환 ────────────────────────────────────────────────────────────────
	const stageGroupOpacity = interpolate(frame, [150, 170], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const stageGroupScale = interpolate(frame, [150, 170], [1, 0.94], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const endGroupOpacity = fade(166, 182);

	// ── SCENE1: AFTER 패널이 솟아오른다(세로) / 밀려온다(가로) ─────────────────
	const seamPos = isLandscape ? 0.53 : 0.6; // 분할 경계 위치
	const afterExtent = isLandscape ? 0.5 : 0.44; // AFTER 패널 비중
	const panelRise = spring({
		frame: frame - 6,
		fps,
		config: { damping: 22, mass: 0.9 },
	});
	const panelOffset = interpolate(
		panelRise,
		[0, 1],
		[isLandscape ? width * afterExtent : height * afterExtent, 0],
	);
	const notch = 70 * s;

	// 화살표 — 경계에서 팝/바운스 후 플로트
	const arrowPop = spring({
		frame: frame - 18,
		fps,
		config: { damping: 9, mass: 0.6 },
	});
	const arrowFloat =
		Math.sin((frame - 40) / 9) * 6 * s * clamp01(fade(40, 54));
	const arrowSize = px(92);

	// ── 헤드라인 (정적, 0프레임부터 노출) ──────────────────────────────────────
	const headline = (
		<h1
			style={{
				margin: 0,
				fontFamily: BRAND_FONTS.display,
				fontWeight: 800,
				fontSize: px(96),
				lineHeight: 1.17,
				letterSpacing: "-0.035em",
				color: LIGHT,
			}}
		>
			{headlineL1}
			<br />
			{headlineL2}
			<br />
			<span style={{ color: accent }}>{headlineEmphasis}</span>
			{headlinePost}
		</h1>
	);

	const beforeBlock = (
		<>
			<div
				style={{
					fontFamily: BRAND_FONTS.body,
					fontWeight: 700,
					fontSize: px(24),
					letterSpacing: "0.18em",
					color: accent,
					marginBottom: px(22),
				}}
			>
				{beforeEyebrow}
			</div>
			{headline}
		</>
	);

	// AFTER 카피 (CTA 없음). "클래식과정"은 흰색으로 차별화, big과 동일 사이즈.
	const afterBlock = (
		<>
			<div
				style={{
					fontFamily: BRAND_FONTS.body,
					fontWeight: 800,
					fontSize: px(24),
					letterSpacing: "0.18em",
					color: "#5a2a00",
					opacity: fade(28, 42),
					transform: `translateY(${(1 - enter(28)) * px(20)}px)`,
					marginBottom: px(16),
				}}
			>
				{afterEyebrow}
			</div>
			<div
				style={{
					fontFamily: BRAND_FONTS.display,
					fontWeight: 800,
					fontSize: px(80),
					letterSpacing: "-0.035em",
					lineHeight: 1.12,
					opacity: clamp01(enter(36)),
					transform: `translateY(${(1 - enter(36)) * px(36)}px)`,
				}}
			>
				{/* 한 줄에 붙여 써 JSX 공백 텍스트노드가 끼지 않게 한다 */}
				<span style={{ color: "#ffffff" }}>{afterPreMark}</span><span style={{ color: INK }}>{afterPreRest}</span>
			</div>
			<div
				style={{
					fontFamily: BRAND_FONTS.display,
					fontWeight: 800,
					fontSize: px(80),
					letterSpacing: "-0.035em",
					lineHeight: 1.12,
					color: INK,
					marginTop: px(8),
					opacity: clamp01(enter(46)),
					transform: `translateY(${(1 - enter(46)) * px(48)}px)`,
				}}
			>
				{afterBig}
			</div>
		</>
	);

	const pad = px(72);

	return (
		<AbsoluteFill style={{ backgroundColor: DARK }}>
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						interpolate(
							f,
							[0, 8, durationInFrames - 24, durationInFrames - 1],
							[0, 1, 1, 0],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)
					}
				/>
			) : null}

			{/* ══════════════ SCENE 1 : Before / After ══════════════ */}
			<AbsoluteFill
				style={{
					opacity: stageGroupOpacity,
					transform: `scale(${stageGroupScale})`,
				}}
			>
				{/* BEFORE 패널 (다크) */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						...(isLandscape
							? { bottom: 0, width: `${seamPos * 100}%` }
							: { right: 0, height: `${seamPos * 100}%` }),
						background: `radial-gradient(130% 90% at 30% 10%, #26221f, ${DARK} 70%)`,
						clipPath: isLandscape
							? `polygon(0 0, 100% 0, calc(100% - ${notch}px) 100%, 0 100%)`
							: `polygon(0 0, 100% 0, 100% calc(100% - ${notch}px), 0 100%)`,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						padding: isLandscape
							? `${pad}px ${px(80)}px ${pad}px ${pad}px`
							: `${px(150)}px ${pad}px ${pad}px ${pad}px`,
					}}
				>
					{beforeBlock}
				</div>

				{/* AFTER 패널 (그라디언트) — 솟아오른다 */}
				<div
					style={{
						position: "absolute",
						...(isLandscape
							? {
									top: 0,
									bottom: 0,
									right: 0,
									width: `${afterExtent * 100}%`,
									transform: `translateX(${panelOffset}px)`,
								}
							: {
									bottom: 0,
									left: 0,
									right: 0,
									height: `${afterExtent * 100}%`,
									transform: `translateY(${panelOffset}px)`,
								}),
						background: `linear-gradient(120deg, ${accent}, ${highlight})`,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						padding: isLandscape ? `${pad}px ${px(48)}px` : `${pad}px`,
						color: INK,
					}}
				>
					{afterBlock}
				</div>

				{/* 상단 바 — 브랜드 + 모집 배지 (0프레임부터 노출) */}
				<div
					style={{
						position: "absolute",
						top: px(56),
						left: pad,
						right: pad,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						zIndex: 5,
						gap: px(16),
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: px(13) }}>
						<span
							style={{
								fontFamily: BRAND_FONTS.body,
								fontWeight: 800,
								fontSize: px(24),
								letterSpacing: "0.14em",
								color: LIGHT,
							}}
						>
							{brandName}
						</span>
						<span
							style={{
								width: px(6),
								height: px(6),
								borderRadius: "50%",
								background: accent,
							}}
						/>
						<span
							style={{
								fontFamily: BRAND_FONTS.body,
								fontWeight: 800,
								fontSize: px(24),
								color: INK,
								background: accent,
								borderRadius: px(8),
								padding: `${px(5)}px ${px(13)}px`,
								whiteSpace: "nowrap",
							}}
						>
							{courseName}
						</span>
					</div>
					<div
						style={{
							fontFamily: BRAND_FONTS.body,
							fontWeight: 800,
							fontSize: px(26),
							color: INK,
							background: highlight,
							borderRadius: 999,
							padding: `${px(13)}px ${px(24)}px`,
							letterSpacing: "-0.01em",
							whiteSpace: "nowrap",
						}}
					>
						{badge}
					</div>
				</div>

				{/* ↓/→ 화살표 — 경계에서 팝 */}
				<div
					style={{
						position: "absolute",
						...(isLandscape
							? {
									left: `calc(${seamPos * 100}% - ${arrowSize / 2}px)`,
									top: `calc(50% - ${arrowSize / 2}px)`,
								}
							: {
									right: pad,
									top: `calc(${seamPos * 100}% - ${arrowSize / 2}px)`,
								}),
						width: arrowSize,
						height: arrowSize,
						borderRadius: "50%",
						background: highlight,
						color: INK,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: px(46),
						fontWeight: 800,
						boxShadow: "0 12px 40px rgba(0,0,0,.4)",
						zIndex: 6,
						opacity: clamp01(arrowPop),
						transform: `translate(${isLandscape ? (1 - arrowPop) * -px(40) + arrowFloat : 0}px, ${
							isLandscape ? 0 : (1 - arrowPop) * -px(40) + arrowFloat
						}px) scale(${interpolate(arrowPop, [0, 1], [0.4, 1])})`,
					}}
				>
					{isLandscape ? "→" : "↓"}
				</div>
			</AbsoluteFill>

			{/* ══════════════ SCENE 2 : 엔드카드 (split02) ══════════════ */}
			<AbsoluteFill
				style={{
					opacity: endGroupOpacity,
					pointerEvents: frame < 166 ? "none" : "auto",
				}}
			>
				<AbsoluteFill
					style={{
						background: `radial-gradient(120% 90% at 50% 0%, #221d19, ${DARK} 72%)`,
					}}
				/>

				{/* 글로우 오브 — 펄스 */}
				<div
					style={{
						position: "absolute",
						left: isLandscape ? "72%" : "50%",
						top: isLandscape ? "60%" : "74%",
						width: px(820),
						height: px(820),
						transform: `translate(-50%, -50%) scale(${
							interpolate(
								spring({ frame: frame - 170, fps, config: { damping: 20 } }),
								[0, 1],
								[0.6, 1],
							) *
							(1 + Math.sin((frame - 170) / 14) * 0.05)
						})`,
						borderRadius: "50%",
						background: `radial-gradient(circle, ${accent}88 0%, ${highlight}55 38%, transparent 68%)`,
						filter: `blur(${px(20)}px)`,
						opacity: fade(170, 192),
					}}
				/>

				{/* 콘텐츠 — 세로형: 세로 스택 / 가로형: 좌(제목) 우(박스+CTA) */}
				<AbsoluteFill
					style={{
						padding: `${px(80)}px ${pad}px`,
						display: "flex",
						flexDirection: isLandscape ? "row" : "column",
						alignItems: isLandscape ? "center" : "flex-start",
						justifyContent: "center",
						gap: isLandscape ? px(60) : px(48),
					}}
				>
					{/* 좌측 / 상단 — 제목 블록 */}
					<div style={{ flex: isLandscape ? 1 : undefined }}>
						{/* 브랜드 */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: px(13),
								marginBottom: px(28),
								opacity: fade(172, 186),
							}}
						>
							<span
								style={{
									fontFamily: BRAND_FONTS.body,
									fontWeight: 800,
									fontSize: px(24),
									letterSpacing: "0.14em",
									color: LIGHT,
								}}
							>
								{brandName}
							</span>
							<span
								style={{
									width: px(6),
									height: px(6),
									borderRadius: "50%",
									background: accent,
								}}
							/>
							<span
								style={{
									fontFamily: BRAND_FONTS.body,
									fontWeight: 800,
									fontSize: px(24),
									color: INK,
									background: accent,
									borderRadius: px(8),
									padding: `${px(5)}px ${px(13)}px`,
								}}
							>
								{courseName}
							</span>
						</div>

						<div
							style={{
								fontFamily: BRAND_FONTS.body,
								fontWeight: 600,
								fontSize: px(34),
								color: "rgba(245,241,234,.7)",
								marginBottom: px(18),
								opacity: fade(178, 192),
								transform: `translateY(${(1 - clamp01(fade(178, 194))) * px(18)}px)`,
							}}
						>
							{endLead}
						</div>
						<div
							style={{
								fontFamily: BRAND_FONTS.display,
								fontWeight: 800,
								fontSize: px(96),
								lineHeight: 1.14,
								letterSpacing: "-0.035em",
							}}
						>
							<div
								style={{
									color: accent,
									opacity: clamp01(enter(184)),
									transform: `translateY(${(1 - enter(184)) * px(40)}px)`,
								}}
							>
								{endTitleMagenta}
							</div>
							<div
								style={{
									color: LIGHT,
									opacity: clamp01(enter(192)),
									transform: `translateY(${(1 - enter(192)) * px(40)}px)`,
								}}
							>
								{endTitlePre}
								<span style={{ color: highlight }}>{endTitleHighlight}</span>
								{endTitlePost}
							</div>
						</div>
					</div>

					{/* 우측 / 하단 — 모집 박스 + 큰 CTA */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							gap: px(40),
							marginTop: isLandscape ? 0 : px(20),
						}}
					>
						{/* 노란 모집 박스 */}
						<div
							style={{
								background: highlight,
								borderRadius: px(20),
								padding: `${px(28)}px ${px(40)}px`,
								boxShadow: `0 20px 60px ${highlight}33`,
								opacity: clamp01(enter(206)),
								transform: `scale(${interpolate(
									spring({ frame: frame - 206, fps, config: { damping: 12, mass: 0.7 } }),
									[0, 1],
									[0.8, 1],
								)})`,
								transformOrigin: "left center",
							}}
						>
							<div
								style={{
									fontFamily: BRAND_FONTS.body,
									fontWeight: 700,
									fontSize: px(28),
									color: "#5a4a00",
									marginBottom: px(6),
								}}
							>
								{cohort}
							</div>
							<div
								style={{
									fontFamily: BRAND_FONTS.display,
									fontWeight: 800,
									fontSize: px(46),
									color: INK,
									letterSpacing: "-0.02em",
									whiteSpace: "nowrap",
								}}
							>
								{cohortBadge}
							</div>
						</div>

						{/* 화이트 CTA 캡슐 — 크게 */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: px(26),
								background: LIGHT,
								borderRadius: 999,
								padding: `${px(26)}px ${px(28)}px ${px(26)}px ${px(52)}px`,
								boxShadow: "0 16px 50px rgba(0,0,0,.45)",
								opacity: clamp01(enter(222)),
								transform: `translateY(${(1 - enter(222)) * px(30)}px) scale(${interpolate(
									spring({ frame: frame - 222, fps, config: { damping: 12, mass: 0.7 } }),
									[0, 1],
									[0.85, 1],
								)})`,
								transformOrigin: "left center",
							}}
						>
							<span
								style={{
									fontFamily: BRAND_FONTS.body,
									fontWeight: 800,
									fontSize: px(52),
									color: INK,
									whiteSpace: "nowrap",
								}}
							>
								{ctaText}
							</span>
							<span
								style={{
									width: px(78),
									height: px(78),
									borderRadius: "50%",
									background: accent,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: px(42),
									fontWeight: 800,
								}}
							>
								→
							</span>
						</div>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
