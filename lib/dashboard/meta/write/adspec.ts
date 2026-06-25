// 광고 쓰기(세팅) 스펙 — 캠페인 1개를 정의하는 구조화 입력.
// courses/{course}/campaigns/{기수}-adspec.ts 에 작성하고 scripts/meta-create.mjs 로 생성한다.
// validateSpec 은 순수 함수(파일 IO 선택 주입)라 토큰 없이 단위 테스트된다.

// ODAX 캠페인 목표 (현행 Meta).
export const OBJECTIVES = [
	"OUTCOME_LEADS",
	"OUTCOME_TRAFFIC",
	"OUTCOME_ENGAGEMENT",
	"OUTCOME_SALES",
	"OUTCOME_AWARENESS",
	"OUTCOME_APP_PROMOTION",
] as const;
export type Objective = (typeof OBJECTIVES)[number];

// 타겟 제한이 걸리는 특수 광고 카테고리. 채용/인턴 광고는 EMPLOYMENT 필수.
export const SPECIAL_AD_CATEGORIES = [
	"EMPLOYMENT",
	"HOUSING",
	"CREDIT",
	"ISSUES_ELECTIONS_POLITICS",
] as const;
export type SpecialAdCategory = (typeof SPECIAL_AD_CATEGORIES)[number];

export const BILLING_EVENTS = ["IMPRESSIONS", "LINK_CLICKS", "THRUPLAY"] as const;
export type BillingEvent = (typeof BILLING_EVENTS)[number];

// 자주 쓰는 최적화 목표만 (전체 목록 아님).
export const OPTIMIZATION_GOALS = [
	"OFFSITE_CONVERSIONS",
	"LEAD_GENERATION",
	"LINK_CLICKS",
	"LANDING_PAGE_VIEWS",
	"REACH",
	"IMPRESSIONS",
	"THRUPLAY",
] as const;
export type OptimizationGoal = (typeof OPTIMIZATION_GOALS)[number];

export const CALL_TO_ACTIONS = [
	"LEARN_MORE",
	"SIGN_UP",
	"SUBSCRIBE",
	"APPLY_NOW",
	"GET_OFFER",
	"CONTACT_US",
	"DOWNLOAD",
	"BOOK_TRAVEL",
	"SEND_MESSAGE",
] as const;
export type CallToAction = (typeof CALL_TO_ACTIONS)[number];

// EMPLOYMENT/HOUSING/CREDIT 는 연령 제한이 18~65 로 고정된다.
export const RESTRICTED_CATEGORIES: readonly SpecialAdCategory[] = [
	"EMPLOYMENT",
	"HOUSING",
	"CREDIT",
];

export interface PromotedObject {
	pixelId?: string; // OFFSITE_CONVERSIONS 시 필요
	customEventType?: string; // 예: "LEAD"
	pageId?: string; // LEAD_GENERATION(인스턴트폼) 시 필요
}

export interface Targeting {
	geoCountries: string[]; // 예: ["KR"]
	ageMin?: number;
	ageMax?: number;
	genders?: (1 | 2)[]; // 1=남, 2=여. 생략 시 전체
}

export interface CarouselCard {
	assetPath: string;
	headline: string;
	link: string;
	description?: string;
}

export interface CreativeSpec {
	name: string;
	type: "image" | "video" | "carousel";
	message: string; // 본문 카피
	link: string; // 랜딩 URL
	callToAction: CallToAction;
	headline?: string; // link_data.name
	description?: string;
	assetPath?: string; // image | video 일 때
	cards?: CarouselCard[]; // carousel 일 때 (2장 이상)
}

export interface CampaignSpec {
	name: string;
	objective: Objective;
	specialAdCategories: SpecialAdCategory[];
}

export interface AdSetSpec {
	name: string;
	dailyBudgetKRW?: number; // 일일/총액 중 정확히 하나
	lifetimeBudgetKRW?: number;
	optimizationGoal: OptimizationGoal;
	billingEvent: BillingEvent;
	promotedObject?: PromotedObject;
	targeting: Targeting;
	startTime?: string; // ISO8601 (예: 2026-06-26T00:00:00+09:00)
	endTime?: string;
}

export interface AdSpec {
	course: string;
	batch: string;
	campaign: CampaignSpec;
	adSet: AdSetSpec;
	ads: CreativeSpec[];
}

export interface ValidateOptions {
	// 자산 파일 존재 검사용. 미주입 시 자산 존재 검사를 건너뛴다(순수).
	fileExists?: (path: string) => boolean;
}

function isHttpUrl(value: string): boolean {
	return /^https?:\/\//.test(value);
}

/**
 * 스펙을 검증해 오류 메시지 배열을 반환한다(빈 배열 = 통과).
 * 구조 검증은 순수, 자산 존재 검사는 opts.fileExists 주입 시에만.
 */
export function validateSpec(spec: AdSpec, opts: ValidateOptions = {}): string[] {
	const errors: string[] = [];
	const { campaign, adSet, ads } = spec;

	// 캠페인
	if (!campaign?.name?.trim()) errors.push("campaign.name 누락");
	if (!OBJECTIVES.includes(campaign?.objective)) {
		errors.push(`campaign.objective 무효: ${campaign?.objective}`);
	}
	for (const c of campaign?.specialAdCategories ?? []) {
		if (!SPECIAL_AD_CATEGORIES.includes(c)) {
			errors.push(`campaign.specialAdCategories 무효 값: ${c}`);
		}
	}

	// 광고세트
	if (!adSet?.name?.trim()) errors.push("adSet.name 누락");
	const daily = adSet?.dailyBudgetKRW ?? 0;
	const lifetime = adSet?.lifetimeBudgetKRW ?? 0;
	if (daily > 0 && lifetime > 0) {
		errors.push("adSet 예산은 dailyBudgetKRW / lifetimeBudgetKRW 중 하나만");
	}
	if (daily <= 0 && lifetime <= 0) {
		errors.push("adSet 예산(dailyBudgetKRW 또는 lifetimeBudgetKRW) 필요");
	}
	if (!OPTIMIZATION_GOALS.includes(adSet?.optimizationGoal)) {
		errors.push(`adSet.optimizationGoal 무효: ${adSet?.optimizationGoal}`);
	}
	if (!BILLING_EVENTS.includes(adSet?.billingEvent)) {
		errors.push(`adSet.billingEvent 무효: ${adSet?.billingEvent}`);
	}
	if (!adSet?.targeting?.geoCountries?.length) {
		errors.push("adSet.targeting.geoCountries 필요 (예: [\"KR\"])");
	}

	// 목표↔최적화 정합성: 전환 최적화엔 픽셀 필요
	if (adSet?.optimizationGoal === "OFFSITE_CONVERSIONS" && !adSet?.promotedObject?.pixelId) {
		errors.push("OFFSITE_CONVERSIONS 최적화는 promotedObject.pixelId 필요");
	}
	if (adSet?.optimizationGoal === "LEAD_GENERATION" && !adSet?.promotedObject?.pageId) {
		errors.push("LEAD_GENERATION 최적화는 promotedObject.pageId(인스턴트폼) 필요");
	}

	// 특수 카테고리 타겟 제약 (연령 18~65 고정, 성별 제한 불가)
	const restricted = (campaign?.specialAdCategories ?? []).filter((c) =>
		RESTRICTED_CATEGORIES.includes(c),
	);
	if (restricted.length > 0) {
		const t = adSet?.targeting;
		if ((t?.ageMin && t.ageMin !== 18) || (t?.ageMax && t.ageMax !== 65)) {
			errors.push(
				`특수 카테고리(${restricted.join(",")})는 연령 18~65 고정 — ageMin/ageMax 제한 불가`,
			);
		}
		if (t?.genders?.length) {
			errors.push(
				`특수 카테고리(${restricted.join(",")})는 성별 타겟 제한 불가`,
			);
		}
	}

	// 광고/크리에이티브
	if (!ads?.length) errors.push("ads 가 비어 있음 (최소 1개)");
	ads?.forEach((ad, i) => {
		const tag = `ads[${i}]`;
		if (!ad.name?.trim()) errors.push(`${tag}.name 누락`);
		if (!ad.message?.trim()) errors.push(`${tag}.message 누락`);
		if (!CALL_TO_ACTIONS.includes(ad.callToAction)) {
			errors.push(`${tag}.callToAction 무효: ${ad.callToAction}`);
		}
		if (ad.type === "carousel") {
			if (!ad.cards || ad.cards.length < 2) {
				errors.push(`${tag} carousel 은 카드 2장 이상 필요`);
			}
			ad.cards?.forEach((card, j) => {
				if (!card.assetPath) errors.push(`${tag}.cards[${j}].assetPath 누락`);
				if (!isHttpUrl(card.link ?? "")) {
					errors.push(`${tag}.cards[${j}].link 은 http(s) URL 필요`);
				}
				if (opts.fileExists && card.assetPath && !opts.fileExists(card.assetPath)) {
					errors.push(`${tag}.cards[${j}] 자산 없음: ${card.assetPath}`);
				}
			});
		} else {
			if (!isHttpUrl(ad.link ?? "")) {
				errors.push(`${tag}.link 은 http(s) URL 필요`);
			}
			if (!ad.assetPath) errors.push(`${tag}.assetPath 누락 (${ad.type})`);
			if (opts.fileExists && ad.assetPath && !opts.fileExists(ad.assetPath)) {
				errors.push(`${tag} 자산 없음: ${ad.assetPath}`);
			}
		}
	});

	return errors;
}
