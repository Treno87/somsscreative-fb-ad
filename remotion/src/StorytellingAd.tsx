import React from "react";
import {
	AbsoluteFill,
	Audio,
	Img,
	OffthreadVideo,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { BRAND_FONTS } from "./fonts";
import { AnimatedText, type AnimPreset, type AnimUnit } from "./AnimatedText";

export const STORY_FPS = 30;
const TRANSITION_FRAMES = 15; // 0.5초 — 씬 간 크로스페이드
const MONTAGE_TRANSITION_FRAMES = 12; // 0.4초 — 한 씬 안 클립끼리의 크로스페이드
// 16:9 가로 아웃트로를 세로 프레임에서 키워 로고 가시성을 확보한다.
// 2배면 가장 넓은 흰 요소가 화면 폭의 약 65%라 양끝이 잘리지 않는다.
const OUTRO_SCALE = 2;

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

export type StoryScene = {
	id: string;
	kind: "hook" | "problem" | "turn" | "proof" | "cta";
	/**
	 * 배경 자산. 네 가지 형태를 받는다:
	 * - 파일 경로 1개 — 이미지(.png/.jpg) 또는 영상(.mp4 등)
	 * - 파일 경로 배열 — 여러 영상 클립을 크로스페이드로 이어 한 씬에 합성
	 * - HEX 색상("#faf8f6" 등) — 자산 없는 단색 솔리드 카드
	 * - "" — 자산 미지정, 자산 설명 플레이스홀더로 렌더
	 */
	media: string | string[];
	/** 자산 설명 — 플레이스홀더에 표시되고 image-prompt-brand 입력으로 쓰인다. */
	brief: string;
	eyebrow: string;
	/** \n 으로 줄바꿈 */
	headline: string;
	/** **...** 로 감싼 어구는 accent 색으로 강조된다 */
	body: string;
	/** kind가 cta일 때 캡슐 버튼 텍스트. 그 외엔 "" */
	cta: string;
	/** 텍스트 블록 세로 위치 */
	textPosition: "center" | "bottom";
	/** 헤드라인 진입 애니메이션 */
	headlineAnim: { preset: AnimPreset; unit: AnimUnit };
	durationInSeconds: number;
	/**
	 * 씬 레이아웃. 미지정 시 "overlay" — 배경 자산 위에 텍스트를 겹친다.
	 * "stack" — 솔리드 배경 위에 [인트로 텍스트 → 일러스트 → 헤드라인]을
	 * 세로로 쌓아 순차 연출한다(hook 전용). 이때 media는 가운데 일러스트로 쓰인다.
	 */
	layout?: "overlay" | "stack";
	/** 헤드라인 위에 오는 중간 크기 리드인 줄. 헤드라인보다 먼저 등장한다. */
	lead?: string;
	/** 설정 시 body 대신 accent 마커 불릿 리스트로 렌더된다. */
	bullets?: string[];
};

export type StorytellingAdProps = {
	accent: string;
	/** 배경음악 staticFile 경로. "" 이면 무음 */
	music: string;
	scenes: StoryScene[];
	/** 영상 끝에 크로스페이드로 붙는 로고 아웃트로 클립 경로. 없으면 아웃트로 없음. */
	outro?: string;
	/** 아웃트로 클립 길이(초). outro 지정 시 필수. */
	outroSeconds?: number;
};

const isVideo = (path: string): boolean => /\.(mp4|mov|webm|m4v)$/i.test(path);
const isHexColor = (s: string): boolean => /^#[0-9a-fA-F]{3,8}$/.test(s.trim());

// HEX 색상의 상대 휘도(0~1). 0.6 이상이면 밝은 배경 → 다크 텍스트를 쓴다.
const luminance = (hex: string): number => {
	let h = hex.trim().replace("#", "");
	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const r = parseInt(h.slice(0, 2), 16) / 255;
	const g = parseInt(h.slice(2, 4), 16) / 255;
	const b = parseInt(h.slice(4, 6), 16) / 255;
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// 씬 구간 길이 = Σ씬 − Σ전환(인접 씬끼리 겹침). 아웃트로는 포함하지 않는다.
export const storyDurationInFrames = (scenes: StoryScene[]): number => {
	const total =
		scenes.reduce((s, sc) => s + sc.durationInSeconds, 0) * STORY_FPS;
	const transitions = Math.max(0, scenes.length - 1) * TRANSITION_FRAMES;
	return Math.round(total - transitions);
};

// 씬 + 아웃트로 총 길이 — 아웃트로는 마지막 씬과 한 번 더 크로스페이드로 겹친다.
export const totalDurationInFrames = (props: StorytellingAdProps): number => {
	const scenes = storyDurationInFrames(props.scenes);
	if (!props.outro || !props.outroSeconds) return scenes;
	const outro = Math.round(props.outroSeconds * STORY_FPS);
	return scenes + outro - TRANSITION_FRAMES;
};

// 자산 미지정 시 — 자산 설명을 보여주는 플레이스홀더 패널
const Placeholder: React.FC<{
	scene: StoryScene;
	accent: string;
	zoom: number;
}> = ({ scene, accent, zoom }) => {
	const { width } = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				transform: `scale(${zoom})`,
				background: `radial-gradient(circle at 50% 38%, ${accent}26, #050505 70%)`,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					fontFamily: BRAND_FONTS.mono,
					fontSize: width * 0.035,
					letterSpacing: "0.2em",
					textTransform: "uppercase",
					color: accent,
					marginBottom: width * 0.035,
				}}
			>
				{scene.kind} · 자산 자리
			</div>
			<div
				style={{
					fontFamily: BRAND_FONTS.body,
					fontSize: width * 0.0425,
					color: "rgba(255,255,255,0.5)",
					maxWidth: "74%",
					textAlign: "center",
					lineHeight: 1.5,
				}}
			>
				{scene.brief}
			</div>
		</AbsoluteFill>
	);
};

// 여러 영상 클립을 한 씬 길이 안에서 크로스페이드로 이어 붙인다.
// 각 클립은 처음부터 동일 길이만큼 재생되고, 인접 클립끼리는 페이드로 겹친다.
const Montage: React.FC<{ clips: string[]; durationInFrames: number }> = ({
	clips,
	durationInFrames,
}) => {
	const n = clips.length;
	const t = MONTAGE_TRANSITION_FRAMES;
	// Σ시퀀스 − (n−1)·t = durationInFrames  →  Σ시퀀스 = durationInFrames + (n−1)·t
	const totalSeq = durationInFrames + Math.max(0, n - 1) * t;
	const base = Math.floor(totalSeq / n);
	// 마지막 클립이 나머지 프레임을 흡수해 합이 씬 길이와 정확히 맞도록 한다.
	const clipFrames = (i: number): number =>
		i === n - 1 ? totalSeq - base * (n - 1) : base;

	return (
		<TransitionSeries>
			{clips.flatMap((clip, i) => {
				const seq = (
					<TransitionSeries.Sequence
						key={`clip-${i}`}
						durationInFrames={clipFrames(i)}
					>
						<OffthreadVideo
							src={staticFile(clip)}
							muted
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					</TransitionSeries.Sequence>
				);
				if (i === n - 1) return [seq];
				return [
					seq,
					<TransitionSeries.Transition
						key={`m-tr-${i}`}
						timing={linearTiming({ durationInFrames: t })}
						presentation={fade()}
					/>,
				];
			})}
		</TransitionSeries>
	);
};

// 배경 자산 — 솔리드 색 / 영상 몽타주 / 단일 영상 / 켄 번스 이미지 / 플레이스홀더
const SceneBackground: React.FC<{
	scene: StoryScene;
	accent: string;
	index: number;
	durationInFrames: number;
}> = ({ scene, accent, index, durationInFrames }) => {
	const frame = useCurrentFrame();
	const { media } = scene;

	// 1) 솔리드 카드 — 단색 HEX 배경
	if (typeof media === "string" && isHexColor(media)) {
		return <AbsoluteFill style={{ backgroundColor: media }} />;
	}

	// 2) 영상 몽타주 — 클립 배열을 크로스페이드로 합성
	if (Array.isArray(media)) {
		return (
			<AbsoluteFill>
				<Montage clips={media} durationInFrames={durationInFrames} />
			</AbsoluteFill>
		);
	}

	// 3) 자산 미지정 — 플레이스홀더
	if (!media) {
		const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
		return (
			<Placeholder
				scene={scene}
				accent={accent}
				zoom={interpolate(progress, [0, 1], [1.06, 1.2])}
			/>
		);
	}

	// 4) 단일 영상 — 자체 움직임이 있으므로 켄 번스를 적용하지 않는다.
	if (isVideo(media)) {
		return (
			<AbsoluteFill>
				<OffthreadVideo
					src={staticFile(media)}
					muted
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</AbsoluteFill>
		);
	}

	// 5) 정지 이미지 — 켄 번스(줌 + 드리프트)로 가짜 움직임
	const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
	const zoom = interpolate(progress, [0, 1], [1.06, 1.2]);
	const driftX =
		(index % 2 === 0 ? 1 : -1) * interpolate(progress, [0, 1], [-2, 2]);
	return (
		<AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${driftX}%)` }}>
			<Img
				src={staticFile(media)}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
		</AbsoluteFill>
	);
};

// 모집 개요 등 — accent 마커 불릿 리스트. 항목별로 순차 등장한다.
const BulletList: React.FC<{
	items: string[];
	accent: string;
	dark: boolean;
	startDelay: number;
}> = ({ items, accent, dark, startDelay }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();
	const textColor = dark ? "rgba(22,22,22,0.86)" : "rgba(255,255,255,0.9)";
	return (
		<div style={{ marginTop: height * 0.032 }}>
			{items.map((item, i) => {
				const p = spring({
					frame: frame - startDelay - i * 8,
					fps,
					config: { damping: 18, mass: 0.6 },
				});
				return (
					<div
						key={i}
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: height * 0.021,
							opacity: clamp01(p),
							transform: `translateY(${(1 - clamp01(p)) * 30}px)`,
						}}
					>
						<div
							style={{
								width: width * 0.025,
								height: width * 0.025,
								borderRadius: 5,
								backgroundColor: accent,
								marginRight: width * 0.0375,
								flexShrink: 0,
							}}
						/>
						<div
							style={{
								fontFamily: BRAND_FONTS.body,
								fontSize: width * 0.05,
								fontWeight: 500,
								lineHeight: 1.3,
								color: textColor,
							}}
						>
							{item}
						</div>
					</div>
				);
			})}
		</div>
	);
};

// 스택 레이아웃(hook) — 오프화이트 배경 위 [인트로 텍스트 → 일러스트 → 헤드라인].
// 인트로 텍스트가 화면 중앙에 크게 등장 → 위로 이동 → 그 아래로 일러스트가
// 고정 크기로 페이드인 → 일러스트 아래로 헤드라인이 등장한다.
const StackScene: React.FC<{ scene: StoryScene }> = ({ scene }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const introFont = width * 0.0725;
	const headlineFont = width * 0.0775;
	const illusSize = width * 0.46; // 고정 크기 — 켄 번스/줌 없음
	const gap = height * 0.032;
	// 헤드라인 2줄 가정 — 인트로 텍스트의 초기 중앙 정렬 오프셋 계산용
	const headlineH = headlineFont * 1.16 * 2;
	const moveUp = (gap * 2 + illusSize + headlineH) / 2;

	// 첫 프레임에 [인트로 텍스트 + 일러스트]가 정적으로 fully visible해야 한다 —
	// Meta는 영상 첫 프레임을 자동 썸네일로 쓰므로, 빈 오프화이트로 시작하면 광고가 식별되지 않는다.
	// 인트로 텍스트의 "중앙 등장 → 위로" 모션은 의도적으로 포기했다(첫 프레임 의미 전달 우선).
	const introAppear = spring({
		frame: frame + 20,
		fps,
		config: { damping: 18, mass: 0.6 },
	});
	const introMove = spring({
		frame: frame + 15,
		fps,
		config: { damping: 20, mass: 0.85 },
	});
	const introOffset = interpolate(introMove, [0, 1], [moveUp, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const illus = spring({
		frame: frame + 20,
		fps,
		config: { damping: 20, mass: 0.75 },
	});

	const mediaPath = typeof scene.media === "string" ? scene.media : "";

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#faf8f6",
				alignItems: "center",
				justifyContent: "center",
				padding: width * 0.08,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
				}}
			>
				{/* 인트로 — 크게 등장한 뒤 위로 이동 */}
				<div
					style={{
						fontFamily: BRAND_FONTS.display,
						fontSize: introFont,
						fontWeight: 700,
						lineHeight: 1.2,
						letterSpacing: "-0.01em",
						color: "#1a1a1a",
						textAlign: "center",
						opacity: clamp01(introAppear),
						transform: `translateY(${
							introOffset + (1 - clamp01(introAppear)) * 24
						}px)`,
					}}
				>
					{scene.eyebrow}
				</div>

				{/* 일러스트 — 고정 크기, 페이드인(크기 변화 없음) */}
				<div
					style={{
						marginTop: gap,
						width: illusSize,
						height: illusSize,
						opacity: clamp01(illus),
						transform: `translateY(${(1 - clamp01(illus)) * 38}px)`,
					}}
				>
					{mediaPath ? (
						<Img
							src={staticFile(mediaPath)}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain",
							}}
						/>
					) : null}
				</div>

				{/* 헤드라인 — 일러스트 아래 */}
				<div style={{ marginTop: gap, width: "100%" }}>
					<AnimatedText
						text={scene.headline}
						preset={scene.headlineAnim.preset}
						unit={scene.headlineAnim.unit}
						delayInFrames={56}
						staggerInFrames={4}
						style={{
							fontFamily: BRAND_FONTS.display,
							fontSize: headlineFont,
							fontWeight: 700,
							lineHeight: 1.16,
							letterSpacing: "-0.01em",
							color: "#161616",
							textAlign: "center",
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const SceneView: React.FC<{
	scene: StoryScene;
	accent: string;
	index: number;
	durationInFrames: number;
}> = ({ scene, accent, index, durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// 스택 레이아웃(hook) — 자체 배경·연출을 가지므로 별도 렌더한다.
	if (scene.layout === "stack") {
		return <StackScene scene={scene} />;
	}

	const isCta = scene.kind === "cta";
	const isCenter = scene.textPosition === "center";

	// 솔리드 카드 여부 — 밝은 카드면 다크 텍스트, 어두운 카드면 흰 텍스트.
	const solidColor =
		typeof scene.media === "string" && isHexColor(scene.media)
			? scene.media
			: null;
	const lightCard = solidColor !== null && luminance(solidColor) >= 0.6;
	// 사진·영상 배경 — eyebrow 칩·스크림을 적용해 가독성을 확보한다.
	const photoBg = solidColor === null;

	const headlineColor = lightCard ? "#161616" : "#ffffff";
	const bodyColor = lightCard
		? "rgba(20,20,20,0.74)"
		: "rgba(255,255,255,0.78)";
	const leadColor = lightCard ? "rgba(20,20,20,0.82)" : "#ffffff";
	const headlineShadow = lightCard ? "none" : "0 4px 28px rgba(0,0,0,0.55)";
	const bodyShadow = lightCard ? "none" : "0 2px 18px rgba(0,0,0,0.5)";

	// 헤드라인 진입 — 리드인이 있으면 리드인이 먼저 읽히도록 늦춘다.
	const headlineDelay = scene.lead ? 34 : 9;

	// eyebrow — 사진·영상 배경에선 다크 칩으로 감싸 배경과 분리한다.
	const eyebrowStyle: React.CSSProperties = {
		fontFamily: BRAND_FONTS.mono,
		fontSize: width * 0.04,
		letterSpacing: "0.14em",
		textTransform: "uppercase",
		color: accent,
		marginBottom: height * 0.022,
		...(photoBg
			? {
					alignSelf: "flex-start",
					backgroundColor: "rgba(10,10,12,0.62)",
					padding: `${height * 0.0095}px ${width * 0.0425}px`,
					borderRadius: 999,
				}
			: {}),
	};

	// CTA 캡슐 — 후반 팝인
	const ctaSpring = spring({
		frame: frame - 40,
		fps,
		config: { damping: 14, mass: 0.7 },
	});

	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			<SceneBackground
				scene={scene}
				accent={accent}
				index={index}
				durationInFrames={durationInFrames}
			/>

			{/* 가독성용 스크림 — 사진·영상 배경에서만. 솔리드 카드는 적용하지 않는다. */}
			{photoBg ? (
				<AbsoluteFill
					style={{
						background: isCenter
							? "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)"
							: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 38%, rgba(0,0,0,0.93) 100%)",
					}}
				/>
			) : null}

			{/* 텍스트 블록 — 잘림 방지를 위해 세로 중앙 정렬을 기본으로 한다. */}
			<AbsoluteFill
				style={{
					justifyContent: isCenter ? "center" : "flex-end",
					padding: width * 0.08,
					paddingBottom: isCenter ? width * 0.08 : height * 0.1,
				}}
			>
				<AnimatedText
					text={scene.eyebrow}
					preset="fade-up"
					unit="block"
					delayInFrames={2}
					style={eyebrowStyle}
				/>
				{scene.lead ? (
					<AnimatedText
						text={scene.lead}
						preset="fade-up"
						unit="block"
						delayInFrames={12}
						style={{
							fontFamily: BRAND_FONTS.display,
							fontSize: width * 0.065,
							fontWeight: 600,
							lineHeight: 1.3,
							letterSpacing: "-0.005em",
							color: leadColor,
							marginBottom: height * 0.014,
							textShadow: photoBg ? "0 2px 16px rgba(0,0,0,0.55)" : "none",
						}}
					/>
				) : null}
				<AnimatedText
					text={scene.headline}
					preset={scene.headlineAnim.preset}
					unit={scene.headlineAnim.unit}
					delayInFrames={headlineDelay}
					staggerInFrames={4}
					style={{
						fontFamily: BRAND_FONTS.display,
						fontSize: width * (isCta ? 0.09 : 0.0975),
						fontWeight: 700,
						lineHeight: 1.12,
						letterSpacing: "-0.01em",
						color: headlineColor,
						textShadow: headlineShadow,
					}}
				/>
				{scene.bullets && scene.bullets.length > 0 ? (
					<BulletList
						items={scene.bullets}
						accent={accent}
						dark={lightCard}
						startDelay={32}
					/>
				) : scene.body ? (
					<AnimatedText
						text={scene.body}
						preset="fade-up"
						unit="block"
						delayInFrames={28}
						emphasisColor={accent}
						style={{
							fontFamily: BRAND_FONTS.body,
							fontSize: width * 0.0525,
							fontWeight: 500,
							lineHeight: 1.4,
							color: bodyColor,
							marginTop: height * 0.022,
							maxWidth: "92%",
							textShadow: bodyShadow,
						}}
					/>
				) : null}
				{isCta && scene.cta ? (
					<div
						style={{
							opacity: ctaSpring,
							transform: `scale(${interpolate(ctaSpring, [0, 1], [0.7, 1])})`,
							transformOrigin: "left center",
							alignSelf: "flex-start",
							marginTop: height * 0.032,
							display: "flex",
							alignItems: "center",
							height: width * 0.144,
							padding: `0 ${width * 0.075}px`,
							borderRadius: 999,
							backgroundColor: accent,
							fontFamily: BRAND_FONTS.mono,
							fontSize: width * 0.04,
							fontWeight: 600,
							color: "#ffffff",
						}}
					>
						{scene.cta}
					</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// 이미지 구동 스토리텔링 광고 — 씬 배열을 크로스페이드로 연결하고, 끝에 로고 아웃트로를 붙인다.
export const StorytellingAd: React.FC<StorytellingAdProps> = ({
	accent,
	music,
	scenes,
	outro,
	outroSeconds,
}) => {
	const { fps } = useVideoConfig();
	// 씬 구간의 끝 프레임 — BGM은 아웃트로 전에 페이드 아웃한다.
	const scenesEnd = storyDurationInFrames(scenes);
	const hasOutro = Boolean(outro && outroSeconds);
	const outroFrames =
		outro && outroSeconds ? Math.round(outroSeconds * fps) : 0;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			<TransitionSeries>
				{[
					...scenes.flatMap((scene, i) => {
						const dur = Math.round(scene.durationInSeconds * fps);
						const seq = (
							<TransitionSeries.Sequence
								key={`seq-${scene.id}`}
								durationInFrames={dur}
							>
								<SceneView
									scene={scene}
									accent={accent}
									index={i}
									durationInFrames={dur}
								/>
							</TransitionSeries.Sequence>
						);
						// 마지막 씬도 아웃트로가 있으면 전환을 붙인다.
						if (i === scenes.length - 1 && !hasOutro) return [seq];
						return [
							seq,
							<TransitionSeries.Transition
								key={`tr-${scene.id}`}
								timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
								presentation={fade()}
							/>,
						];
					}),
					// 로고 아웃트로 — 검정 배경 위 contain(레터박스).
					// 자체 오디오는 OffthreadVideo가 아닌 별도 <Audio>로 합성한다.
					// (OffthreadVideo + TransitionSeries 조합에서 마지막 sequence audio가
					//  누락되는 케이스가 있어, video=muted + Audio 분리로 보강.)
					...(outro && outroSeconds
						? [
								<TransitionSeries.Sequence
									key="seq-outro"
									durationInFrames={outroFrames}
								>
									<AbsoluteFill style={{ backgroundColor: "#000000" }}>
										<OffthreadVideo
											src={staticFile(outro)}
											muted
											style={{
												width: "100%",
												height: "100%",
												objectFit: "contain",
												transform: `scale(${OUTRO_SCALE})`,
											}}
										/>
										<Audio src={staticFile(outro)} />
									</AbsoluteFill>
								</TransitionSeries.Sequence>,
							]
						: []),
				]}
			</TransitionSeries>

			{/* 배경음악 — 앞 0.6초 페이드 인, 씬 구간 끝에서 페이드 아웃(아웃트로엔 안 깔린다).
			    volume 0.75 — 1.0이면 BGM이 내레이션 위로 튀어 시끄럽고, 0.55면 거의 안 들린다. */}
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						interpolate(
							f,
							[0, 18, scenesEnd - 45, scenesEnd - 12],
							[0, 0.75, 0.75, 0],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
