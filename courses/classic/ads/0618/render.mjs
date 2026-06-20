import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

// 소스(html)는 이 폴더에, 출력(png)은 배달 트리(public/ads/...)로 — 규약: docs/ad-asset-organization.md
const dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(dir, '../../../../public/ads/classic/0618/v01/image');
mkdirSync(outDir, { recursive: true });

const variants = [
  ['A-noir', 'classic-0618-noir-4x5-v01.png'],
  ['B-ivory', 'classic-0618-ivory-4x5-v01.png'],
  ['C-magenta', 'classic-0618-magenta-4x5-v01.png'],
  ['D-split', 'classic-0618-split-4x5-v01.png'],
  ['D03', 'classic-0618-d03-4x5-v01.png'],
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 2,
});

for (const [html, out] of variants) {
  await page.goto('file://' + join(dir, html + '.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(outDir, out), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log('rendered', out);
}

await browser.close();
