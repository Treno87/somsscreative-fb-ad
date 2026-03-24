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

export interface AuditReport {
	generatedAt: string;
	period: string;
	healthScore: number;
	grade: AuditGrade;
	summary: string;
	categories: {
		creative: AuditCategoryScore;
		budget: AuditCategoryScore;
		structure: AuditCategoryScore;
		audience: AuditCategoryScore;
	};
	findings: AuditFinding[];
	quickWins: AuditQuickWin[];
	killList: AuditKillItem[];
	scalingOpportunities: AuditScalingItem[];
	abConclusion: AuditAbConclusion | null;
	topCreatives: AuditTopCreative[];
}
