// 데이터 피드 JSON의 각 행을 9:16 광고 영상으로 일괄 렌더한다.
//
// 사용:
//   npm run render:all --prefix remotion                         (기본: data/classic-ads.json)
//   npm run render:all --prefix remotion -- data/classic-58.json  (특정 피드 지정)
import { execSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// 인자로 데이터 피드 경로를 받는다 (상대경로는 remotion/ 기준). 없으면 기본값.
const feedArg = process.argv[2] ?? "data/classic-ads.json";
const feedPath = resolve(root, feedArg);

if (!existsSync(feedPath)) {
	console.error(`✗ 데이터 피드를 찾을 수 없습니다: ${feedArg}`);
	console.error(
		"  예: npm run render:all --prefix remotion -- data/classic-58.json",
	);
	process.exit(1);
}

const ads = JSON.parse(readFileSync(feedPath, "utf-8"));

const outDir = join(root, "out");
const tmpDir = join(root, ".tmp");
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const COMPOSITION = "KineticHeadlineAd-9x16";

console.log(`데이터 피드: ${feedArg} (${ads.length}개 소재)`);

for (const ad of ads) {
	const propsFile = join(tmpDir, `${ad.id}.json`);
	writeFileSync(propsFile, JSON.stringify(ad));
	const out = join(outDir, `${ad.id}.mp4`);
	console.log(`\n▶ 렌더링: ${ad.id} (${ad.angle})`);
	execSync(
		`npx remotion render ${COMPOSITION} "${out}" --props="${propsFile}"`,
		{ cwd: root, stdio: "inherit" },
	);
}

rmSync(tmpDir, { recursive: true, force: true });
console.log(`\n✅ 완료 — ${ads.length}개 영상이 remotion/out/ 에 생성되었습니다.`);
