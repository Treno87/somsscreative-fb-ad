// 서버측 AI 진단 보고서 재생성.
//
// 동기화 직후 호출되어, 라이브 저장소(dashboard.json)의 최신 주차로부터
// report.json 을 결정론적으로 재생성한다. → 표와 AI 진단이 항상 같은 데이터를 가리킨다.

import fs from "fs/promises";
import path from "path";
import { buildAuditReport } from "./audit";
import { loadServerStore } from "./serverStore";
import type { AuditReport } from "./types";

const OUTPUT_DIR = path.join(process.cwd(), "analytics", "output");
const REPORT_FILE = path.join(OUTPUT_DIR, "report.json");

/**
 * 저장소의 최신 주차 + 직전 주차로 AuditReport 를 만들어 report.json 에 쓴다.
 * 데이터가 없으면 아무것도 하지 않고 null 반환.
 */
export async function regenerateAuditReport(
	now: Date = new Date(),
): Promise<AuditReport | null> {
	const store = await loadServerStore();
	const weekKeys = Object.keys(store.weeks).sort();
	if (weekKeys.length === 0) return null;

	const latestKey = weekKeys[weekKeys.length - 1];
	const prevKey = weekKeys[weekKeys.length - 2];
	const latest = store.weeks[latestKey];
	const previous = prevKey ? store.weeks[prevKey] : null;

	const report = buildAuditReport(latest, previous, now);

	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	await fs.writeFile(REPORT_FILE, JSON.stringify(report, null, 2));
	return report;
}
