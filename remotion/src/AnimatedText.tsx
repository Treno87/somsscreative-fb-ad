import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// 텍스트 진입 애니메이션 프리셋 8종.
export type AnimPreset =
	| "fade-up"
	| "fade-down"
	| "slide-left"
	| "slide-right"
	| "blur-in"
	| "pop"
	| "rise"
	| "expand";

// 적용 단위 — 통째 / 줄별 스태거 / 단어별 스태거
export type AnimUnit = "block" | "line" | "word";

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

// 프리셋 = 진행도 p(0→1, 스프링이라 1을 살짝 넘을 수 있음) → CSS
const PRESETS: Record<AnimPreset, (p: number) => React.CSSProperties> = {
	"fade-up": (p) => ({
		opacity: clamp01(p),
		transform: `translateY(${(1 - p) * 48}px)`,
	}),
	"fade-down": (p) => ({
		opacity: clamp01(p),
		transform: `translateY(${(1 - p) * -48}px)`,
	}),
	"slide-left": (p) => ({
		opacity: clamp01(p),
		transform: `translateX(${(1 - p) * 80}px)`,
	}),
	"slide-right": (p) => ({
		opacity: clamp01(p),
		transform: `translateX(${(1 - p) * -80}px)`,
	}),
	"blur-in": (p) => ({
		opacity: clamp01(p),
		filter: `blur(${(1 - clamp01(p)) * 16}px)`,
	}),
	pop: (p) => ({
		opacity: clamp01(p),
		transform: `scale(${0.6 + p * 0.4})`,
	}),
	rise: (p) => ({
		opacity: clamp01(p),
		transform: `translateY(${(1 - p) * 110}px)`,
	}),
	expand: (p) => ({
		opacity: clamp01(p),
		letterSpacing: `${(1 - clamp01(p)) * 0.32}em`,
	}),
};

type Props = {
	/** \n 으로 줄바꿈 */
	text: string;
	preset: AnimPreset;
	unit: AnimUnit;
	/** 애니메이션 시작 지연(프레임) */
	delayInFrames?: number;
	/** line·word 단위에서 토큰 간 간격(프레임) */
	staggerInFrames?: number;
	style?: React.CSSProperties;
};

export const AnimatedText: React.FC<Props> = ({
	text,
	preset,
	unit,
	delayInFrames = 0,
	staggerInFrames = 4,
	style,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const apply = PRESETS[preset] ?? PRESETS["fade-up"];

	const styleAt = (tokenDelay: number): React.CSSProperties => {
		const p = spring({
			frame: frame - delayInFrames - tokenDelay,
			fps,
			config: { damping: 18, mass: 0.6 },
		});
		return apply(p);
	};

	const lines = text.split("\n");

	if (unit === "block") {
		return (
			<div style={{ ...style, ...styleAt(0), whiteSpace: "pre-line" }}>
				{text}
			</div>
		);
	}

	if (unit === "line") {
		return (
			<div style={style}>
				{lines.map((line, i) => (
					<div key={i} style={styleAt(i * staggerInFrames)}>
						{line}
					</div>
				))}
			</div>
		);
	}

	// word — 줄바꿈 유지, 단어별 스태거
	let wordIndex = 0;
	return (
		<div style={style}>
			{lines.map((line, li) => (
				<div key={li} style={{ display: "flex", flexWrap: "wrap" }}>
					{line.split(" ").map((word, k) => {
						const delay = wordIndex * staggerInFrames;
						wordIndex += 1;
						return (
							<span
								key={k}
								style={{
									display: "inline-block",
									marginRight: "0.28em",
									...styleAt(delay),
								}}
							>
								{word}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};
