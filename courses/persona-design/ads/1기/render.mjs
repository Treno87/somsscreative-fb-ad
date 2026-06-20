// persona-design 1기 광고 정적 소재 렌더러
// singles.html(단일 4종×2비율) + carousel-b.html(8슬라이드)를 배달 트리로 PNG 출력.
// 각 .card 섹션을 element.screenshot()으로 잘라 1:1(1080²)·4:5(1080×1350)가 DOM대로 결정됨.
// 규약: docs/ad-asset-organization.md
//
//   node render.mjs               # 전체 (기본 버전 v01)
//   VER=v02 node render.mjs       # 버전 지정
//   node render.mjs singles       # singles만

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdir } from "node:fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const VER = process.env.VER || "v01";
const base = join(here, `../../../../public/ads/persona-design/1기/${VER}`);
const imageDir = join(base, "image");
const carouselDir = join(base, "carousel/face9");

// (섹션 id → 배달 파일명). 버전 접미사는 자동 부여.
const JOBS = {
	singles: {
		html: "singles.html",
		dir: imageDir,
		cards: {
			"s1-hook": "persona-design-1기-hook-1x1",
			"s1-hook-45": "persona-design-1기-hook-4x5",
			"s2-system": "persona-design-1기-system-1x1",
			"s2-system-45": "persona-design-1기-system-4x5",
			"s3-offer": "persona-design-1기-offer-1x1",
			"s3-offer-45": "persona-design-1기-offer-4x5",
			"s4-instructor": "persona-design-1기-instructor-1x1",
			"s4-instructor-45": "persona-design-1기-instructor-4x5",
		},
	},
	carousel: {
		html: "carousel-b.html",
		dir: carouselDir,
		cards: {
			c1: "01", c2: "02", c3: "03", c4: "04",
			c5: "05", c6: "06", c7: "07", c8: "08",
		},
	},
};

const which = process.argv[2];
const targets = which ? [which] : Object.keys(JOBS);

const browser = await chromium.launch();
// deviceScaleFactor:1 — .card가 이미 1080px 풀해상도라 추가 배율 불필요
const page = await browser.newPage({ viewport: { width: 1240, height: 1400 }, deviceScaleFactor: 1 });

let total = 0;
for (const key of targets) {
	const job = JOBS[key];
	if (!job) {
		console.warn(`skip unknown target: ${key}`);
		continue;
	}
	await mkdir(job.dir, { recursive: true });
	const url = pathToFileURL(join(here, job.html)).href;
	await page.goto(url, { waitUntil: "networkidle" });
	await page.evaluate(() => document.fonts.ready); // Pretendard(CDN) 로딩 대기

	for (const [sel, name] of Object.entries(job.cards)) {
		const el = page.locator(`#${sel}`);
		if ((await el.count()) === 0) {
			console.warn(`  ✗ ${name} — #${sel} 섹션 없음`);
			continue;
		}
		const file = join(job.dir, `${name}-${VER}.png`);
		await el.scrollIntoViewIfNeeded();
		await el.screenshot({ path: file });
		console.log(`  ✓ ${name}-${VER}.png`);
		total++;
	}
}

await browser.close();
console.log(`\n${total}장 렌더 완료 → ${base}`);
