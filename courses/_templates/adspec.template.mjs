// 광고 생성 스펙 템플릿 — courses/{course}/campaigns/{기수}-adspec.mjs 로 복사해 채운다.
// node 가 바로 import 하는 .mjs(평범한 객체). 타입 힌트는 아래 JSDoc 으로 제공된다.
// 생성: node scripts/meta-create.mjs --spec=<이 파일 경로> --phase=plan
//
// 단위 규약: 예산은 원(KRW) 단위 정수. 모든 생성물은 PAUSED — Ads Manager 에서 수동 ON.

/** @type {import("../../lib/dashboard/meta/write/adspec").AdSpec} */
export const spec = {
	course: "persona-design",
	batch: "1기",

	campaign: {
		name: "페르소나디자인_모집_20260625",
		objective: "OUTCOME_LEADS", // OUTCOME_TRAFFIC | OUTCOME_ENGAGEMENT | …
		// 채용·인턴 광고는 ["EMPLOYMENT"] 필수(연령 18~65 고정·성별 제한 불가).
		specialAdCategories: [],
	},

	adSet: {
		name: "광고세트A_관심사",
		dailyBudgetKRW: 30000, // 또는 lifetimeBudgetKRW (둘 중 하나)
		optimizationGoal: "OFFSITE_CONVERSIONS",
		billingEvent: "IMPRESSIONS",
		// OFFSITE_CONVERSIONS → pixelId 필요 / LEAD_GENERATION(인스턴트폼) → pageId 필요
		promotedObject: { pixelId: "1202595611941111", customEventType: "LEAD" },
		targeting: { geoCountries: ["KR"], ageMin: 20, ageMax: 45 },
		// startTime: "2026-06-26T00:00:00+09:00",
	},

	ads: [
		{
			name: "단일이미지_A",
			type: "image", // image | video | carousel
			assetPath: "public/ads/persona-design/1기/v01/image/main.jpg",
			message: "본문 카피 — 후킹 문장",
			headline: "헤드라인",
			description: "보조 설명",
			link: "https://소옴-랜딩-URL",
			callToAction: "LEARN_MORE", // SIGN_UP | APPLY_NOW | …
		},
		// 캐러셀 예시:
		// {
		//   name: "캐러셀_B", type: "carousel",
		//   message: "본문", link: "https://…", callToAction: "LEARN_MORE",
		//   cards: [
		//     { assetPath: "public/ads/.../carousel/1.jpg", headline: "카드1", link: "https://…" },
		//     { assetPath: "public/ads/.../carousel/2.jpg", headline: "카드2", link: "https://…" },
		//   ],
		// },
	],
};
