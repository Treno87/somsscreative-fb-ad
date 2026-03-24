import { STORAGE_KEY, STORAGE_VERSION } from "@/lib/dashboard/constants";
import {
	deleteWeekSnapshot,
	getWeekSnapshot,
	listWeeks,
	loadStore,
	saveWeekSnapshot,
} from "@/lib/dashboard/storage";
import type { WeekSnapshot } from "@/lib/dashboard/types";

function makeSnapshot(isoWeek: string): Omit<WeekSnapshot, "isoWeek"> {
	return {
		uploadedAt: "2026-03-24T00:00:00.000Z",
		campaigns: [],
		adSets: [],
		ads: [],
	};
}

beforeEach(() => {
	localStorage.clear();
});

describe("loadStore", () => {
	it("첫 loadStore → 최신 버전 빈 store 반환", () => {
		const store = loadStore();
		expect(store.version).toBe(STORAGE_VERSION);
		expect(store.weeks).toEqual({});
	});

	it("버전 1 데이터 존재 시 → 빈 store로 초기화", () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: 1, weeks: { "2026-W10": {} } }),
		);
		const store = loadStore();
		expect(store.weeks).toEqual({});
	});

	it("손상된 JSON → 빈 store 반환", () => {
		localStorage.setItem(STORAGE_KEY, "not-valid-json{{{");
		const store = loadStore();
		expect(store.version).toBe(STORAGE_VERSION);
		expect(store.weeks).toEqual({});
	});
});

describe("saveWeekSnapshot & loadStore", () => {
	it("saveWeekSnapshot 후 loadStore → 저장한 데이터 반환", () => {
		saveWeekSnapshot("2026-W12", makeSnapshot("2026-W12"));
		const store = loadStore();
		expect(store.weeks["2026-W12"]).toBeDefined();
		expect(store.weeks["2026-W12"].isoWeek).toBe("2026-W12");
	});

	it("동일 주차 saveWeekSnapshot 2회 → 덮어쓰기", () => {
		saveWeekSnapshot("2026-W12", {
			...makeSnapshot("2026-W12"),
			uploadedAt: "first",
		});
		saveWeekSnapshot("2026-W12", {
			...makeSnapshot("2026-W12"),
			uploadedAt: "second",
		});
		const store = loadStore();
		expect(store.weeks["2026-W12"].uploadedAt).toBe("second");
		expect(Object.keys(store.weeks)).toHaveLength(1);
	});
});

describe("listWeeks", () => {
	it("ISO 주차 오름차순 정렬된 배열 반환", () => {
		saveWeekSnapshot("2026-W12", makeSnapshot("2026-W12"));
		saveWeekSnapshot("2026-W10", makeSnapshot("2026-W10"));
		saveWeekSnapshot("2026-W11", makeSnapshot("2026-W11"));
		const weeks = listWeeks();
		expect(weeks).toEqual(["2026-W10", "2026-W11", "2026-W12"]);
	});

	it("데이터 없을 시 빈 배열 반환", () => {
		expect(listWeeks()).toEqual([]);
	});
});

describe("deleteWeekSnapshot", () => {
	it("해당 주차 제거 확인", () => {
		saveWeekSnapshot("2026-W12", makeSnapshot("2026-W12"));
		saveWeekSnapshot("2026-W13", makeSnapshot("2026-W13"));
		deleteWeekSnapshot("2026-W12");
		const weeks = listWeeks();
		expect(weeks).toEqual(["2026-W13"]);
	});

	it("없는 주차 삭제 → 에러 없이 처리", () => {
		expect(() => deleteWeekSnapshot("2026-W99")).not.toThrow();
	});
});

describe("getWeekSnapshot", () => {
	it("존재하는 주차 → WeekSnapshot 반환", () => {
		saveWeekSnapshot("2026-W12", makeSnapshot("2026-W12"));
		const snap = getWeekSnapshot("2026-W12");
		expect(snap).not.toBeNull();
		expect(snap?.isoWeek).toBe("2026-W12");
	});

	it("없는 주차 → null 반환", () => {
		expect(getWeekSnapshot("2026-W99")).toBeNull();
	});
});
