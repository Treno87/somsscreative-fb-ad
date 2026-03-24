import {
	AB_SUFFIX_PATTERNS,
	AB_WINNER_MIN_DELTA,
	CPL_CRITICAL_THRESHOLD,
	CPL_WARNING_THRESHOLD,
	FATIGUE_CRITICAL_THRESHOLD,
	FATIGUE_WARNING_THRESHOLD,
	MIN_IMPRESSIONS_FOR_FATIGUE,
} from "./constants";
import type {
	AbPair,
	AdRow,
	CampaignRow,
	CreativeFatigue,
	FatigueStatus,
	InsightMessage,
	KpiSummary,
	TrendPoint,
	WeekDelta,
	WeekSnapshot,
} from "./types";

// ---- KPI Summary ----

export function computeKpiSummary(campaigns: CampaignRow[]): KpiSummary {
	if (campaigns.length === 0) {
		return {
			totalSpend: 0,
			totalLeads: 0,
			cpl: null,
			cpc: null,
			avgLinkCtr: 0,
			totalImpressions: 0,
			totalReach: 0,
			totalLandingPageViews: 0,
		};
	}

	const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
	const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
	const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
	const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
	const totalLandingPageViews = campaigns.reduce(
		(s, c) => s + (c.landingPageViews ?? 0),
		0,
	);

	// Weighted average CTR by impressions
	const totalClicks = campaigns.reduce(
		(s, c) => s + c.impressions * c.linkCtr,
		0,
	);
	const avgLinkCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

	const totalLinkClicks = campaigns.reduce((s, c) => s + c.linkClicks, 0);
	const cpl = totalLeads > 0 ? totalSpend / totalLeads : null;
	const cpc = totalLinkClicks > 0 ? totalSpend / totalLinkClicks : null;

	return {
		totalSpend,
		totalLeads,
		cpl,
		cpc,
		avgLinkCtr,
		totalImpressions,
		totalReach,
		totalLandingPageViews,
	};
}

// ---- Week Delta ----

export function computeWeekDelta(
	current: KpiSummary,
	previous: KpiSummary | null,
): WeekDelta {
	if (!previous) {
		return { current, previous: null, cplDeltaPct: null, ctrDeltaPct: null };
	}

	const cplDeltaPct =
		previous.cpl !== null && current.cpl !== null
			? (current.cpl - previous.cpl) / previous.cpl
			: null;

	const ctrDeltaPct =
		previous.avgLinkCtr > 0
			? (current.avgLinkCtr - previous.avgLinkCtr) / previous.avgLinkCtr
			: null;

	return { current, previous, cplDeltaPct, ctrDeltaPct };
}

// ---- A/B Pair Detection ----

function normaliseCampaignName(name: string): string {
	let lower = name.toLowerCase();
	for (const suffix of AB_SUFFIX_PATTERNS) {
		if (lower.endsWith(suffix)) {
			lower = lower.slice(0, lower.length - suffix.length);
			break;
		}
	}
	return lower;
}

export function detectAbPairs(campaigns: CampaignRow[]): AbPair[] {
	const pairs: AbPair[] = [];

	for (const variant of campaigns) {
		const variantLower = variant.campaignName.toLowerCase();
		const matchedSuffix = AB_SUFFIX_PATTERNS.find((s) =>
			variantLower.endsWith(s),
		);
		if (!matchedSuffix) continue;

		const baseName = normaliseCampaignName(variant.campaignName);
		const control = campaigns.find(
			(c) =>
				c.campaignName.toLowerCase() === baseName &&
				c.campaignName !== variant.campaignName,
		);
		if (!control) continue;

		const controlKpi = computeKpiSummary([control]);
		const variantKpi = computeKpiSummary([variant]);

		let winner: AbPair["winner"] = "inconclusive";
		if (controlKpi.cpl !== null && variantKpi.cpl !== null) {
			const delta = Math.abs(controlKpi.cpl - variantKpi.cpl) / controlKpi.cpl;
			if (delta >= AB_WINNER_MIN_DELTA) {
				winner = variantKpi.cpl < controlKpi.cpl ? "variant" : "control";
			}
		}

		pairs.push({
			controlName: control.campaignName,
			variantName: variant.campaignName,
			control: controlKpi,
			variant: variantKpi,
			winner,
		});
	}

	return pairs;
}

// ---- Creative Fatigue ----

function fatigueStatus(dropPct: number): FatigueStatus {
	if (dropPct >= FATIGUE_CRITICAL_THRESHOLD) return "critical";
	if (dropPct >= FATIGUE_WARNING_THRESHOLD) return "warning";
	return "ok";
}

export function detectCreativeFatigue(
	current: AdRow[],
	previous: AdRow[],
): CreativeFatigue[] {
	const prevMap = new Map(previous.map((a) => [a.adName, a]));
	const results: CreativeFatigue[] = [];

	for (const ad of current) {
		const prev = prevMap.get(ad.adName);
		if (!prev) continue;
		if (ad.impressions < MIN_IMPRESSIONS_FOR_FATIGUE) continue;
		if (prev.impressions < MIN_IMPRESSIONS_FOR_FATIGUE) continue;

		const ctrDropPct =
			prev.linkCtr > 0 ? (prev.linkCtr - ad.linkCtr) / prev.linkCtr : 0;

		results.push({
			adName: ad.adName,
			campaignName: ad.campaignName,
			currentCtr: ad.linkCtr,
			previousCtr: prev.linkCtr,
			ctrDropPct,
			status: fatigueStatus(ctrDropPct),
		});
	}

	return results;
}

// ---- Insights ----

export function generateInsights(
	delta: WeekDelta,
	fatigue: CreativeFatigue[],
	pairs: AbPair[],
): InsightMessage[] {
	const insights: InsightMessage[] = [];

	// CPL change insights
	if (delta.cplDeltaPct !== null) {
		if (delta.cplDeltaPct >= CPL_CRITICAL_THRESHOLD) {
			insights.push({
				level: "critical",
				text: `CPL이 전주 대비 ${Math.round(delta.cplDeltaPct * 100)}% 상승했습니다. 즉시 점검이 필요합니다.`,
			});
		} else if (delta.cplDeltaPct >= CPL_WARNING_THRESHOLD) {
			insights.push({
				level: "warning",
				text: `CPL이 전주 대비 ${Math.round(delta.cplDeltaPct * 100)}% 상승했습니다.`,
			});
		}
	}

	// Creative fatigue insights
	const criticalFatigue = fatigue.filter((f) => f.status === "critical");
	if (criticalFatigue.length > 0) {
		insights.push({
			level: "critical",
			text: `${criticalFatigue.length}개 광고에서 심각한 CTR 하락이 감지됐습니다. 소재 교체를 검토하세요.`,
		});
	}

	// A/B pair insights
	for (const pair of pairs) {
		if (pair.winner !== "inconclusive") {
			const winnerName =
				pair.winner === "variant" ? pair.variantName : pair.controlName;
			insights.push({
				level: "info",
				text: `A/B 테스트: "${winnerName}"이 더 낮은 CPL을 기록했습니다.`,
			});
		}
	}

	return insights;
}

// ---- Trend Points ----

export function computeTrendPoints(snapshots: WeekSnapshot[]): TrendPoint[] {
	return snapshots.map((snap) => {
		const kpi = computeKpiSummary(snap.campaigns);
		return {
			week: snap.isoWeek,
			cpl: kpi.cpl,
			ctr: kpi.avgLinkCtr,
			spend: kpi.totalSpend,
			leads: kpi.totalLeads,
		};
	});
}
