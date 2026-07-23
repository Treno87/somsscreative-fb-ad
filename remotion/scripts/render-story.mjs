// StorytellingAd 일괄 렌더 — story.json 하나로 전 비율 렌더 (+선택: 배달 트리 복사)
//
// 사용법:
//   npm run render:story --prefix remotion -- data/{course}-{기수}-story.json
//   npm run render:story --prefix remotion -- data/classic-65기-story.json --all-ratios
//   npm run render:story --prefix remotion -- data/classic-65기-story.json --frames=0-30   (스모크 렌더)
//   npm run render:story --prefix remotion -- data/classic-65기-story.json --deliver=v01   (검수 후 확정본 배달)
//
// 기본 3비율(9:16·1:1·4:5)을 remotion/out/ 에 렌더한다. --all-ratios 는 1.91:1 추가.
// --deliver=v{NN} 을 주면 out/ 결과물을 public/ads/{course}/{기수}/v{NN}/video/ 로
// 규약 파일명(docs/ad-asset-organization.md)으로 복사한다. 기본은 스크래치(out/)까지만.
// 그 외 --로 시작하는 인자는 npx remotion render 에 그대로 전달된다.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), ".."); // remotion/
const repoRoot = resolve(root, ".."); // 리포 루트

// ---- 인자 파싱 ----
const args = process.argv.slice(2);
const feedArg = args.find((a) => !a.startsWith("--"));
const allRatios = args.includes("--all-ratios");
const deliverArg = args.find((a) => a.startsWith("--deliver="));
const passThrough = args.filter(
	(a) => a.startsWith("--") && a !== "--all-ratios" && !a.startsWith("--deliver="),
);

if (!feedArg) {
	console.error("✗ story.json 경로가 필요합니다.");
	console.error("  예: npm run render:story --prefix remotion -- data/classic-65기-story.json");
	process.exit(1);
}
const feedPath = resolve(root, feedArg);
if (!existsSync(feedPath)) {
	console.error(`✗ 데이터 피드를 찾을 수 없습니다: ${feedArg}`);
	process.exit(1);
}

const base = basename(feedPath, ".json"); // 예: classic-65기-story

// 비율별 컴포지션 (docs/video-remotion.md 비율 정책: 표준 3종 + 옵션 191)
const RATIOS = [
	{ comp: "StorytellingAd-9x16", suffix: "", slug: "reels" },
	{ comp: "StorytellingAd-1x1", suffix: "-1x1", slug: "1x1" },
	{ comp: "StorytellingAd-4x5", suffix: "-4x5", slug: "4x5" },
	...(allRatios ? [{ comp: "StorytellingAd-191x1", suffix: "-191x1", slug: "191" }] : []),
];

mkdirSync(join(root, "out"), { recursive: true });

// ---- 렌더 ----
const outputs = [];
for (const r of RATIOS) {
	const out = join("out", `${base}${r.suffix}.mp4`);
	console.log(`\n▶ 렌더링: ${r.comp} → ${out}`);
	execSync(
		`npx remotion render ${r.comp} "${out}" --props="${feedPath}" ${passThrough.join(" ")}`,
		{ cwd: root, stdio: "inherit" },
	);
	outputs.push({ ...r, path: join(root, out) });
}
console.log(`\n✅ 렌더 완료 — remotion/out/ 에 ${outputs.length}개 생성.`);

// ---- 배달 (선택) ----
if (deliverArg) {
	const version = deliverArg.split("=")[1]; // 예: v01
	if (!/^v\d{2}$/.test(version)) {
		console.error(`✗ --deliver 값은 v01 형식이어야 합니다: ${version}`);
		process.exit(1);
	}
	// 파일명 규약 {course}-{기수}-story 에서 course·기수 추출
	const m = base.match(/^(.+)-([^-]+기)-story$/);
	if (!m) {
		console.error(`✗ 배달하려면 피드 파일명이 {course}-{기수}-story.json 형식이어야 합니다: ${base}`);
		process.exit(1);
	}
	const [, course, cohort] = m;
	const destDir = join(repoRoot, "public", "ads", course, cohort, version, "video");
	mkdirSync(destDir, { recursive: true });
	for (const o of outputs) {
		const destName = `${course}-${cohort}-story-${o.slug}-${version}.mp4`;
		copyFileSync(o.path, join(destDir, destName));
		console.log(`📦 배달: public/ads/${course}/${cohort}/${version}/video/${destName}`);
	}
	console.log(`\n다음: courses/${course}/campaigns/${cohort}-assets.md 매니페스트를 갱신하세요.`);
} else {
	console.log("검수 후 배달하려면: --deliver=v01  (public/ads/ 규약 복사)");
}
