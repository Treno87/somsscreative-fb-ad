export interface CampaignRow {
	campaignId: string;
	campaignName: string;
	status: string;
	objective: string;
	budgetType: string;
	dailyBudget: number;
	totalBudget: number;
	spend: number;
	impressions: number;
	reach: number;
	linkClicks: number;
	linkCtr: number;
	leads: number;
	costPerLead: number;
	cpm: number;
	frequency: number;
	videoViews: number;
	landingPageViews: number;
	reportStart: string;
	reportEnd: string;
	isoWeek: string;
}

export interface AdSetRow {
	adSetId: string;
	adSetName: string;
	campaignId: string;
	campaignName: string;
	status: string;
	audienceType: string;
	dailyBudget: number;
	spend: number;
	impressions: number;
	reach: number;
	linkClicks: number;
	linkCtr: number;
	leads: number;
	costPerLead: number;
	cpm: number;
	frequency: number;
	reportStart: string;
	reportEnd: string;
	isoWeek: string;
}

export interface AdRow {
	adId: string;
	adName: string;
	adSetId: string;
	adSetName: string;
	campaignId: string;
	campaignName: string;
	status: string;
	spend: number;
	impressions: number;
	reach: number;
	linkClicks: number;
	linkCtr: number;
	leads: number;
	costPerLead: number;
	cpm: number;
	reportStart: string;
	reportEnd: string;
	isoWeek: string;
}

export interface WeekSnapshot {
	isoWeek: string;
	uploadedAt: string;
	campaigns: CampaignRow[];
	adSets: AdSetRow[];
	ads: AdRow[];
}

export interface DashboardStore {
	version: 3;
	weeks: Record<string, WeekSnapshot>;
}

export interface KpiSummary {
	totalSpend: number;
	totalLeads: number;
	cpl: number | null;
	cpc: number | null;
	avgLinkCtr: number;
	totalImpressions: number;
	totalReach: number;
	totalLandingPageViews: number;
}

export interface WeekDelta {
	current: KpiSummary;
	previous: KpiSummary | null;
	cplDeltaPct: number | null;
	ctrDeltaPct: number | null;
}

export type AbWinner = "control" | "variant" | "inconclusive";

export interface AbPair {
	controlName: string;
	variantName: string;
	control: KpiSummary;
	variant: KpiSummary;
	winner: AbWinner;
	/** 비교 맥락(소재 A/B는 "캠페인 ▸ 광고세트"). 캠페인 단위 비교는 미설정. */
	group?: string;
}

// KPI 계산 입력 — 캠페인·광고 행 모두 수용(소재 단위 A/B 비교용).
export interface KpiInputRow {
	spend: number;
	leads: number;
	impressions: number;
	reach: number;
	linkCtr: number;
	linkClicks: number;
	landingPageViews?: number;
}

export type FatigueStatus = "ok" | "warning" | "critical";

export interface CreativeFatigue {
	adName: string;
	campaignName: string;
	currentCtr: number;
	previousCtr: number;
	ctrDropPct: number;
	status: FatigueStatus;
}

export type InsightLevel = "info" | "warning" | "critical";

export interface InsightMessage {
	level: InsightLevel;
	text: string;
}

export type CsvFileType = "campaign" | "adset" | "ad";

export interface UploadState {
	week: string;
	files: Partial<Record<CsvFileType, File>>;
	parseErrors: Partial<Record<CsvFileType, string>>;
	isProcessing: boolean;
}

export interface TrendPoint {
	week: string;
	cpl: number | null;
	ctr: number;
	spend: number;
	leads: number;
}

export interface BudgetEfficiency {
	adSetId: string;
	adSetName: string;
	dailyBudget: number;
	spend: number;
	spendRatio: number;
	status: FatigueStatus;
}

// ---- AI Audit Report ----

export type AuditLevel = "critical" | "warning" | "pass";
export type AuditGrade = "A" | "B" | "C" | "D" | "F";

export interface AuditFinding {
	category: "creative" | "budget" | "structure" | "audience";
	level: AuditLevel;
	title: string;
	detail: string;
}

export interface AuditQuickWin {
	priority: number;
	action: string;
	impact: string;
}

export interface AuditKillItem {
	name: string;
	reason: string;
	wastedSpend: number;
}

export interface AuditScalingItem {
	name: string;
	recommendation: string;
	expectedImpact: string;
}

export interface AuditAbConclusion {
	winner: string;
	winnerCpl: number;
	loserCpl: number;
	cplReduction: number;
	recommendation: string;
}

export interface AuditTopCreative {
	name: string;
	cpl: number | null;
	leads: number;
	ctr: number;
}

export interface AuditCategoryScore {
	score: number;
	label: string;
}

// 캠페인별 권장 조치 — 의사결정 카드용
export type CampaignAction = "kill" | "reduce" | "watch" | "maintain" | "scale";

export interface AuditCampaignVerdict {
	name: string;
	spend: number;
	leads: number;
	cpl: number | null;
	/** cpl / 목표CPL. 리드 없으면 null. 1.0 = 목표선 */
	cplVsTarget: number | null;
	action: CampaignAction;
	reason: string;
}

export interface AuditReport {
	generatedAt: string;
	period: string;
	healthScore: number;
	grade: AuditGrade;
	summary: string;
	/** 진단에 사용한 목표 CPL(허용 상한). UI 기준선 표기용 */
	targetCpl: number;
	categories: {
		creative: AuditCategoryScore;
		budget: AuditCategoryScore;
		structure: AuditCategoryScore;
		audience: AuditCategoryScore;
	};
	/** 캠페인별 권장 조치(지출 큰 순) */
	campaignVerdicts: AuditCampaignVerdict[];
	findings: AuditFinding[];
	quickWins: AuditQuickWin[];
	killList: AuditKillItem[];
	scalingOpportunities: AuditScalingItem[];
	abConclusion: AuditAbConclusion | null;
	topCreatives: AuditTopCreative[];
}
