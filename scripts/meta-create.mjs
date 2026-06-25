#!/usr/bin/env node
// 광고 생성 단계형 CLI — 실행 중인 Next 서버의 /api/meta/create 를 호출한다.
// 휴먼인더루프: Claude(또는 사람)가 단계마다 실행 → 결과/미리보기 확인 → 다음 단계.
//
// 사용:
//   node scripts/meta-create.mjs --spec=courses/persona-design/campaigns/1기-adspec.mjs --phase=plan
//   node scripts/meta-create.mjs --spec=<위와동일> --phase=structure
//   node scripts/meta-create.mjs --spec=<위와동일> --phase=creative   # 미리보기 출력
//   node scripts/meta-create.mjs --spec=<위와동일> --phase=ad
//
// 환경변수:
//   META_CREATE_BASE_URL  기본 http://localhost:3000
//   CRON_SECRET           /api/meta/create 인증 (필수)
//
// 안전: 생성물은 모두 PAUSED. phase=plan 은 쓰기 없는 dry-run(기본).

import path from "path";
import { pathToFileURL } from "url";

function parseArgs(argv) {
	const out = {};
	for (const arg of argv) {
		const m = arg.match(/^--([^=]+)=(.*)$/);
		if (m) out[m[1]] = m[2];
	}
	return out;
}

const args = parseArgs(process.argv.slice(2));
const specPath = args.spec;
const phase = args.phase || "plan";

if (!specPath) {
	console.error("[meta-create] --spec=<경로> 필요");
	process.exit(1);
}
const secret = process.env.CRON_SECRET;
if (!secret) {
	console.error("[meta-create] CRON_SECRET 미설정 — 중단");
	process.exit(1);
}

// 스펙(.mjs) 동적 import → 평범한 객체
const abs = path.isAbsolute(specPath) ? specPath : path.join(process.cwd(), specPath);
const mod = await import(pathToFileURL(abs).href);
const spec = mod.spec ?? mod.default;
if (!spec) {
	console.error(`[meta-create] ${specPath} 에서 export const spec(또는 default) 를 찾지 못함`);
	process.exit(1);
}

const base = process.env.META_CREATE_BASE_URL || "http://localhost:3000";
const url = new URL("/api/meta/create", base);

try {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${secret}`,
		},
		body: JSON.stringify({ phase, spec }),
	});
	const json = await res.json();

	if (json.errors?.length) {
		console.error(`[meta-create] 검증/실행 오류 (phase=${phase}):`);
		for (const e of json.errors) console.error("  -", e);
		process.exit(1);
	}
	if (!res.ok || json.ok === false) {
		console.error(`[meta-create] 실패 (HTTP ${res.status}):`, json.error ?? json);
		process.exit(1);
	}

	console.log(`[meta-create] phase=${phase} 완료 · slug=${json.slug}`);
	if (json.payloads) {
		console.log("── payload (dry-run, 쓰기 없음) ──");
		console.log(JSON.stringify(json.payloads, null, 2));
	}
	if (json.state?.campaignId) console.log("  campaignId:", json.state.campaignId);
	if (json.state?.adSetId) console.log("  adSetId   :", json.state.adSetId);
	if (json.state?.ads?.length) {
		for (const a of json.state.ads) {
			console.log(`  ad "${a.name}" creativeId=${a.creativeId ?? "-"} adId=${a.adId ?? "-"}`);
		}
	}
	if (json.previews?.length) {
		console.log("── 크리에이티브 미리보기(iframe) — 사람 확인 후 --phase=ad ──");
		for (const p of json.previews) {
			console.log(`\n[${p.name}]\n${p.preview}`);
		}
	}
} catch (err) {
	console.error("[meta-create] 요청 오류:", err.message);
	process.exit(1);
}
