// 서버측 영구 저장 (파일 기반). cron 자동 수집이 사람 없이도 데이터를 쌓을 수 있게 한다.
// localStorage(클라이언트) 와 동일한 DashboardStore 모양을 analytics/store/dashboard.json 에 보관.
// 클라이언트는 /api/meta/weeks 로 이 저장소를 읽어 하이드레이션할 수 있다.

import fs from "fs/promises";
import path from "path";
import { STORAGE_VERSION } from "./constants";
import type { DashboardStore, WeekSnapshot } from "./types";

const STORE_DIR = path.join(process.cwd(), "analytics", "store");
const STORE_FILE = path.join(STORE_DIR, "dashboard.json");

function emptyStore(): DashboardStore {
	return { version: STORAGE_VERSION, weeks: {} };
}

export async function loadServerStore(): Promise<DashboardStore> {
	try {
		const raw = await fs.readFile(STORE_FILE, "utf-8");
		const parsed = JSON.parse(raw) as DashboardStore;
		if (parsed.version !== STORAGE_VERSION) return emptyStore();
		return parsed;
	} catch {
		return emptyStore();
	}
}

async function saveServerStore(store: DashboardStore): Promise<void> {
	await fs.mkdir(STORE_DIR, { recursive: true });
	await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2));
}

/** 주차 스냅샷을 영구 저장소에 upsert. */
export async function saveServerWeekSnapshot(
	snapshot: WeekSnapshot,
): Promise<void> {
	const store = await loadServerStore();
	store.weeks[snapshot.isoWeek] = snapshot;
	await saveServerStore(store);
}

export async function saveServerWeekSnapshots(
	snapshots: WeekSnapshot[],
): Promise<void> {
	if (snapshots.length === 0) return;
	const store = await loadServerStore();
	for (const snap of snapshots) store.weeks[snap.isoWeek] = snap;
	await saveServerStore(store);
}
