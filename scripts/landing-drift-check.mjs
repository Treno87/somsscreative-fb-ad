// 랜딩 드리프트 체크 — 배포된 아임웹 페이지가 repo 정본과 같은지 검증한다.
//
// 사용:
//   node scripts/landing-drift-check.mjs <course> <live-url>
//   예: node scripts/landing-drift-check.mjs intern10000 https://www.somsscreative.com/intern-landing
//
// 동작:
//   courses/{course}/imweb.html 의 sentinel 마커(hallmark:start ~ hallmark:end) 사이 본문과
//   라이브 페이지에서 같은 마커 사이를 잘라낸 본문을 비교한다.
//   - 일치(exit 0)  → 정본이 곧 배포본. 디자인 감사를 정본으로 진행해도 된다.
//   - 불일치(exit 1) → 아임웹 코드블록을 누가 손댐. 먼저 정본과 동기화한 뒤 감사.
//   - 오류(exit 2)  → 마커 누락·파일 없음·네트워크 실패 등.
//
// 마커 자체(v=·generated= 등 가변 속성)는 비교에서 제외하고, 줄 단위 trim +
// 빈 줄 제거로 정규화해 아임웹 재들여쓰기로 인한 오탐을 막는다.
// 전체 워크플로우: docs/PROCESS.md Phase 7 § 랜딩 감사 — 2층 구조.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [course, url] = process.argv.slice(2);

if (!course || !url) {
	console.error("사용법: node scripts/landing-drift-check.mjs <course> <live-url>");
	process.exit(2);
}

const localPath = join("courses", course, "imweb.html");
if (!existsSync(localPath)) {
	console.error(`✗ 정본을 찾을 수 없습니다: ${localPath}`);
	process.exit(2);
}

// 마커 사이 본문만 추출 — 마커 라인 자체는 가변 속성이 있어 비교 대상에서 뺀다.
function extractBody(html, label) {
	const start = html.search(/<!--\s*hallmark:start[^>]*-->/i);
	const end = html.search(/<!--\s*hallmark:end[^>]*-->/i);
	if (start < 0 || end < 0) {
		console.error(
			`✗ ${label}에서 sentinel 마커를 찾지 못했습니다 (hallmark:start / hallmark:end).`,
		);
		process.exit(2);
	}
	const bodyStart = html.indexOf("-->", start) + 3;
	return html.slice(bodyStart, end);
}

// 공백·들여쓰기 차이로 인한 오탐 방지 — 줄 단위 trim 후 빈 줄 제거.
function normalize(s) {
	return s
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

const localBody = normalize(extractBody(readFileSync(localPath, "utf-8"), "정본"));

let liveHtml;
try {
	const res = await fetch(url, { redirect: "follow" });
	if (!res.ok) {
		console.error(`✗ 라이브 페이지 응답 ${res.status} — ${url}`);
		process.exit(2);
	}
	liveHtml = await res.text();
} catch (err) {
	console.error(`✗ 라이브 페이지를 가져오지 못했습니다: ${err.message}`);
	process.exit(2);
}

const liveBody = normalize(extractBody(liveHtml, "라이브"));

if (localBody.join("\n") === liveBody.join("\n")) {
	console.log(`✅ 일치 — ${course} 정본 = 배포본. 디자인 감사를 정본으로 진행해도 됩니다.`);
	process.exit(0);
}

// 드리프트 — 첫 불일치 지점들을 보고한다.
console.error(`✗ 드리프트 감지 — ${course} 정본과 배포본이 다릅니다.`);
console.error(`  정본 ${localBody.length}줄 · 배포본 ${liveBody.length}줄\n`);

const max = Math.max(localBody.length, liveBody.length);
let shown = 0;
for (let i = 0; i < max && shown < 12; i++) {
	if (localBody[i] !== liveBody[i]) {
		console.error(`  L${i + 1}`);
		console.error(`    정본  : ${localBody[i] ?? "(없음)"}`);
		console.error(`    배포본: ${liveBody[i] ?? "(없음)"}`);
		shown++;
	}
}
console.error(`\n→ 아임웹 코드블록을 정본과 동기화한 뒤 감사하세요.`);
process.exit(1);
