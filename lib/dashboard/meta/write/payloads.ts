// 스펙 → Graph API 생성 payload 변환 (순수 함수, 토큰 없이 테스트됨).
// 중첩 객체/배열은 그대로 두고, 실제 POST 직전 writeClient 가 JSON 문자열화한다.
//
// 안전 규약: 모든 엔티티 status 는 "PAUSED" 로 하드코딩한다(스펙으로 override 불가).
// 사람이 Ads Manager 에서 검토 후 직접 ON 해야 광고비가 집행된다.

import type { AdSpec, CreativeSpec } from "./adspec";

export const PAUSED = "PAUSED" as const;
export const DEFAULT_BID_STRATEGY = "LOWEST_COST_WITHOUT_CAP" as const;

export type Payload = Record<string, unknown>;

export interface CreativeConfig {
	pageId: string;
	instagramActorId?: string;
}

// 업로드 완료된 자산 참조 (writeClient.uploadImage/uploadVideo 결과).
export type CreativeAsset =
	| { kind: "image"; imageHash: string }
	| { kind: "video"; videoId: string; thumbnailHash?: string }
	| { kind: "carousel"; cardImageHashes: string[] };

/** KRW(또는 통화 단위) 예산 → Meta 최소 단위 정수 문자열. KRW(offset=1)면 그대로. */
function toMinorUnit(amount: number, currencyOffset: number): string {
	return String(Math.round(amount * currencyOffset));
}

export function buildCampaignPayload(spec: AdSpec): Payload {
	return {
		name: spec.campaign.name,
		objective: spec.campaign.objective,
		special_ad_categories: spec.campaign.specialAdCategories,
		status: PAUSED,
	};
}

export function buildAdSetPayload(
	spec: AdSpec,
	campaignId: string,
	currencyOffset: number,
): Payload {
	const a = spec.adSet;
	const payload: Payload = {
		name: a.name,
		campaign_id: campaignId,
		billing_event: a.billingEvent,
		optimization_goal: a.optimizationGoal,
		bid_strategy: DEFAULT_BID_STRATEGY,
		targeting: buildTargeting(spec),
		status: PAUSED,
	};

	if (a.dailyBudgetKRW && a.dailyBudgetKRW > 0) {
		payload.daily_budget = toMinorUnit(a.dailyBudgetKRW, currencyOffset);
	}
	if (a.lifetimeBudgetKRW && a.lifetimeBudgetKRW > 0) {
		payload.lifetime_budget = toMinorUnit(a.lifetimeBudgetKRW, currencyOffset);
	}
	if (a.promotedObject) {
		const po: Payload = {};
		if (a.promotedObject.pixelId) po.pixel_id = a.promotedObject.pixelId;
		if (a.promotedObject.customEventType) {
			po.custom_event_type = a.promotedObject.customEventType;
		}
		if (a.promotedObject.pageId) po.page_id = a.promotedObject.pageId;
		payload.promoted_object = po;
	}
	if (a.startTime) payload.start_time = a.startTime;
	if (a.endTime) payload.end_time = a.endTime;

	return payload;
}

function buildTargeting(spec: AdSpec): Payload {
	const t = spec.adSet.targeting;
	const targeting: Payload = {
		geo_locations: { countries: t.geoCountries },
	};
	if (t.ageMin) targeting.age_min = t.ageMin;
	if (t.ageMax) targeting.age_max = t.ageMax;
	if (t.genders?.length) targeting.genders = t.genders;
	return targeting;
}

function callToAction(ad: CreativeSpec): Payload {
	return { type: ad.callToAction, value: { link: ad.link } };
}

export function buildCreativePayload(
	ad: CreativeSpec,
	cfg: CreativeConfig,
	asset: CreativeAsset,
): Payload {
	const objectStorySpec: Payload = { page_id: cfg.pageId };
	if (cfg.instagramActorId) {
		objectStorySpec.instagram_actor_id = cfg.instagramActorId;
	}

	if (asset.kind === "image") {
		objectStorySpec.link_data = {
			message: ad.message,
			link: ad.link,
			name: ad.headline,
			description: ad.description,
			image_hash: asset.imageHash,
			call_to_action: callToAction(ad),
		};
	} else if (asset.kind === "video") {
		const videoData: Payload = {
			message: ad.message,
			video_id: asset.videoId,
			title: ad.headline,
			link_description: ad.description,
			call_to_action: callToAction(ad),
		};
		if (asset.thumbnailHash) videoData.image_hash = asset.thumbnailHash;
		objectStorySpec.video_data = videoData;
	} else {
		// carousel: 카드별 image_hash 를 cards 순서대로 매핑
		const cards = ad.cards ?? [];
		objectStorySpec.link_data = {
			message: ad.message,
			link: ad.link,
			call_to_action: callToAction(ad),
			child_attachments: cards.map((card, i) => ({
				link: card.link,
				name: card.headline,
				description: card.description,
				image_hash: asset.cardImageHashes[i],
				call_to_action: { type: ad.callToAction, value: { link: card.link } },
			})),
		};
	}

	return {
		name: ad.name,
		object_story_spec: objectStorySpec,
	};
}

export function buildAdPayload(
	ad: CreativeSpec,
	adSetId: string,
	creativeId: string,
): Payload {
	return {
		name: ad.name,
		adset_id: adSetId,
		creative: { creative_id: creativeId },
		status: PAUSED,
	};
}
