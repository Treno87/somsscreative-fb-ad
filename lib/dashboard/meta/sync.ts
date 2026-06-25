// Meta API 동기화 오케스트레이션:
//   insights(3계층) + 엔티티 메타데이터를 가져와 WeekSnapshot 으로 변환한다.
// 라우트/스크립트/cron 이 공유한다.

import type { AdRow, AdSetRow, CampaignRow, WeekSnapshot } from "../types";
import { MetaClient, type FetchFn } from "./client";
import { type MetaConfig, loadMetaConfig } from "./config";
import {
	indexById,
	mapAdRow,
	mapAdSetRow,
	mapCampaignRow,
} from "./mappers";
import type { DateRange } from "./types";

export interface SyncOptions {
	range: DateRange;
	config?: MetaConfig; // 미지정 시 env 에서 로드
	fetchFn?: FetchFn; // 테스트 주입용
	uploadedAt?: string; // 미지정 시 호출 시각
}

export interface SyncResult {
	snapshots: WeekSnapshot[];
	totals: { campaigns: number; adSets: number; ads: number };
	range: DateRange;
}

/** YYYY-MM-DD 형식 검증 (Graph API time_range 안전성). */
function assertDate(label: string, value: string): void {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		throw new Error(`${label} 날짜 형식 오류: "${value}" (YYYY-MM-DD 필요)`);
	}
}

export async function syncFromMeta(opts: SyncOptions): Promise<SyncResult> {
	assertDate("since", opts.range.since);
	assertDate("until", opts.range.until);

	const config = opts.config ?? loadMetaConfig();
	const client = new MetaClient({ config, fetchFn: opts.fetchFn });
	const uploadedAt = opts.uploadedAt ?? new Date().toISOString();
	const mapOpts = { currencyOffset: config.currencyOffset };

	// insights 와 메타데이터를 병렬로 수집
	const [
		campaignInsights,
		adSetInsights,
		adInsights,
		campaignMeta,
		adSetMeta,
		adMeta,
	] = await Promise.all([
		client.getInsights("campaign", opts.range),
		client.getInsights("adset", opts.range),
		client.getInsights("ad", opts.range),
		client.getCampaignMeta(),
		client.getAdSetMeta(),
		client.getAdMeta(),
	]);

	const campaignMetaById = indexById(campaignMeta);
	const adSetMetaById = indexById(adSetMeta);
	const adMetaById = indexById(adMeta);

	const campaigns: CampaignRow[] = campaignInsights.map((i) =>
		mapCampaignRow(i, campaignMetaById.get(i.campaign_id ?? ""), mapOpts),
	);
	const adSets: AdSetRow[] = adSetInsights.map((i) =>
		mapAdSetRow(i, adSetMetaById.get(i.adset_id ?? ""), mapOpts),
	);
	const ads: AdRow[] = adInsights.map((i) =>
		mapAdRow(i, adMetaById.get(i.ad_id ?? "")),
	);

	// isoWeek 별로 묶어 WeekSnapshot 생성 (보통 단일 주차)
	const weeks = new Set<string>([
		...campaigns.map((r) => r.isoWeek),
		...adSets.map((r) => r.isoWeek),
		...ads.map((r) => r.isoWeek),
	]);
	weeks.delete("");

	const snapshots: WeekSnapshot[] = [...weeks].sort().map((isoWeek) => ({
		isoWeek,
		uploadedAt,
		campaigns: campaigns.filter((r) => r.isoWeek === isoWeek),
		adSets: adSets.filter((r) => r.isoWeek === isoWeek),
		ads: ads.filter((r) => r.isoWeek === isoWeek),
	}));

	return {
		snapshots,
		totals: {
			campaigns: campaigns.length,
			adSets: adSets.length,
			ads: ads.length,
		},
		range: opts.range,
	};
}
