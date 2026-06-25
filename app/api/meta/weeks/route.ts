// GET /api/meta/weeks — 서버 영구 저장소(DashboardStore)를 반환한다.
// 클라이언트가 cron 으로 쌓인 데이터를 localStorage 로 하이드레이션할 때 사용.

import { NextResponse } from "next/server";
import { loadServerStore } from "@/lib/dashboard/serverStore";

export const runtime = "nodejs";

export async function GET() {
	const store = await loadServerStore();
	return NextResponse.json(store);
}
