import { STORAGE_KEY, STORAGE_VERSION } from "./constants";
import type { DashboardStore, WeekSnapshot } from "./types";

const EMPTY_STORE: DashboardStore = { version: STORAGE_VERSION, weeks: {} };

function emptyStore(): DashboardStore {
	return { version: STORAGE_VERSION, weeks: {} };
}

export function loadStore(): DashboardStore {
	if (typeof window === "undefined") return emptyStore();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyStore();
		const parsed = JSON.parse(raw) as DashboardStore;
		if (parsed.version !== STORAGE_VERSION) return emptyStore();
		return parsed;
	} catch {
		return emptyStore();
	}
}

function saveStore(store: DashboardStore): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveWeekSnapshot(
	isoWeek: string,
	snapshot: Omit<WeekSnapshot, "isoWeek">,
): void {
	const store = loadStore();
	store.weeks[isoWeek] = { isoWeek, ...snapshot };
	saveStore(store);
}

export function deleteWeekSnapshot(isoWeek: string): void {
	const store = loadStore();
	delete store.weeks[isoWeek];
	saveStore(store);
}

export function listWeeks(): string[] {
	const store = loadStore();
	return Object.keys(store.weeks).sort();
}

export function getWeekSnapshot(isoWeek: string): WeekSnapshot | null {
	const store = loadStore();
	return store.weeks[isoWeek] ?? null;
}
