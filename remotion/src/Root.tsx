import React from "react";
import { Composition } from "remotion";
import { KineticHeadlineAd, kineticHeadlineDefaults } from "./KineticHeadlineAd";
import {
	StorytellingAd,
	type StorytellingAdProps,
	totalDurationInFrames,
} from "./StorytellingAd";
import internStory from "../data/intern10000-1기-story.json";

const FPS = 30;
const DURATION = 150; // 5초 — KineticHeadlineAd

const story = internStory as StorytellingAdProps;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* 후킹 단일 카드 — Meta 게재 위치별 규격 (9:16 / 1:1 / 4:5) */}
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

			{/* 이미지 구동 스토리텔링 광고 — Meta 게재 위치별 규격 (9:16 / 1:1 / 4:5).
			    텍스트는 전 씬 세로 중앙 정렬이라 어느 비율로 출력해도 잘리지 않는다. */}
			<Composition
				id="StorytellingAd-9x16"
				component={StorytellingAd}
				fps={FPS}
				width={1080}
				height={1920}
				durationInFrames={totalDurationInFrames(story)}
				defaultProps={story}
				calculateMetadata={({ props }) => ({
					durationInFrames: totalDurationInFrames(props),
				})}
			/>
			<Composition
				id="StorytellingAd-1x1"
				component={StorytellingAd}
				fps={FPS}
				width={1080}
				height={1080}
				durationInFrames={totalDurationInFrames(story)}
				defaultProps={story}
				calculateMetadata={({ props }) => ({
					durationInFrames: totalDurationInFrames(props),
				})}
			/>
			<Composition
				id="StorytellingAd-4x5"
				component={StorytellingAd}
				fps={FPS}
				width={1080}
				height={1350}
				durationInFrames={totalDurationInFrames(story)}
				defaultProps={story}
				calculateMetadata={({ props }) => ({
					durationInFrames: totalDurationInFrames(props),
				})}
			/>
		</>
	);
};
