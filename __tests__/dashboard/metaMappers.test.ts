import {
	indexById,
	mapAdRow,
	mapAdSetRow,
	mapCampaignRow,
	pctToDecimal,
	sumActions,
} from "@/lib/dashboard/meta/mappers";
import { lastNDays, previousIsoWeek } from "@/lib/dashboard/meta/dateRange";
import type {
	MetaAdMeta,
	MetaAdSetMeta,
	MetaCampaignMeta,
	MetaInsightRow,
} from "@/lib/dashboard/meta/types";

const OFFSET = { currencyOffset: 1 };

describe("pctToDecimal", () => {
	it("퍼센트 숫자를 소수로 변환한다 (CSV 규약과 동일)", () => {
		expect(pctToDecimal("3.94")).toBeCloseTo(0.0394, 6);
		expect(pctToDecimal("100")).toBeCloseTo(1, 6);
	});
	it("빈 값/비숫자는 0", () => {
		expect(pctToDecimal(undefined)).toBe(0);
		expect(pctToDecimal("")).toBe(0);
		expect(pctToDecimal("abc")).toBe(0);
	});
});

describe("sumActions", () => {
	const actions = [
		{ action_type: "lead", value: "12" },
		{ action_type: "landing_page_view", value: "340" },
		{ action_type: "video_view", value: "999" },
	];
	it("우선순위 순으로 첫 매칭 type 값을 반환", () => {
		expect(sumActions(actions, ["lead", "leadgen_grouped"])).toBe(12);
		expect(sumActions(actions, ["landing_page_view"])).toBe(340);
	});
	it("매칭 없으면 0", () => {
		expect(sumActions(actions, ["purchase"])).toBe(0);
		expect(sumActions(undefined, ["lead"])).toBe(0);
	});
	it("폴백 type 순서를 존중", () => {
		// 'lead' 없고 두 번째 후보만 존재
		const onsite = [{ action_type: "onsite_conversion.lead_grouped", value: "5" }];
		expect(
			sumActions(onsite, ["lead", "onsite_conversion.lead_grouped"]),
		).toBe(5);
	});
});

describe("mapCampaignRow", () => {
	const insight: MetaInsightRow = {
		campaign_id: "c1",
		campaign_name: "퍼소나 디자인 1기",
		spend: "150000",
		impressions: "20000",
		reach: "15000",
		inline_link_clicks: "300",
		inline_link_click_ctr: "1.5",
		cpm: "7500",
		frequency: "1.33",
		actions: [
			{ action_type: "lead", value: "30" },
			{ action_type: "landing_page_view", value: "250" },
			{ action_type: "video_view", value: "1200" },
		],
		date_start: "2026-05-26",
		date_stop: "2026-06-01",
	};
	const meta: MetaCampaignMeta = {
		id: "c1",
		name: "퍼소나 디자인 1기",
		objective: "OUTCOME_LEADS",
		effective_status: "ACTIVE",
		daily_budget: "50000",
	};

	it("insight + meta 를 CampaignRow 로 매핑", () => {
		const row = mapCampaignRow(insight, meta, OFFSET);
		expect(row.campaignId).toBe("c1");
		expect(row.spend).toBe(150000);
		expect(row.leads).toBe(30);
		expect(row.costPerLead).toBe(5000); // 150000 / 30
		expect(row.linkCtr).toBeCloseTo(0.015, 6); // 1.5% → 0.015
		expect(row.landingPageViews).toBe(250);
		expect(row.videoViews).toBe(1200);
		expect(row.objective).toBe("OUTCOME_LEADS");
		expect(row.status).toBe("ACTIVE");
		expect(row.dailyBudget).toBe(50000);
		expect(row.budgetType).toBe("일일");
		expect(row.isoWeek).toBe("2026-W22"); // 2026-05-26 주차
	});

	it("리드 0 이면 costPerLead 0 (0 나눗셈 방지)", () => {
		const row = mapCampaignRow(
			{ ...insight, actions: [] },
			meta,
			OFFSET,
		);
		expect(row.leads).toBe(0);
		expect(row.costPerLead).toBe(0);
	});

	it("meta 없어도 insight 만으로 매핑", () => {
		const row = mapCampaignRow(insight, undefined, OFFSET);
		expect(row.campaignName).toBe("퍼소나 디자인 1기");
		expect(row.dailyBudget).toBe(0);
		expect(row.objective).toBe("");
	});

	it("통화 offset 100 이면 예산을 100으로 나눔(USD 등)", () => {
		const row = mapCampaignRow(insight, meta, { currencyOffset: 100 });
		expect(row.dailyBudget).toBe(500); // 50000 / 100
	});
});

describe("mapAdSetRow / mapAdRow", () => {
	it("adset 매핑", () => {
		const insight: MetaInsightRow = {
			adset_id: "as1",
			adset_name: "관심사 A",
			campaign_id: "c1",
			spend: "40000",
			inline_link_clicks: "80",
			inline_link_click_ctr: "2.0",
			actions: [{ action_type: "lead", value: "8" }],
			date_start: "2026-05-26",
			date_stop: "2026-06-01",
		};
		const meta: MetaAdSetMeta = {
			id: "as1",
			campaign_id: "c1",
			effective_status: "ACTIVE",
			daily_budget: "20000",
			optimization_goal: "LEAD_GENERATION",
		};
		const row = mapAdSetRow(insight, meta, OFFSET);
		expect(row.adSetId).toBe("as1");
		expect(row.costPerLead).toBe(5000);
		expect(row.audienceType).toBe("LEAD_GENERATION");
		expect(row.dailyBudget).toBe(20000);
	});

	it("ad 매핑", () => {
		const insight: MetaInsightRow = {
			ad_id: "ad1",
			ad_name: "단일 이미지 A",
			adset_id: "as1",
			campaign_id: "c1",
			spend: "10000",
			inline_link_clicks: "20",
			inline_link_click_ctr: "1.0",
			actions: [{ action_type: "lead", value: "2" }],
			date_start: "2026-05-26",
			date_stop: "2026-06-01",
		};
		const meta: MetaAdMeta = {
			id: "ad1",
			adset_id: "as1",
			campaign_id: "c1",
			effective_status: "PAUSED",
		};
		const row = mapAdRow(insight, meta);
		expect(row.adId).toBe("ad1");
		expect(row.status).toBe("PAUSED");
		expect(row.costPerLead).toBe(5000);
		expect(row.linkCtr).toBeCloseTo(0.01, 6);
	});
});

describe("indexById", () => {
	it("id 키 맵 생성", () => {
		const map = indexById([{ id: "a" }, { id: "b" }]);
		expect(map.get("a")).toEqual({ id: "a" });
		expect(map.size).toBe(2);
	});
});

describe("dateRange", () => {
	it("lastNDays 는 오늘 포함 N일 범위", () => {
		const now = new Date("2026-06-23T10:00:00Z");
		expect(lastNDays(7, now)).toEqual({
			since: "2026-06-17",
			until: "2026-06-23",
		});
	});

	it("previousIsoWeek 는 직전 월~일", () => {
		// 2026-06-23 은 화요일 → 직전 주 2026-06-15(월)~06-21(일)
		const now = new Date("2026-06-23T10:00:00Z");
		expect(previousIsoWeek(now)).toEqual({
			since: "2026-06-15",
			until: "2026-06-21",
		});
	});
});
