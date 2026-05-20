import React from "react";
import { Composition } from "remotion";
import { KineticHeadlineAd, kineticHeadlineDefaults } from "./KineticHeadlineAd";

const FPS = 30;
const DURATION = 150; // 5초

// 같은 템플릿을 Meta 게재 위치별 규격으로 등록한다.
//  - 9:16 릴스·스토리 / 1:1 피드 / 4:5 피드
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="KineticHeadlineAd-9x16"
				component={KineticHeadlineAd}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={kineticHeadlineDefaults}
			/>
			<Composition
				id="KineticHeadlineAd-1x1"
				component={KineticHeadlineAd}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={kineticHeadlineDefaults}
			/>
			<Composition
				id="KineticHeadlineAd-4x5"
				component={KineticHeadlineAd}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1350}
				defaultProps={kineticHeadlineDefaults}
			/>
		</>
	);
};
