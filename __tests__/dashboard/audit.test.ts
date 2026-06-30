import { buildAuditReport } from "@/lib/dashboard/audit";
import type {
	AdRow,
	AdSetRow,
	CampaignRow,
	WeekSnapshot,
} from "@/lib/dashboard/types";

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
		landingPageViews: 250,
		reportStart: "2026-06-22",
		reportEnd: "2026-06-28",
		isoWeek: "2026-W26",
		...overrides,
	};
}

function makeAd(overrides: Partial<AdRow> = {}): AdRow {
	return {
		adId: "1",
		adName: "광고 A",
		adSetId: "10",
		adSetName: "세트",
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
		reportStart: "2026-06-22",
		reportEnd: "2026-06-28",
		isoWeek: "2026-W26",
		...overrides,
	};
}

function makeSnapshot(
	isoWeek: string,
	campaigns: CampaignRow[],
	ads: AdRow[] = [],
	adSets: AdSetRow[] = [],
): WeekSnapshot {
	return {
		isoWeek,
		uploadedAt: "2026-06-30T00:00:00.000Z",
		campaigns,
		adSets,
		ads,
	};
}

const NOW = new Date("2026-06-30T01:00:00.000Z");

describe("buildAuditReport", () => {
	it("period 에 isoWeek 와 보고 기간을 포함한다", () => {
		const snap = makeSnapshot("2026-W26", [makeCampaign()]);
		const report = buildAuditReport(snap, null, NOW);
		expect(report.period).toContain("2026-W26");
		expect(report.period).toContain("2026-06-22");
		expect(report.period).toContain("2026-06-28");
	});

	it("generatedAt 는 주입한 now 를 사용한다 (박제 방지)", () => {
		const snap = makeSnapshot("2026-W26", [makeCampaign()]);
		const report = buildAuditReport(snap, null, NOW);
		expect(report.generatedAt).toBe(NOW.toISOString());
	});

	it("healthScore 와 grade 가 유효 범위 안에 있다", () => {
		const snap = makeSnapshot("2026-W26", [makeCampaign()]);
		const report = buildAuditReport(snap, null, NOW);
		expect(report.healthScore).toBeGreaterThanOrEqual(0);
		expect(report.healthScore).toBeLessThanOrEqual(100);
		expect(["A", "B", "C", "D", "F"]).toContain(report.grade);
	});

	it("평균 2배 초과 비효율 캠페인을 killList 에 올린다", () => {
		const good = makeCampaign({
			campaignId: "g",
			campaignName: "효율캠페인",
			spend: 50000,
			leads: 10, // CPL 5,000
		});
		const bad = makeCampaign({
			campaignId: "b",
			campaignName: "비효율캠페인",
			spend: 120000,
			leads: 1, // CPL 120,000 (평균보다 훨씬 높음)
		});
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [good, bad]),
			null,
			NOW,
		);
		const names = report.killList.map((k) => k.name);
		expect(names).toContain("비효율캠페인");
		expect(report.killList[0].wastedSpend).toBeGreaterThan(0);
	});

	it("지출은 있으나 리드 0건인 캠페인을 낭비로 잡는다", () => {
		const noLead = makeCampaign({
			campaignName: "리드없음",
			spend: 40000,
			leads: 0,
		});
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [makeCampaign(), noLead]),
			null,
			NOW,
		);
		expect(report.killList.some((k) => k.name === "리드없음")).toBe(true);
		expect(
			report.findings.some(
				(f) => f.category === "budget" && f.title.includes("리드없음"),
			),
		).toBe(true);
	});

	it("효율 캠페인을 scalingOpportunities 에 올린다", () => {
		const star = makeCampaign({
			campaignName: "스타",
			spend: 30000,
			leads: 30, // CPL 1,000
		});
		const filler = makeCampaign({
			campaignName: "평범",
			spend: 100000,
			leads: 10, // CPL 10,000
		});
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [star, filler]),
			null,
			NOW,
		);
		expect(report.scalingOpportunities.some((s) => s.name === "스타")).toBe(
			true,
		);
	});

	it("topCreatives 를 리드 내림차순으로 정렬한다", () => {
		const ads = [
			makeAd({ adName: "소수리드", leads: 1, spend: 5000 }),
			makeAd({ adName: "다수리드", leads: 10, spend: 20000 }),
		];
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [makeCampaign()], ads),
			null,
			NOW,
		);
		expect(report.topCreatives[0].name).toBe("다수리드");
		expect(report.topCreatives[0].cpl).toBe(2000);
	});

	it("리드 0 광고의 cpl 은 null 이다", () => {
		const ads = [makeAd({ adName: "노리드", leads: 0, spend: 5000 })];
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [makeCampaign()], ads),
			null,
			NOW,
		);
		const z = report.topCreatives.find((c) => c.name === "노리드");
		expect(z?.cpl).toBeNull();
	});

	it("전주 대비 CPL 급등 시 budget critical 발견을 만든다", () => {
		const prev = makeSnapshot("2026-W25", [
			makeCampaign({ spend: 50000, leads: 10 }), // CPL 5,000
		]);
		const curr = makeSnapshot("2026-W26", [
			makeCampaign({ spend: 100000, leads: 10 }), // CPL 10,000 (+100%)
		]);
		const report = buildAuditReport(curr, prev, NOW);
		expect(
			report.findings.some(
				(f) => f.category === "budget" && f.level === "critical",
			),
		).toBe(true);
	});

	it("A/B 페어 승자를 abConclusion 으로 요약한다", () => {
		const control = makeCampaign({
			campaignId: "c",
			campaignName: "promo",
			spend: 100000,
			leads: 2, // CPL 50,000
		});
		const variant = makeCampaign({
			campaignId: "v",
			campaignName: "promo_v2",
			spend: 30000,
			leads: 10, // CPL 3,000
		});
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [control, variant]),
			null,
			NOW,
		);
		expect(report.abConclusion).not.toBeNull();
		expect(report.abConclusion?.winner).toBe("promo_v2");
		expect(report.abConclusion?.winnerCpl).toBeLessThan(
			report.abConclusion?.loserCpl ?? Infinity,
		);
	});

	it("계정 CPL이 목표를 초과하면 종합점수를 직접 감점하고 budget 발견을 만든다", () => {
		// CPL 30,000원, 목표 20,000원 → 1.5배 초과
		const over = makeSnapshot("2026-W26", [
			makeCampaign({ spend: 300000, leads: 10 }),
		]);
		const reportOver = buildAuditReport(over, null, NOW, 20000);
		const reportLenient = buildAuditReport(over, null, NOW, 50000);
		// 같은 데이터라도 목표가 빡빡하면 점수가 더 낮아야 한다
		expect(reportOver.healthScore).toBeLessThan(reportLenient.healthScore);
		expect(
			reportOver.findings.some(
				(f) => f.category === "budget" && f.title.includes("목표"),
			),
		).toBe(true);
		expect(reportOver.summary).toContain("목표 20,000원 초과");
	});

	it("목표 이내면 목표 관련 감점이 없다", () => {
		const within = makeSnapshot("2026-W26", [
			makeCampaign({ spend: 100000, leads: 10 }), // CPL 10,000 < 20,000
		]);
		const report = buildAuditReport(within, null, NOW, 20000);
		expect(
			report.findings.some(
				(f) => f.category === "budget" && f.title.includes("목표"),
			),
		).toBe(false);
		expect(report.summary).toContain("목표 20,000원 이내");
	});

	it("캠페인별 권장 조치(verdict)를 액션별로 정확히 분류한다", () => {
		const kill = makeCampaign({
			campaignName: "킬",
			spend: 50000,
			leads: 0, // 리드 0 → kill
		});
		const scale = makeCampaign({
			campaignName: "증액",
			spend: 24000,
			leads: 4, // CPL 6,000 = 목표 0.3배 → scale
		});
		const maintain = makeCampaign({
			campaignName: "유지",
			spend: 30000,
			leads: 2, // CPL 15,000 < 20,000 → maintain
		});
		const watch = makeCampaign({
			campaignName: "점검",
			spend: 46000,
			leads: 2, // CPL 23,000 = 1.15배 → watch
		});
		const reduce = makeCampaign({
			campaignName: "축소",
			spend: 70000,
			leads: 2, // CPL 35,000 = 1.75배 → reduce
		});
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [kill, scale, maintain, watch, reduce]),
			null,
			NOW,
			20000,
		);
		const byName = Object.fromEntries(
			report.campaignVerdicts.map((v) => [v.name, v.action]),
		);
		expect(byName["킬"]).toBe("kill");
		expect(byName["증액"]).toBe("scale");
		expect(byName["유지"]).toBe("maintain");
		expect(byName["점검"]).toBe("watch");
		expect(byName["축소"]).toBe("reduce");
		// 지출 0 캠페인은 판단 대상에서 제외
		expect(report.targetCpl).toBe(20000);
	});

	it("미집행(지출 0) 캠페인은 verdict 에서 제외한다", () => {
		const paused = makeCampaign({ campaignName: "미집행", spend: 0, leads: 0 });
		const live = makeCampaign({ campaignName: "집행", spend: 40000, leads: 2 });
		const report = buildAuditReport(
			makeSnapshot("2026-W26", [paused, live]),
			null,
			NOW,
			20000,
		);
		const names = report.campaignVerdicts.map((v) => v.name);
		expect(names).toContain("집행");
		expect(names).not.toContain("미집행");
	});

	it("빈 캠페인이면 안전하게 동작한다", () => {
		const report = buildAuditReport(makeSnapshot("2026-W26", []), null, NOW);
		expect(report.healthScore).toBeGreaterThanOrEqual(0);
		expect(report.killList).toEqual([]);
		expect(report.topCreatives).toEqual([]);
	});
});
