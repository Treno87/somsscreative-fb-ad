// Meta Graph API 응답 → 대시보드 row 타입 매핑 (순수 함수).
// 기존 CSV 파서와 동일한 단위 규약을 따른다:
//   - spend/cpm/budget: 통화 단위 정수 (KRW)
//   - linkCtr: 소수 (0.0394 = 3.94%)  ← Meta 는 퍼센트 숫자 "3.94" 를 주므로 /100
//   - costPerLead: spend / leads (CSV 의 "리드당 비용"과 동일 의미로 재계산)

import { toIsoWeek } from "../isoWeek";
import type { AdRow, AdSetRow, CampaignRow } from "../types";
import type {
	MetaAction,
	MetaAdMeta,
	MetaAdSetMeta,
	MetaCampaignMeta,
	MetaInsightRow,
} from "./types";

// 리드로 집계할 action_type (우선순위 순). 가장 구체적인 값 하나를 채택.
const LEAD_ACTION_TYPES = [
	"lead",
	"onsite_conversion.lead_grouped",
	"offsite_conversion.fb_pixel_lead",
	"leadgen_grouped",
	"onsite_web_lead",
];
const LANDING_PAGE_VIEW_TYPES = ["landing_page_view"];
const VIDEO_VIEW_TYPES = ["video_view"];

function num(raw: string | undefined): number {
	if (!raw) return 0;
	const n = Number(raw);
	return Number.isFinite(n) ? n : 0;
}

/** Meta 퍼센트 숫자("3.94") → 소수(0.0394). 빈 값은 0. */
export function pctToDecimal(raw: string | undefined): number {
	return num(raw) / 100;
}

/** actions 배열에서 주어진 type 들 중 첫 번째로 매칭되는 값을 반환. 없으면 0. */
export function sumActions(
	actions: MetaAction[] | undefined,
	types: string[],
): number {
	if (!actions || actions.length === 0) return 0;
	for (const t of types) {
		const found = actions.find((a) => a.action_type === t);
		if (found) return num(found.value);
	}
	return 0;
}

function leadsFrom(row: MetaInsightRow): number {
	return sumActions(row.actions, LEAD_ACTION_TYPES);
}

function isoWeekOf(row: MetaInsightRow): string {
	return row.date_start ? toIsoWeek(row.date_start) : "";
}

/** Meta 예산 최소 단위 → 통화 단위. KRW(offset=1)면 그대로. */
function budget(raw: string | undefined, currencyOffset: number): number {
	return num(raw) / currencyOffset;
}

function budgetType(meta: { daily_budget?: string; lifetime_budget?: string }): string {
	if (meta.daily_budget && num(meta.daily_budget) > 0) return "일일";
	if (meta.lifetime_budget && num(meta.lifetime_budget) > 0) return "총액";
	return "";
}

export interface MapOptions {
	currencyOffset: number;
}

export function mapCampaignRow(
	insight: MetaInsightRow,
	meta: MetaCampaignMeta | undefined,
	opts: MapOptions,
): CampaignRow {
	const spend = num(insight.spend);
	const leads = leadsFrom(insight);
	return {
		campaignId: insight.campaign_id ?? meta?.id ?? "",
		campaignName: insight.campaign_name ?? meta?.name ?? "",
		status: meta?.effective_status ?? meta?.status ?? "",
		objective: meta?.objective ?? "",
		budgetType: meta ? budgetType(meta) : "",
		dailyBudget: budget(meta?.daily_budget, opts.currencyOffset),
		totalBudget: budget(meta?.lifetime_budget, opts.currencyOffset),
		spend,
		impressions: num(insight.impressions),
		reach: num(insight.reach),
		linkClicks: num(insight.inline_link_clicks),
		linkCtr: pctToDecimal(insight.inline_link_click_ctr),
		leads,
		costPerLead: leads > 0 ? spend / leads : 0,
		cpm: num(insight.cpm),
		frequency: num(insight.frequency),
		videoViews: sumActions(insight.actions, VIDEO_VIEW_TYPES),
		landingPageViews: sumActions(insight.actions, LANDING_PAGE_VIEW_TYPES),
		reportStart: insight.date_start ?? "",
		reportEnd: insight.date_stop ?? "",
		isoWeek: isoWeekOf(insight),
	};
}

export function mapAdSetRow(
	insight: MetaInsightRow,
	meta: MetaAdSetMeta | undefined,
	opts: MapOptions,
): AdSetRow {
	const spend = num(insight.spend);
	const leads = leadsFrom(insight);
	return {
		adSetId: insight.adset_id ?? meta?.id ?? "",
		adSetName: insight.adset_name ?? meta?.name ?? "",
		campaignId: insight.campaign_id ?? meta?.campaign_id ?? "",
		campaignName: insight.campaign_name ?? "",
		status: meta?.effective_status ?? meta?.status ?? "",
		audienceType: meta?.optimization_goal ?? "",
		dailyBudget: budget(meta?.daily_budget, opts.currencyOffset),
		spend,
		impressions: num(insight.impressions),
		reach: num(insight.reach),
		linkClicks: num(insight.inline_link_clicks),
		linkCtr: pctToDecimal(insight.inline_link_click_ctr),
		leads,
		costPerLead: leads > 0 ? spend / leads : 0,
		cpm: num(insight.cpm),
		frequency: num(insight.frequency),
		reportStart: insight.date_start ?? "",
		reportEnd: insight.date_stop ?? "",
		isoWeek: isoWeekOf(insight),
	};
}

export function mapAdRow(
	insight: MetaInsightRow,
	meta: MetaAdMeta | undefined,
): AdRow {
	const spend = num(insight.spend);
	const leads = leadsFrom(insight);
	return {
		adId: insight.ad_id ?? meta?.id ?? "",
		adName: insight.ad_name ?? meta?.name ?? "",
		adSetId: insight.adset_id ?? meta?.adset_id ?? "",
		adSetName: insight.adset_name ?? "",
		campaignId: insight.campaign_id ?? meta?.campaign_id ?? "",
		campaignName: insight.campaign_name ?? "",
		status: meta?.effective_status ?? meta?.status ?? "",
		spend,
		impressions: num(insight.impressions),
		reach: num(insight.reach),
		linkClicks: num(insight.inline_link_clicks),
		linkCtr: pctToDecimal(insight.inline_link_click_ctr),
		leads,
		costPerLead: leads > 0 ? spend / leads : 0,
		cpm: num(insight.cpm),
		reportStart: insight.date_start ?? "",
		reportEnd: insight.date_stop ?? "",
		isoWeek: isoWeekOf(insight),
	};
}

/** id → meta 룩업 맵 생성 헬퍼. */
export function indexById<T extends { id: string }>(
	metas: T[],
): Map<string, T> {
	return new Map(metas.map((m) => [m.id, m]));
}
