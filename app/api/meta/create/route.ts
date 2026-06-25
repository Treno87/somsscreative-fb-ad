// POST /api/meta/create — 광고 생성 단계 실행 (CRON_SECRET 보호).
// 실광고비와 직결되므로 cron 과 동일하게 시크릿으로 보호한다.
//
// body(JSON): { phase: "plan"|"structure"|"creative"|"ad", spec: AdSpec }
// 응답: PhaseResult (payloads | previews | errors 포함)

import { type NextRequest, NextResponse } from "next/server";
import { MetaApiError } from "@/lib/dashboard/meta/client";
import { MetaConfigError } from "@/lib/dashboard/meta/config";
import {
	type Phase,
	runPhase,
} from "@/lib/dashboard/meta/write/orchestrate";
import type { AdSpec } from "@/lib/dashboard/meta/write/adspec";

export const runtime = "nodejs";

const PHASES: Phase[] = ["plan", "structure", "creative", "ad"];

interface CreateBody {
	phase?: string;
	spec?: AdSpec;
}

function authorized(req: NextRequest): boolean {
	const secret = process.env.CRON_SECRET?.trim();
	if (!secret) return false; // 시크릿 미설정 시 비활성(안전 기본값)
	const header = req.headers.get("authorization") ?? "";
	const bearer = header.replace(/^Bearer\s+/i, "").trim();
	return bearer === secret;
}

export async function POST(req: NextRequest) {
	if (!authorized(req)) {
		return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
	}

	let body: CreateBody;
	try {
		body = (await req.json()) as CreateBody;
	} catch {
		return NextResponse.json({ ok: false, error: "잘못된 JSON" }, { status: 400 });
	}

	const phase = body.phase as Phase;
	if (!PHASES.includes(phase)) {
		return NextResponse.json(
			{ ok: false, error: `phase 무효: ${body.phase} (${PHASES.join("|")})` },
			{ status: 400 },
		);
	}
	if (!body.spec) {
		return NextResponse.json({ ok: false, error: "spec 누락" }, { status: 400 });
	}

	try {
		const result = await runPhase(phase, body.spec);
		const ok = !result.errors || result.errors.length === 0;
		return NextResponse.json({ ok, ...result }, { status: ok ? 200 : 422 });
	} catch (err) {
		const status =
			err instanceof MetaConfigError
				? 400
				: err instanceof MetaApiError
					? 502
					: 500;
		return NextResponse.json(
			{ ok: false, error: err instanceof Error ? err.message : String(err) },
			{ status },
		);
	}
}
