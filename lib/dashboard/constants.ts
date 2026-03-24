// Fatigue detection thresholds (CTR drop ratio)
export const FATIGUE_WARNING_THRESHOLD = 0.2;
export const FATIGUE_CRITICAL_THRESHOLD = 0.3;

// CPL change thresholds (increase ratio)
export const CPL_WARNING_THRESHOLD = 0.2;
export const CPL_CRITICAL_THRESHOLD = 0.4;

// A/B test: minimum delta to declare a winner
export const AB_WINNER_MIN_DELTA = 0.1;

// Budget underspend threshold (spend/budget ratio)
export const BUDGET_UNDERSPEND_THRESHOLD = 0.3;

// Minimum impressions required for fatigue analysis
export const MIN_IMPRESSIONS_FOR_FATIGUE = 500;

// localStorage key and version
export const STORAGE_KEY = "somss_dashboard_v3";
export const STORAGE_VERSION = 3 as const;

// A/B variant suffix patterns (lowercased)
export const AB_SUFFIX_PATTERNS = ["_landing", "_b", "_test", "_v2"];

// Required column groups per file type.
// Each inner array is an OR group — at least one column from the group must be present.
export const CAMPAIGN_REQUIRED_COLUMNS: string[][] = [
	["캠페인 이름"],
	["지출 금액", "지출 금액 (KRW)"],
	["노출"],
	["링크 클릭"],
	["리드", "잠재 고객", "결과"],
	["보고 시작"],
	["보고 종료"],
];

export const ADSET_REQUIRED_COLUMNS: string[][] = [
	["광고 세트 이름"],
	["캠페인 이름"],
	["지출 금액", "지출 금액 (KRW)"],
	["노출"],
	["링크 클릭"],
	["리드", "잠재 고객", "결과"],
	["보고 시작"],
	["보고 종료"],
];

export const AD_REQUIRED_COLUMNS: string[][] = [
	["광고 이름"],
	["광고 세트 이름"],
	["캠페인 이름"],
	["지출 금액", "지출 금액 (KRW)"],
	["노출"],
	["링크 클릭"],
	["리드", "잠재 고객", "결과"],
	["보고 시작"],
	["보고 종료"],
];

// Facebook Ads Manager CSV column name → field name mappings
// Multiple keys can map to the same field (aliases). normaliseRow skips empty values
// so only the column present in the file will set the field.
//
// ※ 실제 FB 광고 관리자 한국어 내보내기 기준 컬럼명 (2026년 확인)
export const CAMPAIGN_COLUMN_MAP: Record<string, string> = {
	"캠페인 ID": "campaignId",
	"캠페인 이름": "campaignName",
	// status
	게재: "status",
	"캠페인 게재": "status",
	// objective
	"캠페인 목표": "objective",
	목표: "objective",
	// budget
	"일일 예산": "dailyBudget",
	"총 예산": "totalBudget",
	"광고 세트 예산": "dailyBudget",
	"예산 유형": "budgetType",
	"광고 세트 예산 유형": "budgetType",
	// spend
	"지출 금액": "spend",
	"지출 금액 (KRW)": "spend",
	// reach & impressions
	노출: "impressions",
	도달: "reach",
	// clicks
	"링크 클릭": "linkClicks",
	// CTR — 실제: CTR(링크 클릭률)
	"CTR(링크 클릭률)": "linkCtr",
	"링크 클릭률(CTR)": "linkCtr",
	"링크 클릭률 (CTR)": "linkCtr",
	"CTR (링크)": "linkCtr",
	// leads
	리드: "leads",
	"잠재 고객": "leads",
	결과: "leads",
	"리드당 비용": "costPerLead",
	"결과당 비용": "costPerLead",
	// CPM — 실제: CPM(1,000회 노출당 비용) (KRW)
	"CPM(1,000회 노출당 비용) (KRW)": "cpm",
	"1,000회 노출당 비용(CPM)": "cpm",
	"1000회 노출당 비용(CPM)": "cpm",
	CPM: "cpm",
	// frequency — 실제: 빈도
	빈도: "frequency",
	게재빈도: "frequency",
	"게재 빈도": "frequency",
	// video
	"동영상 재생": "videoViews",
	// landing page views — 실제 FB 컬럼명 후보
	"랜딩 페이지 조회": "landingPageViews",
	"랜딩페이지 조회": "landingPageViews",
	"방문 페이지 조회": "landingPageViews",
	"방문 페이지 뷰": "landingPageViews",
	// dates
	"보고 시작": "reportStart",
	"보고 종료": "reportEnd",
};

export const ADSET_COLUMN_MAP: Record<string, string> = {
	"광고 세트 ID": "adSetId",
	"광고 세트 이름": "adSetName",
	"캠페인 ID": "campaignId",
	"캠페인 이름": "campaignName",
	// status
	게재: "status",
	"광고 세트 게재": "status",
	// objective
	"성과 목표": "objective",
	"캠페인 목표": "objective",
	// budget
	"일일 예산": "dailyBudget",
	"광고 세트 예산": "dailyBudget",
	"오디언스 유형": "audienceType",
	"광고 세트 예산 유형": "budgetType",
	// spend
	"지출 금액": "spend",
	"지출 금액 (KRW)": "spend",
	// reach & impressions
	노출: "impressions",
	도달: "reach",
	// clicks
	"링크 클릭": "linkClicks",
	// CTR
	"CTR(링크 클릭률)": "linkCtr",
	"링크 클릭률(CTR)": "linkCtr",
	"링크 클릭률 (CTR)": "linkCtr",
	"CTR (링크)": "linkCtr",
	// leads
	리드: "leads",
	"잠재 고객": "leads",
	결과: "leads",
	"리드당 비용": "costPerLead",
	"결과당 비용": "costPerLead",
	// CPM
	"CPM(1,000회 노출당 비용) (KRW)": "cpm",
	"1,000회 노출당 비용(CPM)": "cpm",
	"1000회 노출당 비용(CPM)": "cpm",
	CPM: "cpm",
	// frequency
	빈도: "frequency",
	게재빈도: "frequency",
	"게재 빈도": "frequency",
	// dates
	"보고 시작": "reportStart",
	"보고 종료": "reportEnd",
};

export const AD_COLUMN_MAP: Record<string, string> = {
	"광고 ID": "adId",
	"광고 이름": "adName",
	"광고 세트 ID": "adSetId",
	"광고 세트 이름": "adSetName",
	"캠페인 ID": "campaignId",
	"캠페인 이름": "campaignName",
	// status
	게재: "status",
	"광고 게재": "status",
	"광고 세트 게재": "status",
	// spend
	"지출 금액": "spend",
	"지출 금액 (KRW)": "spend",
	// reach & impressions
	노출: "impressions",
	도달: "reach",
	// clicks
	"링크 클릭": "linkClicks",
	// CTR
	"CTR(링크 클릭률)": "linkCtr",
	"링크 클릭률(CTR)": "linkCtr",
	"링크 클릭률 (CTR)": "linkCtr",
	"CTR (링크)": "linkCtr",
	// leads
	리드: "leads",
	"잠재 고객": "leads",
	결과: "leads",
	"리드당 비용": "costPerLead",
	"결과당 비용": "costPerLead",
	// CPM
	"CPM(1,000회 노출당 비용) (KRW)": "cpm",
	"1,000회 노출당 비용(CPM)": "cpm",
	"1000회 노출당 비용(CPM)": "cpm",
	CPM: "cpm",
	// frequency
	빈도: "frequency",
	게재빈도: "frequency",
	// dates
	"보고 시작": "reportStart",
	"보고 종료": "reportEnd",
};
