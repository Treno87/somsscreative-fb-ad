// Meta Graph API 저수준 클라이언트.
// fetch 를 주입 가능하게 만들어 단위 테스트(목 응답)가 가능하다.

import type { MetaConfig } from "./config";
import type {
	DateRange,
	InsightLevel,
	MetaAdMeta,
	MetaAdSetMeta,
	MetaCampaignMeta,
	MetaErrorBody,
	MetaInsightRow,
	MetaListResponse,
} from "./types";

const GRAPH_BASE = "https://graph.facebook.com";
const PAGE_LIMIT = 500;

export class MetaApiError extends Error {
	status: number;
	fbtraceId?: string;
	constructor(message: string, status: number, fbtraceId?: string) {
		super(message);
		this.name = "MetaApiError";
		this.status = status;
		this.fbtraceId = fbtraceId;
	}
}

export type FetchFn = typeof fetch;

export interface ClientOptions {
	config: MetaConfig;
	fetchFn?: FetchFn;
}

const INSIGHT_FIELDS = [
	"campaign_id",
	"campaign_name",
	"adset_id",
	"adset_name",
	"ad_id",
	"ad_name",
	"spend",
	"impressions",
	"reach",
	"clicks",
	"inline_link_clicks",
	"inline_link_click_ctr",
	"cpm",
	"frequency",
	"actions",
	"cost_per_action_type",
	"date_start",
	"date_stop",
].join(",");

function buildUrl(
	base: string,
	apiVersion: string,
	pathSeg: string,
	params: Record<string, string>,
): string {
	const url = new URL(`${base}/${apiVersion}/${pathSeg}`);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	return url.toString();
}

/** 한 페이지를 가져온다. Graph API 에러를 MetaApiError 로 변환. */
async function fetchPage<T>(
	url: string,
	fetchFn: FetchFn,
): Promise<MetaListResponse<T>> {
	const res = await fetchFn(url);
	const json = (await res.json()) as MetaListResponse<T> & MetaErrorBody;
	if (!res.ok || json.error) {
		const err = json.error;
		throw new MetaApiError(
			err?.message ?? `Graph API 오류 (HTTP ${res.status})`,
			res.status,
			err?.fbtrace_id,
		);
	}
	return json;
}

/** paging.next 를 따라가며 모든 페이지를 수집한다. */
async function fetchAll<T>(
	firstUrl: string,
	fetchFn: FetchFn,
): Promise<T[]> {
	const out: T[] = [];
	let next: string | undefined = firstUrl;
	// 안전 상한: 무한 루프 방지 (500 * 50 = 25,000행)
	let guard = 0;
	while (next && guard < 50) {
		const page: MetaListResponse<T> = await fetchPage<T>(next, fetchFn);
		out.push(...page.data);
		next = page.paging?.next;
		guard += 1;
	}
	return out;
}

export class MetaClient {
	private config: MetaConfig;
	private fetchFn: FetchFn;

	constructor({ config, fetchFn }: ClientOptions) {
		this.config = config;
		this.fetchFn = fetchFn ?? fetch;
	}

	async getInsights(
		level: InsightLevel,
		range: DateRange,
	): Promise<MetaInsightRow[]> {
		const url = buildUrl(
			GRAPH_BASE,
			this.config.apiVersion,
			`${this.config.accountId}/insights`,
			{
				level,
				fields: INSIGHT_FIELDS,
				time_range: JSON.stringify({
					since: range.since,
					until: range.until,
				}),
				limit: String(PAGE_LIMIT),
				access_token: this.config.accessToken,
			},
		);
		return fetchAll<MetaInsightRow>(url, this.fetchFn);
	}

	async getCampaignMeta(): Promise<MetaCampaignMeta[]> {
		const url = buildUrl(
			GRAPH_BASE,
			this.config.apiVersion,
			`${this.config.accountId}/campaigns`,
			{
				fields:
					"id,name,objective,status,effective_status,daily_budget,lifetime_budget",
				limit: String(PAGE_LIMIT),
				access_token: this.config.accessToken,
			},
		);
		return fetchAll<MetaCampaignMeta>(url, this.fetchFn);
	}

	async getAdSetMeta(): Promise<MetaAdSetMeta[]> {
		const url = buildUrl(
			GRAPH_BASE,
			this.config.apiVersion,
			`${this.config.accountId}/adsets`,
			{
				fields:
					"id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,optimization_goal",
				limit: String(PAGE_LIMIT),
				access_token: this.config.accessToken,
			},
		);
		return fetchAll<MetaAdSetMeta>(url, this.fetchFn);
	}

	async getAdMeta(): Promise<MetaAdMeta[]> {
		const url = buildUrl(
			GRAPH_BASE,
			this.config.apiVersion,
			`${this.config.accountId}/ads`,
			{
				fields: "id,name,adset_id,campaign_id,status,effective_status",
				limit: String(PAGE_LIMIT),
				access_token: this.config.accessToken,
			},
		);
		return fetchAll<MetaAdMeta>(url, this.fetchFn);
	}
}
