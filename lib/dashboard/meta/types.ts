// Meta Graph API 응답 타입 (insights + 엔티티 메타데이터)
// 필요한 필드만 선언한다. 숫자 필드도 Graph API는 문자열로 반환하므로 string.

export interface MetaAction {
	action_type: string;
	value: string;
}

/** /insights 한 행 (level=campaign|adset|ad 공통, 일부 필드는 level별로만 존재) */
export interface MetaInsightRow {
	campaign_id?: string;
	campaign_name?: string;
	adset_id?: string;
	adset_name?: string;
	ad_id?: string;
	ad_name?: string;
	spend?: string;
	impressions?: string;
	reach?: string;
	clicks?: string;
	inline_link_clicks?: string;
	inline_link_click_ctr?: string; // 퍼센트 숫자 ("1.23" = 1.23%)
	cpm?: string;
	frequency?: string;
	actions?: MetaAction[];
	cost_per_action_type?: MetaAction[];
	date_start?: string; // YYYY-MM-DD
	date_stop?: string;
}

/** /campaigns 메타데이터 */
export interface MetaCampaignMeta {
	id: string;
	name?: string;
	objective?: string;
	status?: string;
	effective_status?: string;
	daily_budget?: string; // 통화 최소 단위
	lifetime_budget?: string;
}

/** /adsets 메타데이터 */
export interface MetaAdSetMeta {
	id: string;
	name?: string;
	campaign_id?: string;
	status?: string;
	effective_status?: string;
	daily_budget?: string;
	lifetime_budget?: string;
	optimization_goal?: string;
}

/** /ads 메타데이터 */
export interface MetaAdMeta {
	id: string;
	name?: string;
	adset_id?: string;
	campaign_id?: string;
	status?: string;
	effective_status?: string;
}

export interface MetaPaging {
	cursors?: { before?: string; after?: string };
	next?: string;
}

export interface MetaListResponse<T> {
	data: T[];
	paging?: MetaPaging;
}

export interface MetaErrorBody {
	error?: {
		message: string;
		type?: string;
		code?: number;
		error_subcode?: number;
		fbtrace_id?: string;
	};
}

export type InsightLevel = "campaign" | "adset" | "ad";

export interface DateRange {
	since: string; // YYYY-MM-DD
	until: string; // YYYY-MM-DD
}
