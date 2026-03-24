import {
	computeKpiSummary,
	computeTrendPoints,
	computeWeekDelta,
	detectAbPairs,
	detectCreativeFatigue,
	generateInsights,
} from "@/lib/dashboard/analytics";
import type { AdRow, CampaignRow, WeekSnapshot } from "@/lib/dashboard/types";

// ---- Helpers ----

function makeCampaign(overrides: Partial<CampaignRow> = {}): CampaignRow {
	return {
		campaignId: "1",
		campaignName: "classic",
		status: "활성",
		objective: "리드 생성",
		budgetType: "일일",
		dailyBudget: 50000,
		totalBudget: 350000,
		spend: 48000,
		impressions: 10000,
		reach: 8000,
		linkClicks: 300,
		linkCtr: 0.03,
		leads: 5,
		costPerLead: 9600,
		cpm: 4800,
		frequency: 1.25,
		videoViews: 200,
		reportStart: "2026-03-21",
		reportEnd: "2026-03-27",
		isoWeek: "2026-W12",
		...overrides,
	};
}

function makeAd(overrides: Partial<AdRow> = {}): AdRow {
	return {
		adId: "1",
		adName: "광고 A",
		adSetId: "10",
		adSetName: "팔로워 세트",
		campaignId: "1",
		campaignName: "classic",
		status: "활성",
		spend: 29000,
		impressions: 6000,
		reach: 5000,
		linkClicks: 180,
		linkCtr: 0.03,
		leads: 3,
		costPerLead: 9666,
		cpm: 4833,
		reportStart: "2026-03-21",
		reportEnd: "2026-03-27",
		isoWeek: "2026-W12",
		...overrides,
	};
}

function makeSnapshot(
	isoWeek: string,
	campaigns: CampaignRow[],
	ads: AdRow[] = [],
): WeekSnapshot {
	return {
		isoWeek,
		uploadedAt: new Date().toISOString(),
		campaigns,
		adSets: [],
		ads,
	};
}

// ---- computeKpiSummary ----

describe("computeKpiSummary", () => {
	it("여러 캠페인 합산", () => {
		const campaigns = [
			makeCampaign({
				spend: 48000,
				leads: 5,
				impressions: 10000,
				reach: 8000,
				linkCtr: 0.03,
			}),
			makeCampaign({
				spend: 52000,
				leads: 3,
				impressions: 15000,
				reach: 12000,
				linkCtr: 0.02,
			}),
		];
		const kpi = computeKpiSummary(campaigns);
		expect(kpi.totalSpend).toBe(100000);
		expect(kpi.totalLeads).toBe(8);
		expect(kpi.cpl).toBeCloseTo(12500);
		expect(kpi.totalImpressions).toBe(25000);
		expect(kpi.totalReach).toBe(20000);
	});

	it("totalLeads = 0 → cpl = null", () => {
		const campaigns = [makeCampaign({ leads: 0 })];
		const kpi = computeKpiSummary(campaigns);
		expect(kpi.cpl).toBeNull();
	});

	it("가중 평균 CTR (노출 수 기준)", () => {
		// 10000 impressions @ 0.03 CTR = 300 clicks
		// 15000 impressions @ 0.02 CTR = 300 clicks
		// total 25000 impressions, 600 clicks → 0.024 CTR
		const campaigns = [
			makeCampaign({ impressions: 10000, linkCtr: 0.03 }),
			makeCampaign({ impressions: 15000, linkCtr: 0.02 }),
		];
		const kpi = computeKpiSummary(campaigns);
		expect(kpi.avgLinkCtr).toBeCloseTo(0.024);
	});

	it("빈 배열 → 모두 0, cpl = null", () => {
		const kpi = computeKpiSummary([]);
		expect(kpi.totalSpend).toBe(0);
		expect(kpi.totalLeads).toBe(0);
		expect(kpi.cpl).toBeNull();
		expect(kpi.avgLinkCtr).toBe(0);
	});
});

// ---- computeWeekDelta ----

describe("computeWeekDelta", () => {
	it("previous = null → 모든 delta = null", () => {
		const current = computeKpiSummary([makeCampaign()]);
		const delta = computeWeekDelta(current, null);
		expect(delta.cplDeltaPct).toBeNull();
		expect(delta.ctrDeltaPct).toBeNull();
		expect(delta.previous).toBeNull();
	});

	it("CPL 8,269 → 16,307 변화 → 약 +97.2% delta", () => {
		const prev = computeKpiSummary([
			makeCampaign({
				spend: 57833,
				leads: 7,
				impressions: 10000,
				linkCtr: 0.05,
			}),
		]);
		const curr = computeKpiSummary([
			makeCampaign({
				spend: 97842,
				leads: 6,
				impressions: 10000,
				linkCtr: 0.04,
			}),
		]);
		const delta = computeWeekDelta(curr, prev);
		// CPL: 57833/7 ≈ 8262, 97842/6 = 16307 → delta ≈ +97.4%
		expect(delta.cplDeltaPct).toBeGreaterThan(0.9);
		expect(delta.cplDeltaPct).toBeLessThan(1.1);
	});

	it("CPL 개선 시 음수 delta", () => {
		const prev = computeKpiSummary([makeCampaign({ spend: 100000, leads: 5 })]);
		const curr = computeKpiSummary([makeCampaign({ spend: 50000, leads: 5 })]);
		const delta = computeWeekDelta(curr, prev);
		expect(delta.cplDeltaPct).toBeLessThan(0);
	});

	it("previous CPL = null → cplDeltaPct = null", () => {
		const prev = computeKpiSummary([makeCampaign({ leads: 0 })]);
		const curr = computeKpiSummary([makeCampaign({ leads: 5 })]);
		const delta = computeWeekDelta(curr, prev);
		expect(delta.cplDeltaPct).toBeNull();
	});
});

// ---- detectAbPairs ----

describe("detectAbPairs", () => {
	it("classic + classic_landing → 1 pair", () => {
		const campaigns = [
			makeCampaign({ campaignName: "classic", leads: 5, spend: 48000 }),
			makeCampaign({ campaignName: "classic_landing", leads: 8, spend: 48000 }),
		];
		const pairs = detectAbPairs(campaigns);
		expect(pairs).toHaveLength(1);
		expect(pairs[0].controlName).toBe("classic");
		expect(pairs[0].variantName).toBe("classic_landing");
	});

	it("variant CPL < control CPL → winner = 'variant'", () => {
		const campaigns = [
			makeCampaign({ campaignName: "classic", spend: 100000, leads: 5 }), // CPL = 20000
			makeCampaign({ campaignName: "classic_landing", spend: 50000, leads: 5 }), // CPL = 10000
		];
		const pairs = detectAbPairs(campaigns);
		expect(pairs[0].winner).toBe("variant");
	});

	it("delta < 10% → winner = 'inconclusive'", () => {
		const campaigns = [
			makeCampaign({ campaignName: "classic", spend: 100000, leads: 10 }), // CPL = 10000
			makeCampaign({
				campaignName: "classic_landing",
				spend: 95000,
				leads: 10,
			}), // CPL = 9500
		];
		const pairs = detectAbPairs(campaigns);
		expect(pairs[0].winner).toBe("inconclusive");
	});

	it("패턴 없는 캠페인들 → [] 반환", () => {
		const campaigns = [
			makeCampaign({ campaignName: "캠페인A" }),
			makeCampaign({ campaignName: "캠페인B" }),
		];
		const pairs = detectAbPairs(campaigns);
		expect(pairs).toHaveLength(0);
	});

	it("_b 접미사 패턴도 감지", () => {
		const campaigns = [
			makeCampaign({ campaignName: "foundation", spend: 100000, leads: 5 }),
			makeCampaign({ campaignName: "foundation_b", spend: 60000, leads: 5 }),
		];
		const pairs = detectAbPairs(campaigns);
		expect(pairs).toHaveLength(1);
	});
});

// ---- detectCreativeFatigue ----

describe("detectCreativeFatigue", () => {
	it("CTR 0.08 → 0.06 (25% 하락) → 'warning'", () => {
		const prev = [
			makeAd({ adName: "광고A", linkCtr: 0.08, impressions: 1000 }),
		];
		const curr = [
			makeAd({ adName: "광고A", linkCtr: 0.06, impressions: 1000 }),
		];
		const result = detectCreativeFatigue(curr, prev);
		expect(result).toHaveLength(1);
		expect(result[0].status).toBe("warning");
	});

	it("CTR 0.08 → 0.05 (37.5% 하락) → 'critical'", () => {
		const prev = [
			makeAd({ adName: "광고A", linkCtr: 0.08, impressions: 1000 }),
		];
		const curr = [
			makeAd({ adName: "광고A", linkCtr: 0.05, impressions: 1000 }),
		];
		const result = detectCreativeFatigue(curr, prev);
		expect(result[0].status).toBe("critical");
	});

	it("CTR 0.08 → 0.07 (12.5% 하락) → 'ok'", () => {
		const prev = [
			makeAd({ adName: "광고A", linkCtr: 0.08, impressions: 1000 }),
		];
		const curr = [
			makeAd({ adName: "광고A", linkCtr: 0.07, impressions: 1000 }),
		];
		const result = detectCreativeFatigue(curr, prev);
		expect(result[0].status).toBe("ok");
	});

	it("impressions < 500 → 결과 목록에서 제외", () => {
		const prev = [makeAd({ adName: "광고A", linkCtr: 0.08, impressions: 499 })];
		const curr = [makeAd({ adName: "광고A", linkCtr: 0.05, impressions: 499 })];
		const result = detectCreativeFatigue(curr, prev);
		expect(result).toHaveLength(0);
	});

	it("이전 주 데이터 없는 광고 → 제외", () => {
		const prev: AdRow[] = [];
		const curr = [makeAd({ adName: "신규광고" })];
		const result = detectCreativeFatigue(curr, prev);
		expect(result).toHaveLength(0);
	});
});

// ---- generateInsights ----

describe("generateInsights", () => {
	const baseKpi = computeKpiSummary([makeCampaign()]);

	it("CPL 25% 상승 → warning insight 생성", () => {
		const delta = {
			current: baseKpi,
			previous: baseKpi,
			cplDeltaPct: 0.25,
			ctrDeltaPct: 0,
		};
		const insights = generateInsights(delta, [], []);
		expect(insights.some((i) => i.level === "warning")).toBe(true);
	});

	it("CPL 45% 상승 → critical insight 생성", () => {
		const delta = {
			current: baseKpi,
			previous: baseKpi,
			cplDeltaPct: 0.45,
			ctrDeltaPct: 0,
		};
		const insights = generateInsights(delta, [], []);
		expect(insights.some((i) => i.level === "critical")).toBe(true);
	});

	it("critical 피로도 광고 있을 시 → critical insight 생성", () => {
		const fatigue = [
			{
				adName: "광고A",
				campaignName: "classic",
				currentCtr: 0.05,
				previousCtr: 0.08,
				ctrDropPct: 0.375,
				status: "critical" as const,
			},
		];
		const delta = {
			current: baseKpi,
			previous: null,
			cplDeltaPct: null,
			ctrDeltaPct: null,
		};
		const insights = generateInsights(delta, fatigue, []);
		expect(insights.some((i) => i.level === "critical")).toBe(true);
	});

	it("명확한 A/B 승자 → info insight 생성", () => {
		const pairs = [
			{
				controlName: "classic",
				variantName: "classic_landing",
				control: baseKpi,
				variant: { ...baseKpi, cpl: 5000 },
				winner: "variant" as const,
			},
		];
		const delta = {
			current: baseKpi,
			previous: null,
			cplDeltaPct: null,
			ctrDeltaPct: null,
		};
		const insights = generateInsights(delta, [], pairs);
		expect(insights.some((i) => i.level === "info")).toBe(true);
	});

	it("delta = null, 피로도 없음, 페어 없음 → 빈 배열", () => {
		const delta = {
			current: baseKpi,
			previous: null,
			cplDeltaPct: null,
			ctrDeltaPct: null,
		};
		const insights = generateInsights(delta, [], []);
		expect(insights).toHaveLength(0);
	});
});

// ---- computeTrendPoints ----

describe("computeTrendPoints", () => {
	it("주차별 TrendPoint 반환", () => {
		const snapshots: WeekSnapshot[] = [
			makeSnapshot("2026-W10", [
				makeCampaign({ isoWeek: "2026-W10", spend: 40000, leads: 4 }),
			]),
			makeSnapshot("2026-W11", [
				makeCampaign({ isoWeek: "2026-W11", spend: 50000, leads: 5 }),
			]),
		];
		const points = computeTrendPoints(snapshots);
		expect(points).toHaveLength(2);
		expect(points[0].week).toBe("2026-W10");
		expect(points[0].spend).toBe(40000);
		expect(points[1].week).toBe("2026-W11");
	});

	it("빈 배열 → []", () => {
		expect(computeTrendPoints([])).toHaveLength(0);
	});
});
