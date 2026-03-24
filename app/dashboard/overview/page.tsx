"use client";

import { useEffect, useState } from "react";
import AuditReport from "@/components/dashboard/AuditReport";
import InsightBanner from "@/components/dashboard/InsightBanner";
import KpiCard from "@/components/dashboard/KpiCard";
import {
	computeKpiSummary,
	computeWeekDelta,
	detectAbPairs,
	detectCreativeFatigue,
	generateInsights,
} from "@/lib/dashboard/analytics";
import { getWeekSnapshot, listWeeks } from "@/lib/dashboard/storage";
import type {
	AdRow,
	AdSetRow,
	AuditReport as AuditReportType,
	CampaignRow,
	InsightMessage,
	KpiSummary,
	WeekDelta,
} from "@/lib/dashboard/types";

// ---- Formatters ----

function krw(n: number | null) {
	if (n === null || n === 0) return "-";
	return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}
function pct(n: number) {
	return `${(n * 100).toFixed(2)}%`;
}
function num(n: number) {
	return n.toLocaleString("ko-KR");
}
function deltaPct(n: number | null | undefined) {
	if (n === null || n === undefined) return null;
	return n * 100;
}

// ---- Week Selector ----

function WeekSelector({
	weeks,
	selected,
	onSelect,
}: {
	weeks: string[];
	selected: string;
	onSelect: (w: string) => void;
}) {
	if (weeks.length <= 1) return null;
	return (
		<div
			className="flex gap-2 overflow-x-auto pb-1 mb-5"
			role="tablist"
			aria-label="주차 선택"
		>
			{weeks.map((w) => (
				<button
					key={w}
					role="tab"
					aria-selected={w === selected}
					onClick={() => onSelect(w)}
					className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
						w === selected
							? "bg-gold text-black font-semibold"
							: "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]"
					}`}
				>
					{w}
				</button>
			))}
		</div>
	);
}

// ---- Campaign table helpers ----

function cplColor(cpl: number | null, avgCpl: number | null): string {
	if (cpl === null || avgCpl === null || avgCpl === 0) return "text-gray-300";
	const ratio = cpl / avgCpl;
	if (ratio <= 0.85) return "text-ok";
	if (ratio <= 1.15) return "text-gray-300";
	return "text-critical";
}

function freqColor(freq: number): string {
	if (freq <= 0) return "text-gray-500";
	if (freq < 2) return "text-ok";
	if (freq < 3) return "text-warning";
	return "text-critical";
}

function freqLabel(freq: number): string {
	if (freq <= 0) return "-";
	if (freq < 2) return freq.toFixed(2);
	if (freq < 3) return `${freq.toFixed(2)} ⚠`;
	return `${freq.toFixed(2)} ‼`;
}

function SpendBar({ spend, maxSpend }: { spend: number; maxSpend: number }) {
	const width = maxSpend > 0 ? (spend / maxSpend) * 100 : 0;
	return (
		<div className="flex items-center gap-2">
			<span className="text-gray-300 font-mono text-xs w-20 text-right shrink-0">
				{krw(spend)}
			</span>
			<div className="flex-1 bg-[#333] rounded-full h-1.5 min-w-[40px]">
				<div
					className="bg-gold h-1.5 rounded-full"
					style={{ width: `${width}%` }}
				/>
			</div>
		</div>
	);
}

// ---- Main page ----

interface OverviewState {
	kpi: KpiSummary;
	delta: WeekDelta;
	insights: InsightMessage[];
	campaigns: CampaignRow[];
	adSets: AdSetRow[];
	ads: AdRow[];
	currentWeek: string;
	previousWeek: string;
	dateRange: string;
}

function buildOverviewState(
	weeks: string[],
	selected: string,
): OverviewState | null {
	const idx = weeks.indexOf(selected);
	if (idx === -1) return null;

	const currSnap = getWeekSnapshot(selected);
	if (!currSnap) return null;

	const prevWeekKey = idx > 0 ? weeks[idx - 1] : null;
	const prevSnap = prevWeekKey ? getWeekSnapshot(prevWeekKey) : null;

	const currKpi = computeKpiSummary(currSnap.campaigns);
	const prevKpi = prevSnap ? computeKpiSummary(prevSnap.campaigns) : null;
	const delta = computeWeekDelta(currKpi, prevKpi);
	const pairs = detectAbPairs(currSnap.campaigns);
	const fatigue = prevSnap
		? detectCreativeFatigue(currSnap.ads, prevSnap.ads)
		: [];
	const insights = generateInsights(delta, fatigue, pairs);

	const starts = currSnap.campaigns.map((c) => c.reportStart).filter(Boolean);
	const ends = currSnap.campaigns.map((c) => c.reportEnd).filter(Boolean);
	const dateRange =
		starts.length > 0 && ends.length > 0
			? `${starts[0]} ~ ${ends[ends.length - 1]}`
			: "";

	return {
		kpi: currKpi,
		delta,
		insights,
		campaigns: [...currSnap.campaigns].sort((a, b) => {
			const aCpl = a.leads > 0 ? a.spend / a.leads : Infinity;
			const bCpl = b.leads > 0 ? b.spend / b.leads : Infinity;
			return aCpl - bCpl;
		}),
		adSets: currSnap.adSets ?? [],
		ads: currSnap.ads ?? [],
		currentWeek: selected,
		previousWeek: prevWeekKey ?? "",
		dateRange,
	};
}

export default function OverviewPage() {
	const [weeks, setWeeks] = useState<string[]>([]);
	const [selectedWeek, setSelectedWeek] = useState<string>("");
	const [state, setState] = useState<OverviewState | null>(null);
	const [auditReport, setAuditReport] = useState<AuditReportType | null>(null);
	const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(
		new Set(),
	);
	const [expandedAdSets, setExpandedAdSets] = useState<Set<string>>(new Set());

	function toggleCampaign(id: string) {
		setExpandedCampaigns((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}
	function toggleAdSet(id: string) {
		setExpandedAdSets((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}

	// Load weeks from localStorage on mount
	useEffect(() => {
		const allWeeks = listWeeks();
		setWeeks(allWeeks);
		if (allWeeks.length > 0) {
			setSelectedWeek(allWeeks[allWeeks.length - 1]);
		}
	}, []);

	// Recompute state whenever selectedWeek changes
	useEffect(() => {
		if (!selectedWeek || weeks.length === 0) return;
		const computed = buildOverviewState(weeks, selectedWeek);
		setState(computed);
	}, [selectedWeek, weeks]);

	// Load AI audit report (once)
	useEffect(() => {
		fetch("/api/audit")
			.then((r) => r.json())
			.then((report: AuditReportType | null) => setAuditReport(report))
			.catch(() => {});
	}, []);

	if (weeks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-gray-400">
				<p className="text-lg mb-2">업로드된 데이터가 없습니다</p>
				<a
					href="/dashboard/upload"
					className="text-gold hover:underline text-sm"
				>
					CSV 파일 업로드하기 →
				</a>
			</div>
		);
	}

	if (!state) return null;

	const {
		kpi,
		delta,
		insights,
		campaigns,
		adSets,
		ads,
		currentWeek,
		previousWeek,
		dateRange,
	} = state;
	const maxSpend = Math.max(...campaigns.map((c) => c.spend), 1);
	const avgCpl = kpi.cpl;
	const totalFreq =
		kpi.totalImpressions > 0 && kpi.totalReach > 0
			? kpi.totalImpressions / kpi.totalReach
			: 0;
	const cpm =
		kpi.totalImpressions > 0
			? (kpi.totalSpend / kpi.totalImpressions) * 1000
			: null;

	// KPI 상태 판정 (업계 기준)
	const ctrStatus =
		kpi.avgLinkCtr >= 0.015
			? "ok"
			: kpi.avgLinkCtr >= 0.01
				? "warning"
				: "critical";
	const freqStatus =
		totalFreq <= 0
			? undefined
			: totalFreq < 2
				? "ok"
				: totalFreq < 3
					? "warning"
					: "critical";
	const cpcStatus =
		kpi.cpc === null
			? undefined
			: kpi.cpc < 800
				? "ok"
				: kpi.cpc < 2000
					? "warning"
					: "critical";
	const cplStatus =
		delta.cplDeltaPct === null
			? undefined
			: delta.cplDeltaPct <= 0
				? "ok"
				: delta.cplDeltaPct <= 0.2
					? "warning"
					: "critical";

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div>
					<h1 className="text-2xl font-bold">광고 성과 개요</h1>
					<p className="text-sm text-gray-500 mt-0.5">
						{currentWeek}
						{dateRange && (
							<span className="ml-2 text-gray-600">({dateRange})</span>
						)}
						{previousWeek && (
							<span className="ml-2 text-gray-600">vs {previousWeek}</span>
						)}
					</p>
				</div>
				<a
					href="/dashboard/upload"
					className="text-xs text-gray-500 hover:text-gold"
				>
					+ 데이터 추가
				</a>
			</div>

			{/* Week Selector */}
			<WeekSelector
				weeks={weeks}
				selected={selectedWeek}
				onSelect={setSelectedWeek}
			/>

			{/* Insights */}
			<InsightBanner insights={insights} />

			{/* KPI Summary */}
			<div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2 mb-8">
				<KpiCard label="총 지출" value={krw(kpi.totalSpend) ?? "-"} />
				<KpiCard label="리드" value={num(kpi.totalLeads)} unit="건" />
				<KpiCard
					label="결과당비용"
					value={krw(kpi.cpl) ?? "-"}
					delta={deltaPct(delta.cplDeltaPct) ?? undefined}
					status={cplStatus}
				/>
				<KpiCard
					label="링크 CTR"
					value={pct(kpi.avgLinkCtr)}
					delta={deltaPct(delta.ctrDeltaPct) ?? undefined}
					isInvertedDelta
					status={ctrStatus}
				/>
				<KpiCard label="총 노출" value={num(kpi.totalImpressions)} unit="회" />
				<KpiCard label="도달" value={num(kpi.totalReach)} unit="명" />
				<KpiCard
					label="평균 빈도"
					value={totalFreq > 0 ? totalFreq.toFixed(2) : "-"}
					unit="회"
					status={freqStatus}
				/>
				<KpiCard label="CPM" value={krw(cpm) ?? "-"} />
				<KpiCard label="CPC" value={krw(kpi.cpc) ?? "-"} status={cpcStatus} />
			</div>

			{/* Campaign Drill-down Table */}
			<section className="mb-8">
				<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
					캠페인별 성과 ({campaigns.length}개) — CPL 낮은 순
					<span className="ml-2 text-gray-600 normal-case font-normal">
						클릭하면 광고세트 펼쳐짐
					</span>
				</h2>
				<div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
					{/* Header */}
					<div className="grid grid-cols-[24px_1fr_160px_60px_80px_70px_60px_60px_70px_80px] gap-x-3 px-4 py-2 border-b border-[#2a2a2a] text-xs text-gray-500 uppercase tracking-wide">
						<span />
						<span>이름</span>
						<span className="text-right">지출</span>
						<span className="text-right">리드</span>
						<span className="text-right">CPL</span>
						<span className="text-right">CTR</span>
						<span className="text-right">빈도</span>
						<span className="text-right">CPM</span>
						<span className="text-right">CPC</span>
						<span className="text-right">랜딩조회당</span>
					</div>

					{campaigns.length === 0 && (
						<div className="px-4 py-6 text-center text-gray-500 text-sm">
							캠페인 데이터 없음
						</div>
					)}

					{campaigns.map((c, i) => {
						const cCpl = c.leads > 0 ? c.spend / c.leads : null;
						const cCpc = c.linkClicks > 0 ? c.spend / c.linkClicks : null;
						const cCplpv =
							c.landingPageViews > 0 ? c.spend / c.landingPageViews : null;
						const campaignId = `c-${c.campaignId || c.campaignName}-${i}`;
						const isOpen = expandedCampaigns.has(campaignId);
						const childAdSets = adSets.filter(
							(s) => s.campaignName === c.campaignName,
						);

						return (
							<div key={campaignId}>
								{/* Campaign Row */}
								<button
									onClick={() => toggleCampaign(campaignId)}
									className="w-full grid grid-cols-[24px_1fr_160px_60px_80px_70px_60px_60px_70px_80px] gap-x-3 px-4 py-3 border-b border-[#2a2a2a] border-l-2 border-l-amber-500/60 bg-[#1a1a1a] hover:bg-[#222] transition-colors items-center text-left"
								>
									<span className="text-gray-500 text-xs">
										{isOpen ? "▼" : "▶"}
									</span>
									<span
										className="text-sm text-white truncate"
										title={c.campaignName}
									>
										{c.campaignName}
									</span>
									<SpendBar spend={c.spend} maxSpend={maxSpend} />
									<span className="text-sm text-gray-300 text-right font-mono">
										{c.leads}
									</span>
									<span
										className={`text-sm text-right font-mono ${cplColor(cCpl, avgCpl)}`}
									>
										{krw(cCpl)}
									</span>
									<span className="text-sm text-gray-300 text-right font-mono">
										{pct(c.linkCtr)}
									</span>
									<span
										className={`text-sm text-right font-mono ${freqColor(c.frequency)}`}
									>
										{freqLabel(c.frequency)}
									</span>
									<span className="text-sm text-gray-500 text-right font-mono">
										{krw(c.cpm)}
									</span>
									<span className="text-sm text-gray-300 text-right font-mono">
										{krw(cCpc)}
									</span>
									<span className="text-sm text-gray-300 text-right font-mono">
										{krw(cCplpv)}
									</span>
								</button>

								{/* AdSet Rows */}
								{isOpen &&
									childAdSets.map((s, si) => {
										const sCpl = s.leads > 0 ? s.spend / s.leads : null;
										const sCpc =
											s.linkClicks > 0 ? s.spend / s.linkClicks : null;
										const adSetId = `s-${s.adSetId || s.adSetName}-${si}`;
										const isAdSetOpen = expandedAdSets.has(adSetId);
										const childAds = ads.filter(
											(a) =>
												a.adSetName === s.adSetName &&
												a.campaignName === s.campaignName,
										);

										return (
											<div key={adSetId} className="bg-[#161616]">
												{/* AdSet Row */}
												<button
													onClick={() => toggleAdSet(adSetId)}
													className="w-full grid grid-cols-[24px_1fr_160px_60px_80px_70px_60px_60px_70px_80px] gap-x-3 pl-8 pr-4 py-2.5 border-b border-[#1a2030] border-l-2 border-l-blue-400/50 bg-[#1e2030] hover:bg-[#252840] transition-colors items-center text-left"
												>
													<span className="text-gray-600 text-xs">
														{isAdSetOpen ? "▼" : "▶"}
													</span>
													<span
														className="text-sm text-gray-300 truncate"
														title={s.adSetName}
													>
														{s.adSetName}
													</span>
													<SpendBar spend={s.spend} maxSpend={maxSpend} />
													<span className="text-sm text-gray-400 text-right font-mono">
														{s.leads}
													</span>
													<span
														className={`text-sm text-right font-mono ${cplColor(sCpl, avgCpl)}`}
													>
														{krw(sCpl)}
													</span>
													<span className="text-sm text-gray-400 text-right font-mono">
														{pct(s.linkCtr)}
													</span>
													<span
														className={`text-sm text-right font-mono ${freqColor(s.frequency)}`}
													>
														{freqLabel(s.frequency)}
													</span>
													<span className="text-sm text-gray-600 text-right font-mono">
														{krw(s.cpm)}
													</span>
													<span className="text-sm text-gray-400 text-right font-mono">
														{krw(sCpc)}
													</span>
													<span className="text-sm text-gray-600 text-right font-mono">
														-
													</span>
												</button>

												{/* Ad Rows */}
												{isAdSetOpen &&
													childAds.map((a, ai) => {
														const aCpl = a.leads > 0 ? a.spend / a.leads : null;
														const aCpc =
															a.linkClicks > 0 ? a.spend / a.linkClicks : null;
														return (
															<div
																key={`a-${a.adId || a.adName}-${ai}`}
																className="grid grid-cols-[24px_1fr_160px_60px_80px_70px_60px_60px_70px_80px] gap-x-3 pl-14 pr-4 py-2 border-b border-gray-200 border-l-2 border-l-gray-400/50 bg-white items-center"
															>
																<span className="text-gray-400 text-xs">•</span>
																<span
																	className="text-xs text-gray-800 truncate"
																	title={a.adName}
																>
																	{a.adName}
																</span>
																<SpendBar spend={a.spend} maxSpend={maxSpend} />
																<span className="text-xs text-gray-700 text-right font-mono">
																	{a.leads}
																</span>
																<span
																	className={`text-xs text-right font-mono ${cplColor(aCpl, avgCpl)}`}
																>
																	{krw(aCpl)}
																</span>
																<span className="text-xs text-gray-700 text-right font-mono">
																	{pct(a.linkCtr)}
																</span>
																<span className="text-xs text-gray-500 text-right font-mono">
																	-
																</span>
																<span className="text-xs text-gray-700 text-right font-mono">
																	{krw(a.cpm)}
																</span>
																<span className="text-xs text-gray-700 text-right font-mono">
																	{krw(aCpc)}
																</span>
																<span className="text-xs text-gray-500 text-right font-mono">
																	-
																</span>
															</div>
														);
													})}
											</div>
										);
									})}
							</div>
						);
					})}
				</div>
				<p className="text-xs text-gray-600 mt-1.5 px-1">
					CPL 색상: <span className="text-ok">녹색</span> 평균 -15% 이하 ·{" "}
					<span className="text-critical">빨강</span> 평균 +15% 초과 · 빈도{" "}
					<span className="text-warning">⚠ 2~3</span>{" "}
					<span className="text-critical">‼ 3+</span> 소재 교체 검토
				</p>
			</section>

			{/* Quick links */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
				{[
					{ href: "/dashboard/trends", label: "주차별 트렌드 →" },
					{ href: "/dashboard/ab-test", label: "A/B 테스트 →" },
					{ href: "/dashboard/fatigue", label: "소재 피로도 →" },
					{ href: "/dashboard/upload", label: "주차 추가 →" },
				].map((item) => (
					<a
						key={item.href}
						href={item.href}
						className="rounded-lg bg-[#1a1a1a] p-3 text-sm text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
					>
						{item.label}
					</a>
				))}
			</div>

			{/* AI 분석 보고서 */}
			{auditReport ? (
				<AuditReport report={auditReport} />
			) : (
				<div className="mt-10 border-t border-[#2a2a2a] pt-8">
					<p className="text-sm text-gray-600">
						AI 광고 진단 보고서가 없습니다.{" "}
						<span className="text-gray-500">
							데이터 업로드 후 Claude에게 &quot;분석해줘&quot;라고 요청하세요.
						</span>
					</p>
				</div>
			)}
		</div>
	);
}
