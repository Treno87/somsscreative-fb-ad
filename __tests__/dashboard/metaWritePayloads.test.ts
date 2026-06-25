import {
	buildAdPayload,
	buildAdSetPayload,
	buildCampaignPayload,
	buildCreativePayload,
	PAUSED,
} from "@/lib/dashboard/meta/write/payloads";
import { type AdSpec, validateSpec } from "@/lib/dashboard/meta/write/adspec";

function baseSpec(overrides: Partial<AdSpec> = {}): AdSpec {
	return {
		course: "persona-design",
		batch: "1기",
		campaign: {
			name: "테스트캠페인",
			objective: "OUTCOME_LEADS",
			specialAdCategories: [],
		},
		adSet: {
			name: "광고세트A",
			dailyBudgetKRW: 30000,
			optimizationGoal: "OFFSITE_CONVERSIONS",
			billingEvent: "IMPRESSIONS",
			promotedObject: { pixelId: "PX1", customEventType: "LEAD" },
			targeting: { geoCountries: ["KR"], ageMin: 20, ageMax: 45 },
		},
		ads: [
			{
				name: "광고A",
				type: "image",
				assetPath: "public/ads/x/1.jpg",
				message: "본문",
				headline: "헤드라인",
				description: "설명",
				link: "https://example.com/landing",
				callToAction: "LEARN_MORE",
			},
		],
		...overrides,
	};
}

describe("validateSpec", () => {
	it("정상 스펙은 오류 없음", () => {
		expect(validateSpec(baseSpec())).toEqual([]);
	});

	it("예산 둘 다 지정 시 오류", () => {
		const spec = baseSpec();
		spec.adSet.lifetimeBudgetKRW = 50000;
		expect(validateSpec(spec).some((e) => e.includes("예산"))).toBe(true);
	});

	it("OFFSITE_CONVERSIONS 인데 pixelId 없으면 오류", () => {
		const spec = baseSpec();
		spec.adSet.promotedObject = {};
		expect(validateSpec(spec).some((e) => e.includes("pixelId"))).toBe(true);
	});

	it("EMPLOYMENT 카테고리는 연령 제한 시 오류", () => {
		const spec = baseSpec();
		spec.campaign.specialAdCategories = ["EMPLOYMENT"];
		// ageMin 20 → 18 고정 위반
		expect(validateSpec(spec).some((e) => e.includes("연령"))).toBe(true);
	});

	it("자산 파일 없으면 fileExists 주입 시 오류", () => {
		const errors = validateSpec(baseSpec(), { fileExists: () => false });
		expect(errors.some((e) => e.includes("자산 없음"))).toBe(true);
	});

	it("carousel 카드 1장이면 오류", () => {
		const spec = baseSpec();
		spec.ads = [
			{
				name: "캐러셀",
				type: "carousel",
				message: "본문",
				link: "https://example.com",
				callToAction: "LEARN_MORE",
				cards: [{ assetPath: "a.jpg", headline: "1", link: "https://example.com" }],
			},
		];
		expect(validateSpec(spec).some((e) => e.includes("카드 2장"))).toBe(true);
	});
});

describe("payload 빌더", () => {
	it("캠페인 payload 는 PAUSED · special_ad_categories 포함", () => {
		const p = buildCampaignPayload(baseSpec());
		expect(p).toMatchObject({
			name: "테스트캠페인",
			objective: "OUTCOME_LEADS",
			special_ad_categories: [],
			status: PAUSED,
		});
	});

	it("광고세트 payload — 예산 최소단위·promoted_object·targeting·PAUSED", () => {
		const p = buildAdSetPayload(baseSpec(), "C1", 1);
		expect(p.campaign_id).toBe("C1");
		expect(p.daily_budget).toBe("30000"); // KRW offset=1 그대로, 문자열
		expect(p.status).toBe(PAUSED);
		expect(p.promoted_object).toEqual({ pixel_id: "PX1", custom_event_type: "LEAD" });
		expect(p.targeting).toEqual({
			geo_locations: { countries: ["KR"] },
			age_min: 20,
			age_max: 45,
		});
	});

	it("통화 offset 100 이면 예산 *100", () => {
		const p = buildAdSetPayload(baseSpec(), "C1", 100);
		expect(p.daily_budget).toBe("3000000");
	});

	it("이미지 크리에이티브 — object_story_spec.link_data.image_hash·CTA", () => {
		const ad = baseSpec().ads[0];
		const p = buildCreativePayload(ad, { pageId: "PAGE1" }, {
			kind: "image",
			imageHash: "HASH1",
		});
		const oss = p.object_story_spec as Record<string, unknown>;
		expect(oss.page_id).toBe("PAGE1");
		const linkData = oss.link_data as Record<string, unknown>;
		expect(linkData.image_hash).toBe("HASH1");
		expect(linkData.link).toBe("https://example.com/landing");
		expect(linkData.call_to_action).toEqual({
			type: "LEARN_MORE",
			value: { link: "https://example.com/landing" },
		});
	});

	it("캐러셀 크리에이티브 — child_attachments 가 카드 hash 순서대로", () => {
		const ad = {
			name: "캐러셀",
			type: "carousel" as const,
			message: "본문",
			link: "https://example.com",
			callToAction: "LEARN_MORE" as const,
			cards: [
				{ assetPath: "a.jpg", headline: "카드1", link: "https://example.com/1" },
				{ assetPath: "b.jpg", headline: "카드2", link: "https://example.com/2" },
			],
		};
		const p = buildCreativePayload(ad, { pageId: "PAGE1" }, {
			kind: "carousel",
			cardImageHashes: ["H1", "H2"],
		});
		const oss = p.object_story_spec as Record<string, unknown>;
		const linkData = oss.link_data as Record<string, unknown>;
		const children = linkData.child_attachments as Record<string, unknown>[];
		expect(children).toHaveLength(2);
		expect(children[0].image_hash).toBe("H1");
		expect(children[1].image_hash).toBe("H2");
		expect(children[1].link).toBe("https://example.com/2");
	});

	it("광고 payload — adset/creative 연결·PAUSED", () => {
		const p = buildAdPayload(baseSpec().ads[0], "AS1", "CR1");
		expect(p).toMatchObject({
			adset_id: "AS1",
			creative: { creative_id: "CR1" },
			status: PAUSED,
		});
	});
});
