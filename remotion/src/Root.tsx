import React from "react";
import { Composition } from "remotion";
import { KineticHeadlineAd, kineticHeadlineDefaults } from "./KineticHeadlineAd";
import {
	ClassicSplitAd,
	classicSplitDefaults,
	classicSplitDuration,
} from "./ClassicSplitAd";
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
			{/* Before/After Split 애니메이션 광고 — split01/02 재료를 하나의 서사로.
			    Meta 게재 위치별 3종: 1:1(피드) / 9:16(릴스·스토리) / 1.91:1(가로 링크).
			    비율에 따라 분할 방향이 바뀌어 어느 규격에서도 잘리지 않는다. */}
			<Composition
				id="ClassicSplitAd-1x1"
				component={ClassicSplitAd}
				durationInFrames={classicSplitDuration}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={classicSplitDefaults}
			/>
			<Composition
				id="ClassicSplitAd-9x16"
				component={ClassicSplitAd}
				durationInFrames={classicSplitDuration}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={classicSplitDefaults}
			/>
			<Composition
				id="ClassicSplitAd-191x1"
				component={ClassicSplitAd}
				durationInFrames={classicSplitDuration}
				fps={FPS}
				width={1080}
				height={566}
				defaultProps={classicSplitDefaults}
			/>

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
			{/* 가로 1.91:1(링크 광고) — 높이가 낮은 프레임이라 템플릿이 폰트·요소를
			    높이 기준으로 축소해 텍스트가 잘리지 않게 한다(StorytellingAd.tsx scaleBase). */}
			<Composition
				id="StorytellingAd-191x1"
				component={StorytellingAd}
				fps={FPS}
				width={1080}
				height={566}
				durationInFrames={totalDurationInFrames(story)}
				defaultProps={story}
				calculateMetadata={({ props }) => ({
					durationInFrames: totalDurationInFrames(props),
				})}
			/>
		</>
	);
};
