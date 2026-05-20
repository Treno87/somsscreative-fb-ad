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
const TRANSITION_FRAMES = 15; // 0.5초 크로스페이드

export type StoryScene = {
	id: string;
	kind: "hook" | "problem" | "turn" | "proof" | "cta";
	/** staticFile 경로 — 이미지(.png/.jpg) 또는 영상(.mp4 등). 비어 있으면 플레이스홀더가 렌더된다. */
	media: string;
	/** 자산 설명 — 플레이스홀더에 표시되고 image-prompt-brand 입력으로 쓰인다. */
	brief: string;
	eyebrow: string;
	/** \n 으로 줄바꿈 */
	headline: string;
	body: string;
	/** kind가 cta일 때 캡슐 버튼 텍스트. 그 외엔 "" */
	cta: string;
	/** 텍스트 블록 세로 위치 */
	textPosition: "center" | "bottom";
	/** 헤드라인 진입 애니메이션 */
	headlineAnim: { preset: AnimPreset; unit: AnimUnit };
	durationInSeconds: number;
};

export type StorytellingAdProps = {
	accent: string;
	/** 배경음악 staticFile 경로. "" 이면 무음 */
	music: string;
	scenes: StoryScene[];
};

const isVideo = (path: string): boolean => /\.(mp4|mov|webm|m4v)$/i.test(path);

// TransitionSeries 총 길이 = Σ씬 − Σ전환(인접 씬끼리 겹침)
export const storyDurationInFrames = (scenes: StoryScene[]): number => {
	const total =
		scenes.reduce((s, sc) => s + sc.durationInSeconds, 0) * STORY_FPS;
	const transitions = Math.max(0, scenes.length - 1) * TRANSITION_FRAMES;
	return Math.round(total - transitions);
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
					fontSize: width * 0.028,
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
					fontSize: width * 0.034,
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

// 배경 자산 — 영상이면 OffthreadVideo, 이미지면 켄 번스 적용한 Img, 없으면 플레이스홀더
const SceneBackground: React.FC<{
	scene: StoryScene;
	accent: string;
	index: number;
	durationInFrames: number;
}> = ({ scene, accent, index, durationInFrames }) => {
	const frame = useCurrentFrame();

	if (!scene.media) {
		const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
		return (
			<Placeholder
				scene={scene}
				accent={accent}
				zoom={interpolate(progress, [0, 1], [1.06, 1.2])}
			/>
		);
	}

	if (isVideo(scene.media)) {
		// 영상은 자체 움직임이 있으므로 켄 번스를 적용하지 않는다.
		return (
			<AbsoluteFill>
				<OffthreadVideo
					src={staticFile(scene.media)}
					muted
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</AbsoluteFill>
		);
	}

	// 정지 이미지 — 켄 번스(줌 + 드리프트)로 가짜 움직임
	const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
	const zoom = interpolate(progress, [0, 1], [1.06, 1.2]);
	const driftX =
		(index % 2 === 0 ? 1 : -1) * interpolate(progress, [0, 1], [-2, 2]);
	return (
		<AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${driftX}%)` }}>
			<Img
				src={staticFile(scene.media)}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
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

	const isCta = scene.kind === "cta";
	const isCenter = scene.textPosition === "center";

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

			{/* 가독성용 스크림 — 중앙 텍스트는 전면을 고르게, 하단 텍스트는 아래를 진하게 */}
			<AbsoluteFill
				style={{
					background: isCenter
						? "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)"
						: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 38%, rgba(0,0,0,0.93) 100%)",
				}}
			/>

			{/* 텍스트 블록 */}
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
					style={{
						fontFamily: BRAND_FONTS.mono,
						fontSize: width * 0.026,
						letterSpacing: "0.16em",
						textTransform: "uppercase",
						color: accent,
						marginBottom: height * 0.022,
					}}
				/>
				<AnimatedText
					text={scene.headline}
					preset={scene.headlineAnim.preset}
					unit={scene.headlineAnim.unit}
					delayInFrames={9}
					staggerInFrames={4}
					style={{
						fontFamily: BRAND_FONTS.display,
						fontSize: width * (isCta ? 0.072 : 0.078),
						fontWeight: 700,
						lineHeight: 1.12,
						letterSpacing: "-0.01em",
						color: "#ffffff",
						textShadow: "0 4px 28px rgba(0,0,0,0.55)",
					}}
				/>
				{scene.body ? (
					<AnimatedText
						text={scene.body}
						preset="fade-up"
						unit="block"
						delayInFrames={28}
						style={{
							fontFamily: BRAND_FONTS.body,
							fontSize: width * 0.034,
							fontWeight: 500,
							lineHeight: 1.45,
							color: "rgba(255,255,255,0.78)",
							marginTop: height * 0.022,
							maxWidth: "92%",
							textShadow: "0 2px 18px rgba(0,0,0,0.5)",
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
							height: width * 0.115,
							padding: `0 ${width * 0.06}px`,
							borderRadius: 999,
							backgroundColor: accent,
							fontFamily: BRAND_FONTS.mono,
							fontSize: width * 0.032,
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

// 이미지 구동 스토리텔링 광고 — 씬 배열을 크로스페이드로 연결한다.
export const StorytellingAd: React.FC<StorytellingAdProps> = ({
	accent,
	music,
	scenes,
}) => {
	const { fps } = useVideoConfig();
	const total = storyDurationInFrames(scenes);

	return (
		<AbsoluteFill style={{ backgroundColor: "#000000" }}>
			<TransitionSeries>
				{scenes.flatMap((scene, i) => {
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
					if (i === scenes.length - 1) return [seq];
					return [
						seq,
						<TransitionSeries.Transition
							key={`tr-${scene.id}`}
							timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
							presentation={fade()}
						/>,
					];
				})}
			</TransitionSeries>

			{/* 배경음악 — 앞 0.6초 페이드 인, 끝 1.2초 페이드 아웃 */}
			{music ? (
				<Audio
					src={staticFile(music)}
					volume={(f) =>
						interpolate(
							f,
							[0, 18, total - 36, total],
							[0, 0.55, 0.55, 0],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
