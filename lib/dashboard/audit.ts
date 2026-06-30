// 결정론적 AI 진단 보고서 빌더.
//
// 핵심: 대시보드 표가 쓰는 것과 "같은" WeekSnapshot 데이터에서 AuditReport 를 직접 계산한다.
// 동기화(/api/meta/sync·cron)가 이 함수를 호출해 report.json 을 재생성하므로
// 표와 AI 진단이 항상 같은 데이터·같은 기간을 가리킨다 — 박제(stale)가 구조적으로 불가능.
//
// 순수 함수(부수효과 없음)라 목 데이터로 단위 테스트된다. (__tests__/dashboard/audit.test.ts)

import {
	computeKpiSummary,
	computeWeekDelta,
	detectAbPairs,
	detectCreativeFatigue,
} from "./analytics";
import {
	CPL_CRITICAL_THRESHOLD,
	CPL_WARNING_THRESHOLD,
	MIN_IMPRESSIONS_FOR_FATIGUE,
} from "./constants";
import type {
	AuditAbConclusion,
	AuditCategoryScore,
	AuditFinding,
	AuditGrade,
	AuditKillItem,
	AuditQuickWin,
	AuditReport,
	AuditScalingItem,
	AuditTopCreative,
	CampaignRow,
	WeekSnapshot,
} from "./types";

// 목표 CPL(허용 상한). 절대 기준 — 이 사업에서 "리드당 이 금액이면 위험"의 기준선.
// 동기화 경로는 기본값을 쓰고, 테스트/향후 설정은 buildAuditReport 인자로 주입한다.
export const DEFAULT_TARGET_CPL = 20000;

// 비효율 판정 임계치
const CPL_OUTLIER_MULTIPLE = 2; // 평균/목표 2배 초과 → 비효율(킬 후보)
const CPL_SCALE_MULTIPLE = 0.6; // 목표 0.6배 미만 → 효율(확장 후보)
const CPL_SOFT_THRESHOLD = 0.1; // 전주 대비 10%↑ → 약경고(20% 미만 구간)
const FREQUENCY_WARNING = 3; // 빈도 3회 이상 → 피로 경고
const HEALTH_TARGET_PENALTY_CAP = 35; // 목표 초과로 인한 종합점수 최대 감점

const ACTIVE_STATUSES = new Set(["active", "게재 중", "활성"]);

function round(n: number): number {
	return Math.round(n);
}

function campaignCpl(c: CampaignRow): number | null {
	return c.leads > 0 ? c.spend / c.leads : null;
}

function isActive(status: string): boolean {
	return ACTIVE_STATUSES.has(status.trim().toLowerCase()) || status === "";
}

function categoryLabel(score: number): string {
	if (score >= 70) return "양호";
	if (score >= 40) return "주의";
	return "위험";
}

// 카테고리 점수: 100 에서 발견사항 심각도만큼 차감, [20,100] 클램프.
function scoreFromFindings(findings: AuditFinding[]): AuditCategoryScore {
	let score = 100;
	for (const f of findings) {
		if (f.level === "critical") score -= 20;
		else if (f.level === "warning") score -= 8;
	}
	score = Math.max(20, Math.min(100, score));
	return { score, label: categoryLabel(score) };
}

function gradeFromScore(score: number): AuditGrade {
	if (score >= 85) return "A";
	if (score >= 75) return "B";
	if (score >= 60) return "C";
	if (score >= 45) return "D";
	return "F";
}

function periodLabel(snapshot: WeekSnapshot): string {
	const starts = snapshot.campaigns
		.map((c) => c.reportStart)
		.filter(Boolean)
		.sort();
	const ends = snapshot.campaigns
		.map((c) => c.reportEnd)
		.filter(Boolean)
		.sort();
	const start = starts[0];
	const end = ends[ends.length - 1];
	if (start && end) return `${start} ~ ${end} (${snapshot.isoWeek})`;
	return snapshot.isoWeek;
}

/**
 * WeekSnapshot 에서 AuditReport 를 결정론적으로 생성한다.
 * @param snapshot   진단 대상 주차
 * @param previous   직전 주차(델타·피로도 계산용, 없으면 null)
 * @param now        generatedAt 타임스탬프(테스트 주입용, 기본 현재시각)
 * @param targetCpl  목표 CPL(허용 상한). 절대 기준 감점에 사용.
 */
export function buildAuditReport(
	snapshot: WeekSnapshot,
	previous: WeekSnapshot | null = null,
	now: Date = new Date(),
	targetCpl: number = DEFAULT_TARGET_CPL,
): AuditReport {
	const campaigns = snapshot.campaigns;
	const kpi = computeKpiSummary(campaigns);
	const prevKpi = previous ? computeKpiSummary(previous.campaigns) : null;
	const delta = computeWeekDelta(kpi, prevKpi);
	const avgCpl = kpi.cpl; // 노출 가중 평균 CPL

	const fatigue = previous
		? detectCreativeFatigue(snapshot.ads, previous.ads)
		: [];
	const criticalFatigue = fatigue.filter((f) => f.status === "critical");
	const pairs = detectAbPairs(campaigns);

	// ---- findings (카테고리별) ----
	const creative: AuditFinding[] = [];
	const budget: AuditFinding[] = [];
	const structure: AuditFinding[] = [];
	const audience: AuditFinding[] = [];

	// 최고 효율 소재 (리드 보유 광고 중 CPL 최저)
	const adsWithLeads = snapshot.ads
		.filter((a) => a.leads > 0)
		.map((a) => ({ ad: a, cpl: a.spend / a.leads }))
		.sort((x, y) => x.cpl - y.cpl);
	if (adsWithLeads.length > 0) {
		const best = adsWithLeads[0];
		creative.push({
			category: "creative",
			level: "pass",
			title: `최고 효율 소재: ${best.ad.adName}`,
			detail: `CPL ${round(best.cpl).toLocaleString("ko-KR")}원 · 리드 ${best.ad.leads}건 · CTR ${(best.ad.linkCtr * 100).toFixed(2)}%. 확장 1순위.`,
		});
	}

	// 노출은 있으나 링크 클릭 0건인 소재 (추적/후킹 점검)
	const zeroClick = snapshot.ads.filter(
		(a) => a.impressions >= MIN_IMPRESSIONS_FOR_FATIGUE && a.linkClicks === 0,
	);
	for (const a of zeroClick) {
		creative.push({
			category: "creative",
			level: "warning",
			title: `${a.adName} 링크 클릭 0건`,
			detail: `노출 ${a.impressions.toLocaleString("ko-KR")}회·지출 ${round(a.spend).toLocaleString("ko-KR")}원인데 linkClicks=0. CTA·Pixel·UTM 매핑 점검 필요.`,
		});
	}

	// 소재 피로 (CTR 급락)
	if (criticalFatigue.length > 0) {
		creative.push({
			category: "creative",
			level: "critical",
			title: `${criticalFatigue.length}개 소재에서 심각한 CTR 하락`,
			detail: criticalFatigue
				.slice(0, 3)
				.map(
					(f) =>
						`${f.adName} (CTR ${(f.previousCtr * 100).toFixed(1)}%→${(f.currentCtr * 100).toFixed(1)}%, -${round(f.ctrDropPct * 100)}%)`,
				)
				.join("; "),
		});
	}

	// CPL 전주 대비 변화 (40%↑ 치명 / 20%↑ 경고 / 10%↑ 약경고)
	if (delta.cplDeltaPct !== null && delta.cplDeltaPct >= CPL_SOFT_THRESHOLD) {
		const fromTo = `${prevKpi?.cpl ? round(prevKpi.cpl).toLocaleString("ko-KR") : "-"}원 → ${kpi.cpl ? round(kpi.cpl).toLocaleString("ko-KR") : "-"}원`;
		const level: "critical" | "warning" =
			delta.cplDeltaPct >= CPL_CRITICAL_THRESHOLD ? "critical" : "warning";
		budget.push({
			category: "budget",
			level,
			title: `CPL 전주 대비 ${round(delta.cplDeltaPct * 100)}% 상승`,
			detail:
				delta.cplDeltaPct >= CPL_WARNING_THRESHOLD
					? `${fromTo}. 추세 점검 필요.`
					: `${fromTo}. 상승 초기 — 소재·타겟 모니터링.`,
		});
	}

	// 계정 전체 CPL vs 목표 CPL (절대 기준)
	if (kpi.cpl !== null && kpi.cpl > targetCpl) {
		const overMultiple = kpi.cpl / targetCpl;
		budget.push({
			category: "budget",
			level: kpi.cpl >= targetCpl * 2 ? "critical" : "warning",
			title: `계정 CPL이 목표(${targetCpl.toLocaleString("ko-KR")}원)의 ${overMultiple.toFixed(1)}배`,
			detail: `현재 CPL ${round(kpi.cpl).toLocaleString("ko-KR")}원 — 목표 상한 ${targetCpl.toLocaleString("ko-KR")}원 초과. 비효율 캠페인 예산 회수·효율 캠페인 집중 필요.`,
		});
	}

	// 비효율 캠페인: 목표 2배 초과 또는 평균 2배 초과
	const outliers = campaigns
		.map((c) => ({ c, cpl: campaignCpl(c) }))
		.filter(
			(x) =>
				x.cpl !== null &&
				(x.cpl > targetCpl * CPL_OUTLIER_MULTIPLE ||
					(avgCpl !== null && x.cpl > avgCpl * CPL_OUTLIER_MULTIPLE)),
		);
	if (outliers.length > 0) {
		const worst = [...outliers].sort((a, b) => (b.cpl ?? 0) - (a.cpl ?? 0))[0];
		budget.push({
			category: "budget",
			level: "critical",
			title: `비효율 캠페인 ${outliers.length}개 (목표 CPL 2배+ 초과)`,
			detail: `최악: ${worst.c.campaignName} CPL ${round(worst.cpl ?? 0).toLocaleString("ko-KR")}원 (목표 ${targetCpl.toLocaleString("ko-KR")}원의 ${((worst.cpl ?? 0) / targetCpl).toFixed(1)}배). 예산 축소·정지 검토.`,
		});
	}

	// 지출은 있으나 리드 0건인 캠페인 (전액 낭비)
	// 평균 CPL 이상을 쓰고도 리드 0 = 최소 1건은 기대됐는데 전환 실패 → 치명
	const noLead = campaigns.filter((c) => c.leads === 0 && c.spend > 0);
	for (const c of noLead) {
		const enoughToExpectLead = avgCpl !== null && c.spend >= avgCpl;
		budget.push({
			category: "budget",
			level: enoughToExpectLead ? "critical" : "warning",
			title: `${c.campaignName} 리드 0건`,
			detail: `지출 ${round(c.spend).toLocaleString("ko-KR")}원에 리드 미발생${enoughToExpectLead ? ` (평균 CPL ${round(avgCpl).toLocaleString("ko-KR")}원이면 1건 이상 기대 구간)` : ""}. 소재·타겟·랜딩 전환 점검 필요.`,
		});
	}

	// 구조: 비활성 캠페인 잔존
	const inactive = campaigns.filter((c) => !isActive(c.status) && c.status !== "");
	if (inactive.length > 0) {
		structure.push({
			category: "structure",
			level: "warning",
			title: `비활성 캠페인 ${inactive.length}개 잔존`,
			detail: `${inactive
				.slice(0, 3)
				.map((c) => c.campaignName)
				.join(", ")} 등. 아카이브 정리 권장(리포트 노이즈).`,
		});
	}

	// 구조: objective 비어있음
	if (campaigns.length > 0 && campaigns.every((c) => !c.objective)) {
		structure.push({
			category: "structure",
			level: "warning",
			title: "캠페인 목표(objective) 필드 비어있음",
			detail: "전 행 objective 공란. Meta 광고관리자에서 Leads 목표 설정 여부 직접 확인 필요.",
		});
	} else {
		structure.push({
			category: "structure",
			level: "pass",
			title: "캠페인 구조 메타데이터 양호",
			detail: "캠페인 목표·네이밍이 채워져 있어 비교·집계 가능.",
		});
	}

	// 오디언스: audienceType 누락
	const hasAudienceType = snapshot.adSets.some((s) => s.audienceType);
	if (!hasAudienceType && snapshot.adSets.length > 0) {
		audience.push({
			category: "audience",
			level: "warning",
			title: "오디언스 유형 메타데이터 누락",
			detail: "audienceType 전 행 공란. 리타겟팅/유사 오디언스 사용 여부를 오디언스 매니저에서 직접 확인 필요.",
		});
	}

	// 오디언스: 빈도
	const maxFreq = campaigns.reduce((m, c) => Math.max(m, c.frequency), 0);
	if (maxFreq >= FREQUENCY_WARNING) {
		audience.push({
			category: "audience",
			level: "warning",
			title: `빈도 ${maxFreq.toFixed(1)}회로 피로 구간`,
			detail: "빈도 3회 이상. 오디언스 확대·소재 교체로 피로 완화 필요.",
		});
	} else {
		audience.push({
			category: "audience",
			level: "pass",
			title: `빈도 양호 (최대 ${maxFreq.toFixed(1)}회)`,
			detail: "3회 임계치 미달. 단 확장 시 빠르게 상승할 수 있어 모니터링 필요.",
		});
	}

	// ---- 카테고리 점수 ----
	const categories = {
		creative: scoreFromFindings(creative),
		budget: scoreFromFindings(budget),
		structure: scoreFromFindings(structure),
		audience: scoreFromFindings(audience),
	};
	let healthScore = round(
		categories.creative.score * 0.35 +
			categories.budget.score * 0.3 +
			categories.structure.score * 0.2 +
			categories.audience.score * 0.15,
	);
	// 절대 기준 감점: 계정 CPL이 목표를 초과하면 초과 배율에 비례해 종합점수 직접 차감.
	// (카테고리 점수만으로는 "목표 대비 비효율"이 충분히 반영되지 않으므로 핵심 KPI를 직접 반영)
	if (kpi.cpl !== null && kpi.cpl > targetCpl) {
		const penalty = Math.min(
			HEALTH_TARGET_PENALTY_CAP,
			round((kpi.cpl / targetCpl - 1) * 50),
		);
		healthScore -= penalty;
	} else if (kpi.cpl === null && kpi.totalSpend > 0) {
		// 지출은 했는데 리드 0 → 최악
		healthScore = Math.min(healthScore, 30);
	}
	healthScore = Math.max(0, Math.min(100, healthScore));
	const grade = gradeFromScore(healthScore);

	// ---- killList (비효율·낭비 순) ----
	const killList: AuditKillItem[] = [];
	if (avgCpl !== null) {
		for (const { c, cpl } of outliers) {
			const wasted = round(c.spend - c.leads * avgCpl);
			killList.push({
				name: c.campaignName,
				reason: `CPL ${round(cpl ?? 0).toLocaleString("ko-KR")}원, 평균 ${((cpl ?? 0) / avgCpl).toFixed(1)}배. 예산 축소·정지 시 낭비 회수.`,
				wastedSpend: Math.max(0, wasted),
			});
		}
	}
	for (const c of noLead) {
		killList.push({
			name: c.campaignName,
			reason: `지출 ${round(c.spend).toLocaleString("ko-KR")}원·리드 0건. 전환 점검 전까지 정지 권장.`,
			wastedSpend: round(c.spend),
		});
	}
	killList.sort((a, b) => b.wastedSpend - a.wastedSpend);

	// ---- scalingOpportunities (효율 순) ----
	// 확장 후보: 목표 0.6배 미만(명확히 효율적)이며 리드 2건 이상
	const scalingOpportunities: AuditScalingItem[] = campaigns
		.map((c) => ({ c, cpl: campaignCpl(c) }))
		.filter(
			(x) =>
				x.cpl !== null && x.cpl <= targetCpl * CPL_SCALE_MULTIPLE && x.c.leads >= 2,
		)
		.sort((a, b) => (a.cpl ?? 0) - (b.cpl ?? 0))
		.slice(0, 2)
		.map(({ c, cpl }) => ({
			name: c.campaignName,
			recommendation: `CPL ${round(cpl ?? 0).toLocaleString("ko-KR")}원으로 목표(${targetCpl.toLocaleString("ko-KR")}원) 대비 효율적. 일예산 단계적 상향(빈도 2.5 미만 유지) 및 비율(9:16/1:1/1.91:1) 분리 발행.`,
			expectedImpact: `현 CPL 유지 시 리드 증가. 비효율 캠페인 예산 재배분 대상.`,
		}));

	// ---- abConclusion ----
	let abConclusion: AuditAbConclusion | null = null;
	const decided = pairs.find((p) => p.winner !== "inconclusive");
	if (decided && decided.control.cpl !== null && decided.variant.cpl !== null) {
		const winnerIsVariant = decided.winner === "variant";
		const winnerName = winnerIsVariant
			? decided.variantName
			: decided.controlName;
		const winnerCpl = winnerIsVariant
			? decided.variant.cpl
			: decided.control.cpl;
		const loserCpl = winnerIsVariant
			? decided.control.cpl
			: decided.variant.cpl;
		abConclusion = {
			winner: winnerName,
			winnerCpl: round(winnerCpl),
			loserCpl: round(loserCpl),
			cplReduction:
				loserCpl > 0
					? Math.round(((loserCpl - winnerCpl) / loserCpl) * 1000) / 10
					: 0,
			recommendation: `"${winnerName}"로 트래픽 집중, 패자 변형 정지.`,
		};
	}

	// ---- topCreatives (리드·CPL 순 상위 4) ----
	const topCreatives: AuditTopCreative[] = [...snapshot.ads]
		.sort((a, b) => {
			if (b.leads !== a.leads) return b.leads - a.leads;
			const ac = a.leads > 0 ? a.spend / a.leads : Infinity;
			const bc = b.leads > 0 ? b.spend / b.leads : Infinity;
			return ac - bc;
		})
		.slice(0, 4)
		.map((a) => ({
			name: a.adName,
			cpl: a.leads > 0 ? round(a.spend / a.leads) : null,
			leads: a.leads,
			ctr: a.linkCtr,
		}));

	// ---- quickWins (killList·scaling·CPL 델타에서 우선순위 부여) ----
	const quickWins: AuditQuickWin[] = [];
	for (const k of killList.slice(0, 3)) {
		quickWins.push({
			priority: quickWins.length + 1,
			action: `${k.name} 예산 축소·정지`,
			impact: `낭비 ${k.wastedSpend.toLocaleString("ko-KR")}원 회수`,
		});
	}
	for (const s of scalingOpportunities) {
		quickWins.push({
			priority: quickWins.length + 1,
			action: `${s.name} 일예산 상향`,
			impact: s.expectedImpact,
		});
	}
	if (quickWins.length === 0 && delta.cplDeltaPct !== null && delta.cplDeltaPct > 0) {
		quickWins.push({
			priority: 1,
			action: "CPL 상승 원인 소재·타겟 점검",
			impact: `전주 대비 CPL ${round(delta.cplDeltaPct * 100)}% 상승 억제`,
		});
	}

	// ---- summary (수치 템플릿) ----
	const bestCampaign = campaigns
		.map((c) => ({ c, cpl: campaignCpl(c) }))
		.filter((x) => x.cpl !== null)
		.sort((a, b) => (a.cpl ?? 0) - (b.cpl ?? 0))[0];
	const worstCampaign = campaigns
		.map((c) => ({ c, cpl: campaignCpl(c) }))
		.filter((x) => x.cpl !== null)
		.sort((a, b) => (b.cpl ?? 0) - (a.cpl ?? 0))[0];
	const deltaPhrase =
		delta.cplDeltaPct !== null
			? ` CPL은 전주 대비 ${delta.cplDeltaPct >= 0 ? "+" : ""}${round(delta.cplDeltaPct * 100)}%.`
			: "";
	const cplVsTarget =
		kpi.cpl !== null
			? ` (목표 ${targetCpl.toLocaleString("ko-KR")}원 ${kpi.cpl > targetCpl ? "초과" : "이내"})`
			: "";
	const summary =
		`${snapshot.isoWeek} 총 지출 ${round(kpi.totalSpend).toLocaleString("ko-KR")}원·리드 ${kpi.totalLeads}건·CPL ${kpi.cpl ? round(kpi.cpl).toLocaleString("ko-KR") + "원" : "-"}${cplVsTarget}.` +
		(bestCampaign
			? ` 최고 효율 ${bestCampaign.c.campaignName}(CPL ${round(bestCampaign.cpl ?? 0).toLocaleString("ko-KR")}원)`
			: "") +
		(worstCampaign && worstCampaign.c !== bestCampaign?.c
			? `, 최저 ${worstCampaign.c.campaignName}(CPL ${round(worstCampaign.cpl ?? 0).toLocaleString("ko-KR")}원).`
			: ".") +
		deltaPhrase;

	return {
		generatedAt: now.toISOString(),
		period: periodLabel(snapshot),
		healthScore,
		grade,
		summary,
		categories,
		findings: [...creative, ...budget, ...structure, ...audience],
		quickWins,
		killList,
		scalingOpportunities,
		abConclusion,
		topCreatives,
	};
}
