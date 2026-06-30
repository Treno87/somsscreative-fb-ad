// GET /api/meta/cron — 스케줄러(시스템 cron / Vercel Cron)가 호출하는 자동 수집 엔드포인트.
// CRON_SECRET 으로 보호한다. 사람이 안 눌러도 데이터가 서버 저장소에 쌓인다.
//
// 인증: Authorization: Bearer <CRON_SECRET>  또는  ?secret=<CRON_SECRET>
// 기간: 기본 = 직전 완료 ISO 주차(월~일). ?days=N 으로 최근 N일 대체 가능.

import { type NextRequest, NextResponse } from "next/server";
import { regenerateAuditReport } from "@/lib/dashboard/auditStore";
import { MetaApiError } from "@/lib/dashboard/meta/client";
import { MetaConfigError } from "@/lib/dashboard/meta/config";
import { lastNDays, previousIsoWeek } from "@/lib/dashboard/meta/dateRange";
import { syncFromMeta } from "@/lib/dashboard/meta/sync";
import { saveServerWeekSnapshots } from "@/lib/dashboard/serverStore";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
	const secret = process.env.CRON_SECRET?.trim();
	if (!secret) return false; // 시크릿 미설정 시 비활성(안전 기본값)
	const header = req.headers.get("authorization") ?? "";
	const bearer = header.replace(/^Bearer\s+/i, "").trim();
	const query = req.nextUrl.searchParams.get("secret")?.trim() ?? "";
	return bearer === secret || query === secret;
}

export async function GET(req: NextRequest) {
	if (!authorized(req)) {
		return NextResponse.json(
			{ ok: false, error: "unauthorized" },
			{ status: 401 },
		);
	}

	const daysParam = Number(req.nextUrl.searchParams.get("days"));
	const range =
		Number.isFinite(daysParam) && daysParam > 0
			? lastNDays(daysParam)
			: previousIsoWeek();

	try {
		const result = await syncFromMeta({ range });
		await saveServerWeekSnapshots(result.snapshots);
		// AI 진단 보고서를 같은 데이터로 즉시 재생성
		await regenerateAuditReport();
		return NextResponse.json({
			ok: true,
			range: result.range,
			weeks: result.snapshots.map((s) => s.isoWeek),
			totals: result.totals,
		});
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
