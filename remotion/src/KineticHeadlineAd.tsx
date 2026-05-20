import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { BRAND_FONTS } from "./fonts";

export type KineticHeadlineAdProps = {
	/** 앵글 라벨 — 상단 작은 텍스트 (ad-proposal 앵글 팔레트와 매핑) */
	angle: string;
	/** 메인 헤드라인 — \n 으로 줄바꿈 */
	headline: string;
	/** 서브헤드라인 — 한 문장 */
	subheadline: string;
	/** CTA 버튼 텍스트 */
	cta: string;
	/** 강조색 HEX — 브랜드 그라디언트 팔레트에서 선택 */
	accent: string;
};

export const kineticHeadlineDefaults: KineticHeadlineAdProps = {
	angle: "고통 포인트",
	headline: "3년을 배웠는데\n왜 안 될까요?",
	subheadline: "기술 암기로는 처음 보는 커트를 풀 수 없습니다.",
	cta: "무료 상담 신청",
	accent: "#ff3bff",
};

export const KineticHeadlineAd: React.FC<KineticHeadlineAdProps> = ({
	angle,
	headline,
	subheadline,
	cta,
	accent,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const padding = width * 0.08;
	const headlineSize = width * 0.085;

	// 앵글 라벨 — 4~18f 페이드인
	const angleOpacity = interpolate(frame, [4, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// 서브헤드라인 — 헤드라인 리빌 이후 등장
	const subSpring = spring({
		frame: frame - 62,
		fps,
		config: { damping: 200 },
	});

	// CTA 캡슐 — 후반 스케일인
	const ctaDelay = 92;
	const ctaSpring = spring({
		frame: frame - ctaDelay,
		fps,
		config: { damping: 14, mass: 0.7 },
	});
	const ctaOpacity = interpolate(frame, [ctaDelay, ctaDelay + 8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// 헤드라인 단어 단위 리빌 — 줄·단어 순서대로 6프레임 간격
	let wordIndex = 0;
	const lines = headline.split("\n");

	return (
		<AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
			{/* 강조색 글로우 */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 30%, ${accent}33, transparent 62%)`,
				}}
			/>

			<AbsoluteFill
				style={{
					padding,
					justifyContent: "center",
					fontFamily: BRAND_FONTS.body,
				}}
			>
				{/* 앵글 라벨 */}
				<div
					style={{
						opacity: angleOpacity,
						fontFamily: BRAND_FONTS.mono,
						fontSize: width * 0.026,
						letterSpacing: "0.18em",
						textTransform: "uppercase",
						color: accent,
						marginBottom: height * 0.024,
					}}
				>
					{angle}
				</div>

				{/* 헤드라인 */}
				<div
					style={{
						fontFamily: BRAND_FONTS.display,
						fontSize: headlineSize,
						fontWeight: 700,
						lineHeight: 1.08,
						letterSpacing: "-0.01em",
						color: "#ffffff",
					}}
				>
					{lines.map((line, li) => (
						<div key={li} style={{ display: "flex", flexWrap: "wrap" }}>
							{line.split(" ").map((word, wi) => {
								const wordSpring = spring({
									frame: frame - (8 + wordIndex * 6),
									fps,
									config: { damping: 18, mass: 0.6 },
								});
								wordIndex += 1;
								return (
									<span
										key={wi}
										style={{
											display: "inline-block",
											marginRight: headlineSize * 0.22,
											opacity: wordSpring,
											transform: `translateY(${interpolate(
												wordSpring,
												[0, 1],
												[headlineSize * 0.5, 0],
											)}px)`,
										}}
									>
										{word}
									</span>
								);
							})}
						</div>
					))}
				</div>

				{/* 서브헤드라인 */}
				<div
					style={{
						opacity: subSpring,
						transform: `translateY(${interpolate(subSpring, [0, 1], [24, 0])}px)`,
						marginTop: height * 0.03,
						fontSize: width * 0.034,
						fontWeight: 500,
						lineHeight: 1.4,
						color: "rgba(255,255,255,0.7)",
						maxWidth: "88%",
					}}
				>
					{subheadline}
				</div>

				{/* CTA 캡슐 — app/globals.css의 .cta-capsule 디자인 토큰 반영 */}
				<div
					style={{
						opacity: ctaOpacity,
						transform: `scale(${interpolate(ctaSpring, [0, 1], [0.7, 1])})`,
						transformOrigin: "left center",
						marginTop: height * 0.05,
						alignSelf: "flex-start",
						display: "flex",
						alignItems: "center",
						height: width * 0.115,
						padding: `0 ${width * 0.06}px`,
						borderRadius: 999,
						border: `2px solid ${accent}`,
						backgroundColor: "#000000",
						fontFamily: BRAND_FONTS.mono,
						fontSize: width * 0.032,
						fontWeight: 500,
						color: "#ffffff",
					}}
				>
					{cta}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
