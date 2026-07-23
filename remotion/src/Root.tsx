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
const FPS = 30;
const DURATION = 150; // 5초 — KineticHeadlineAd

// 스튜디오 미리보기용 스토리 선택 — REMOTION_STORY 환경변수로 전환한다.
//   예: REMOTION_STORY=classic-65기-story npm run dev
// defaultProps는 미리보기용 예시일 뿐, 렌더 정본은 항상 --props(scripts/render-story.mjs)다.
const storyName = process.env.REMOTION_STORY ?? "intern10000-2기-story-v3";
// webpack 컨텍스트 require — data/ 폴더의 json을 실행 시점 이름으로 불러온다.
const story = require(`../data/${storyName}.json`) as StorytellingAdProps;

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
