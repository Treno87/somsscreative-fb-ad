// POST /api/meta/sync — 온디맨드 동기화 (대시보드 "Meta에서 동기화" 버튼).
// GET  /api/meta/sync — 설정 존재 여부 확인 (토큰은 노출하지 않음).
//
// body(JSON, 모두 선택):
//   { since, until }  명시적 기간 (YYYY-MM-DD)
//   { days }          최근 N일 (기본 7)
// 응답: { ok, snapshots, totals, range } 또는 { ok:false, error }

import fs from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { hasMetaConfig } from "@/lib/dashboard/meta/config";
import { lastNDays } from "@/lib/dashboard/meta/dateRange";
import { syncFromMeta } from "@/lib/dashboard/meta/sync";
import { MetaApiError } from "@/lib/dashboard/meta/client";
import { MetaConfigError } from "@/lib/dashboard/meta/config";
import { saveServerWeekSnapshots } from "@/lib/dashboard/serverStore";

export const runtime = "nodejs";

const INPUT_DIR = path.join(process.cwd(), "analytics", "input");

interface SyncBody {
	since?: string;
	until?: string;
	days?: number;
}

export async function GET() {
	return NextResponse.json({ configured: hasMetaConfig() });
}

export async function POST(req: NextRequest) {
	let body: SyncBody = {};
	try {
		body = (await req.json()) as SyncBody;
	} catch {
		// 빈 본문 허용 → 기본값 사용
	}

	const range =
		body.since && body.until
			? { since: body.since, until: body.until }
			: lastNDays(body.days && body.days > 0 ? body.days : 7);

	try {
		const result = await syncFromMeta({ range });
		await saveServerWeekSnapshots(result.snapshots);

		// 최신 스냅샷을 analytics/input 에 기록 → fb-ad-audit 에이전트가 활용
		const latest = result.snapshots[result.snapshots.length - 1];
		if (latest) {
			await fs.mkdir(INPUT_DIR, { recursive: true });
			await Promise.all([
				fs.writeFile(
					path.join(INPUT_DIR, "campaigns.json"),
					JSON.stringify(latest.campaigns, null, 2),
				),
				fs.writeFile(
					path.join(INPUT_DIR, "adsets.json"),
					JSON.stringify(latest.adSets, null, 2),
				),
				fs.writeFile(
					path.join(INPUT_DIR, "ads.json"),
					JSON.stringify(latest.ads, null, 2),
				),
			]);
		}

		return NextResponse.json({ ok: true, ...result });
	} catch (err) {
		return NextResponse.json(toErrorResponse(err), { status: errStatus(err) });
	}
}

function toErrorResponse(err: unknown): { ok: false; error: string } {
	if (err instanceof MetaConfigError) return { ok: false, error: err.message };
	if (err instanceof MetaApiError)
		return { ok: false, error: `Meta API: ${err.message}` };
	return { ok: false, error: err instanceof Error ? err.message : String(err) };
}

function errStatus(err: unknown): number {
	if (err instanceof MetaConfigError) return 400;
	if (err instanceof MetaApiError) return 502;
	return 500;
}
