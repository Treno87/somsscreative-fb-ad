"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { computeKpiSummary, detectAbPairs } from "@/lib/dashboard/analytics";
import { getWeekSnapshot, listWeeks } from "@/lib/dashboard/storage";
import type { AbPair, CampaignRow, KpiSummary } from "@/lib/dashboard/types";

// ── Formatters ──────────────────────────────────────────────────

function krw(n: number | null) {
	if (n === null) return "-";
	return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}
function fmtPct(n: number | null) {
	if (n === null) return "-";
	return `${(n * 100).toFixed(2)}%`;
}
function fmtCvr(lpv: number, leads: number) {
	if (lpv === 0) return null;
	return leads / lpv;
}
function deltaPctStr(a: number | null, b: number | null): string | null {
	if (a === null || b === null || a === 0) return null;
	const d = (b - a) / a;
	return `${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}%`;
}

// ── MetricRow ────────────────────────────────────────────────────

function MetricRow({
	label,
	controlVal,
	variantVal,
	controlRaw,
	variantRaw,
	lowerIsBetter = false,
	isBold = false,
}: {
	label: string;
	controlVal: string;
	variantVal: string;
	controlRaw?: number | null;
	variantRaw?: number | null;
	lowerIsBetter?: boolean;
	isBold?: boolean;
}) {
	let variantColor = "text-gray-300";
	if (controlRaw != null && variantRaw != null && controlRaw !== 0) {
		const better = lowerIsBetter
			? variantRaw < controlRaw
			: variantRaw > controlRaw;
		const worse = lowerIsBetter
			? variantRaw > controlRaw
			: variantRaw < controlRaw;
		if (better) variantColor = "text-ok";
		else if (worse) variantColor = "text-critical";
	}

	const delta =
		controlRaw != null && variantRaw != null
			? deltaPctStr(controlRaw, variantRaw)
			: null;

	return (
		<div className="flex items-start py-3 border-b border-[#222] last:border-0">
			<span className="w-36 shrink-0 text-sm text-gray-500 pt-0.5">
				{label}
			</span>
			<span
				className={`flex-1 text-sm font-mono ${isBold ? "font-bold text-white" : "text-gray-300"}`}
			>
				{controlVal}
			</span>
			<span
				className={`flex-1 text-sm font-mono ${isBold ? "font-bold" : ""} ${variantColor}`}
			>
				{variantVal}
				{delta && (
					<span
						className={`ml-1.5 text-xs font-semibold ${variantColor} opacity-80`}
					>
						({delta})
					</span>
				)}
			</span>
		</div>
	);
}

// ── PairCard ─────────────────────────────────────────────────────

function PairCard({ pair }: { pair: AbPair }) {
	const { control, variant } = pair;

	const controlCvr = fmtCvr(control.totalLandingPageViews, control.totalLeads);
	const variantCvr = fmtCvr(variant.totalLandingPageViews, variant.totalLeads);

	const cplReduction =
		control.cpl && variant.cpl && pair.winner === "variant"
			? ((control.cpl - variant.cpl) / control.cpl) * 100
			: control.cpl && variant.cpl && pair.winner === "control"
				? ((variant.cpl - control.cpl) / variant.cpl) * 100
				: null;

	const leadDelta =
		control.totalLeads > 0
			? ((variant.totalLeads - control.totalLeads) / control.totalLeads) * 100
			: null;

	const winnerName =
		pair.winner === "variant"
			? pair.variantName
			: pair.winner === "control"
				? pair.controlName
				: null;

	// CPL bar chart
	const maxCpl = Math.max(control.cpl ?? 0, variant.cpl ?? 0, 1);
	const chartData = [
		{
			name: pair.controlName,
			cpl: Math.round(control.cpl ?? 0),
			isWinner: pair.winner === "control",
		},
		{
			name: pair.variantName,
			cpl: Math.round(variant.cpl ?? 0),
			isWinner: pair.winner === "variant",
		},
	];
	const yAxisWidth = Math.min(
		Math.max(pair.controlName.length, pair.variantName.length) * 8 + 12,
		200,
	);

	const winnerBadgeStyle =
		pair.winner === "variant"
			? "bg-ok/15 text-ok border border-ok/30"
			: pair.winner === "control"
				? "bg-gold/15 text-gold border border-gold/30"
				: "bg-gray-700/50 text-gray-400 border border-gray-600";

	return (
		<div className="bg-[#1a1a1a] rounded-xl overflow-hidden">
			{/* ── Header ── */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-white font-semibold truncate">
						{pair.controlName}
					</span>
					<span className="text-gray-600 shrink-0">vs</span>
					<span className="text-white font-semibold truncate">
						{pair.variantName}
					</span>
				</div>
				<span
					className={`ml-4 shrink-0 text-xs font-bold px-3 py-1 rounded-full ${winnerBadgeStyle}`}
				>
					{winnerName ? `${winnerName} 우세` : "결론 없음"}
				</span>
			</div>

			{/* ── Column headers ── */}
			<div className="flex items-center px-5 pt-4 pb-2 text-xs text-gray-500 uppercase tracking-wide border-b border-[#2a2a2a]">
				<span className="w-36 shrink-0">지표</span>
				<span className="flex-1 flex items-center gap-2 font-semibold">
					A안 — 컨트롤
					{pair.winner === "control" && (
						<span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded font-bold normal-case">
							WINNER
						</span>
					)}
				</span>
				<span className="flex-1 flex items-center gap-2 font-semibold">
					B안 — 변형
					{pair.winner === "variant" && (
						<span className="text-xs bg-ok/20 text-ok px-2 py-0.5 rounded font-bold normal-case">
							WINNER
						</span>
					)}
				</span>
			</div>

			{/* ── Metrics ── */}
			<div className="px-5 pb-4">
				<MetricRow
					label="총 지출"
					controlVal={krw(control.totalSpend)}
					variantVal={krw(variant.totalSpend)}
				/>
				<MetricRow
					label="리드 수"
					controlVal={`${control.totalLeads}건`}
					variantVal={`${variant.totalLeads}건`}
					controlRaw={control.totalLeads}
					variantRaw={variant.totalLeads}
				/>
				<MetricRow
					label="CPL"
					controlVal={krw(control.cpl)}
					variantVal={krw(variant.cpl)}
					controlRaw={control.cpl}
					variantRaw={variant.cpl}
					lowerIsBetter
					isBold
				/>
				<MetricRow
					label="CTR"
					controlVal={fmtPct(control.avgLinkCtr)}
					variantVal={fmtPct(variant.avgLinkCtr)}
					controlRaw={control.avgLinkCtr}
					variantRaw={variant.avgLinkCtr}
				/>
				<MetricRow
					label="랜딩→리드 전환율"
					controlVal={
						controlCvr !== null ? `${(controlCvr * 100).toFixed(1)}%` : "-"
					}
					variantVal={
						variantCvr !== null ? `${(variantCvr * 100).toFixed(1)}%` : "-"
					}
					controlRaw={controlCvr}
					variantRaw={variantCvr}
				/>
			</div>

			{/* ── CPL Bar Chart ── */}
			{(control.cpl ?? 0) > 0 && (
				<div className="mx-5 mb-4 bg-[#111] rounded-lg p-4">
					<p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
						CPL 비교
					</p>
					<ResponsiveContainer width="100%" height={90}>
						<BarChart
							data={chartData}
							layout="vertical"
							margin={{ left: 0, right: 80, top: 4, bottom: 4 }}
						>
							<XAxis
								type="number"
								domain={[0, maxCpl * 1.15]}
								tickFormatter={(v) =>
									v >= 1000 ? `₩${(v / 1000).toFixed(0)}K` : `₩${v}`
								}
								tick={{ fill: "#555", fontSize: 10 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								type="category"
								dataKey="name"
								tick={{ fill: "#888", fontSize: 11 }}
								width={yAxisWidth}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									background: "#222",
									border: "1px solid #444",
									borderRadius: 8,
									fontSize: 12,
								}}
								formatter={(v) => [
									krw(typeof v === "number" ? v : null),
									"CPL",
								]}
							/>
							<Bar dataKey="cpl" radius={[0, 4, 4, 0]} maxBarSize={28}>
								{chartData.map((entry, i) => (
									<Cell
										key={i}
										fill={entry.isWinner ? "#22c55e" : "#b8963e"}
										fillOpacity={entry.isWinner ? 1 : 0.6}
									/>
								))}
								<LabelList
									dataKey="cpl"
									position="right"
									content={(props) => {
										const { x, y, width, height, value } = props as {
											x: number; y: number; width: number; height: number; value: number;
										};
										if (!value) return null;
										return (
											<text
												x={x + width + 8}
												y={y + height / 2}
												fill="#e5e7eb"
												fontSize={12}
												fontWeight={700}
												dominantBaseline="middle"
											>
												{krw(value)}
											</text>
										);
									}}
								/>
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}

			{/* ── Conclusion ── */}
			{winnerName && (
				<div className={`mx-5 mb-5 rounded-lg border overflow-hidden ${pair.winner === "variant" ? "border-ok/30" : "border-gold/30"}`}>
					<div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${pair.winner === "variant" ? "bg-ok/20 text-ok" : "bg-gold/20 text-gold"}`}>
						결론 — {winnerName} 우세
					</div>
					<div className="bg-[#111] px-4 py-3 flex flex-col gap-2">
						{cplReduction !== null && cplReduction > 0 && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-ok font-bold">▼</span>
								<span className="text-gray-400">CPL</span>
								<span className="font-bold text-white">{cplReduction.toFixed(1)}% 절감</span>
							</div>
						)}
						{leadDelta !== null && Math.abs(leadDelta) >= 10 && (
							<div className="flex items-center gap-2 text-sm">
								<span className={`font-bold ${leadDelta > 0 ? "text-ok" : "text-critical"}`}>{leadDelta > 0 ? "▲" : "▼"}</span>
								<span className="text-gray-400">리드 수</span>
								<span className="font-bold text-white">{Math.abs(leadDelta).toFixed(0)}% {leadDelta > 0 ? "증가" : "감소"}</span>
							</div>
						)}
						{controlCvr !== null && variantCvr !== null && variantCvr > 0 && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-ok font-bold">▲</span>
								<span className="text-gray-400">랜딩→리드 전환율</span>
								<span className="font-bold text-white">{(variantCvr * 100).toFixed(1)}%</span>
							</div>
						)}
						<div className="flex items-center gap-2 text-sm pt-2 mt-1 border-t border-[#222]">
							<span className="text-yellow-400">→</span>
							<span className="text-gray-300">즉시 <span className="font-bold text-white">{winnerName}</span>에 예산 집중 편성 권장</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// ── Manual PairCard ───────────────────────────────────────────────

function ManualPairCard({ pair }: { pair: AbPair }) {
	return <PairCard pair={pair} />;
}

// ── Main Page ────────────────────────────────────────────────────

export default function AbTestPage() {
	const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
	const [autoPairs, setAutoPairs] = useState<AbPair[]>([]);
	const [loaded, setLoaded] = useState(false);

	const [controlIdx, setControlIdx] = useState<number>(-1);
	const [variantIdx, setVariantIdx] = useState<number>(-1);
	const [manualPair, setManualPair] = useState<AbPair | null>(null);

	useEffect(() => {
		const weeks = listWeeks();
		if (weeks.length === 0) {
			setLoaded(true);
			return;
		}
		const snap = getWeekSnapshot(weeks[weeks.length - 1]);
		if (snap) {
			setCampaigns(snap.campaigns);
			setAutoPairs(detectAbPairs(snap.campaigns));
		}
		setLoaded(true);
	}, []);

	function buildManualPair(aIdx: number, bIdx: number): AbPair | null {
		if (aIdx < 0 || bIdx < 0 || aIdx === bIdx) return null;
		const control = campaigns[aIdx];
		const variant = campaigns[bIdx];
		const controlKpi: KpiSummary = computeKpiSummary([control]);
		const variantKpi: KpiSummary = computeKpiSummary([variant]);
		let winner: AbPair["winner"] = "inconclusive";
		if (controlKpi.cpl !== null && variantKpi.cpl !== null) {
			const delta = Math.abs(controlKpi.cpl - variantKpi.cpl) / controlKpi.cpl;
			if (delta >= 0.1) {
				winner = variantKpi.cpl < controlKpi.cpl ? "variant" : "control";
			}
		}
		return {
			controlName: control.campaignName,
			variantName: variant.campaignName,
			control: controlKpi,
			variant: variantKpi,
			winner,
		};
	}

	if (!loaded) return null;

	if (campaigns.length === 0) {
		return (
			<div className="text-gray-400">
				<h1 className="text-2xl font-bold text-white mb-4">A/B 테스트</h1>
				<p>아직 업로드된 데이터가 없습니다.</p>
				<p className="text-sm text-gray-600 mt-1">
					캠페인 CSV를 업로드하면 여기서 성과를 비교할 수 있습니다.
				</p>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">A/B 테스트</h1>

			{/* ── Auto-detected ── */}
			{autoPairs.length > 0 && (
				<section className="mb-8">
					<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
						자동 감지 ({autoPairs.length}쌍)
					</h2>
					<div className="flex flex-col gap-5">
						{autoPairs.map((pair, i) => (
							<PairCard key={i} pair={pair} />
						))}
					</div>
				</section>
			)}

			{/* ── Manual comparison ── */}
			<section className="mb-8">
				<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
					직접 비교
				</h2>
				<div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
					<div className="grid grid-cols-2 gap-3 mb-3">
						<div>
							<label className="text-xs text-gray-500 mb-1 block">
								A안 (컨트롤)
							</label>
							<select
								className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
								value={controlIdx}
								onChange={(e) => {
									setControlIdx(Number(e.target.value));
									setManualPair(null);
								}}
							>
								<option value={-1}>— 선택 —</option>
								{campaigns.map((c, i) => (
									<option key={i} value={i}>
										{c.campaignName}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="text-xs text-gray-500 mb-1 block">
								B안 (변형)
							</label>
							<select
								className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
								value={variantIdx}
								onChange={(e) => {
									setVariantIdx(Number(e.target.value));
									setManualPair(null);
								}}
							>
								<option value={-1}>— 선택 —</option>
								{campaigns.map((c, i) => (
									<option key={i} value={i}>
										{c.campaignName}
									</option>
								))}
							</select>
						</div>
					</div>
					<button
						onClick={() =>
							setManualPair(buildManualPair(controlIdx, variantIdx))
						}
						disabled={
							controlIdx < 0 || variantIdx < 0 || controlIdx === variantIdx
						}
						className="w-full py-2 rounded-lg bg-gold text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
					>
						비교하기
					</button>
				</div>
				{manualPair && <ManualPairCard pair={manualPair} />}
			</section>

			{/* ── Campaign list ── */}
			<section>
				<h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
					로드된 캠페인 ({campaigns.length}개)
				</h2>
				<div className="flex flex-col gap-2">
					{[...campaigns]
						.sort((a, b) => {
							const aCpl = a.leads > 0 ? a.spend / a.leads : Infinity;
							const bCpl = b.leads > 0 ? b.spend / b.leads : Infinity;
							return aCpl - bCpl;
						})
						.map((c, i) => {
							const cpl = c.leads > 0 ? c.spend / c.leads : null;
							return (
								<div
									key={i}
									className="bg-[#1a1a1a] rounded-lg px-4 py-2.5 flex items-center justify-between text-sm"
								>
									<span className="text-white">{c.campaignName}</span>
									<span className="text-gray-500 font-mono">
										{krw(cpl)} CPL · {c.leads}건 리드
									</span>
								</div>
							);
						})}
				</div>
			</section>
		</div>
	);
}
