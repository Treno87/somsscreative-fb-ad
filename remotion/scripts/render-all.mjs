// data/classic-ads.json의 각 행을 9:16 광고 영상으로 일괄 렌더한다.
// 사용: npm run render:all --prefix remotion
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ads = JSON.parse(
	readFileSync(join(root, "data/classic-ads.json"), "utf-8"),
);

const outDir = join(root, "out");
const tmpDir = join(root, ".tmp");
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const COMPOSITION = "KineticHeadlineAd-9x16";

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
