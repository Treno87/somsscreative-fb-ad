"use client";

import type {
	AuditCampaignVerdict,
	AuditReport as AuditReportType,
	CampaignAction,
} from "@/lib/dashboard/types";

function krw(n: number | null) {
	if (n === null) return "-";
	return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}

// 권장 조치별 표기 (색·라벨)
const ACTION: Record<
	CampaignAction,
	{ label: string; chip: string; bar: string; rank: number }
> = {
	kill: {
		label: "중단",
		chip: "bg-critical/15 text-critical border-critical/40",
		bar: "bg-critical",
		rank: 0,
	},
	reduce: {
		label: "축소 ↓",
		chip: "bg-warning/15 text-warning border-warning/40",
		bar: "bg-warning",
		rank: 1,
	},
	watch: {
		label: "점검",
		chip: "bg-gold/15 text-gold border-gold/40",
		bar: "bg-gold",
		rank: 2,
	},
	maintain: {
		label: "유지",
		chip: "bg-ok/15 text-ok border-ok/40",
		bar: "bg-ok",
		rank: 3,
	},
	scale: {
		label: "증액 ↑",
		chip: "bg-ok/15 text-ok border-ok/40",
		bar: "bg-ok",
		rank: 4,
	},
};

const BAR_MAX = 2.5; // 목표의 2.5배에서 막대 가득 참
const TARGET_POS = (1 / BAR_MAX) * 100; // 목표선 위치(%)

function gradeColor(grade: string) {
	if (grade === "A" || grade === "B") return "text-ok border-ok";
	if (grade === "C") return "text-gold border-gold";
	return "text-critical border-critical";
}

// 목표 CPL 기준선이 그려진 막대. 목표선(┃) 대비 현재 CPL 위치를 보여준다.
function TargetBar({ v }: { v: AuditCampaignVerdict }) {
	const ratio = v.cplVsTarget;
	const fillPct =
		ratio === null ? 100 : (Math.min(ratio, BAR_MAX) / BAR_MAX) * 100;
	const fillColor = ACTION[v.action].bar;
	return (
		<div className="relative h-2 rounded-full bg-[#2a2a2a] overflow-visible">
			<div
				className={`absolute inset-y-0 left-0 rounded-full ${fillColor}`}
				style={{ width: `${fillPct}%` }}
			/>
			{/* 목표선 */}
			<div
				className="absolute -top-1 -bottom-1 w-0.5 bg-gray-300"
				style={{ left: `${TARGET_POS}%` }}
				title="목표 CPL"
			/>
		</div>
	);
}

function VerdictCard({
	v,
	targetCpl,
}: {
	v: AuditCampaignVerdict;
	targetCpl: number;
}) {
	const a = ACTION[v.action];
	return (
		<div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
			<div className="flex items-start justify-between gap-3 mb-2">
				<p className="text-sm font-semibold text-white leading-snug break-all">
					{v.name}
				</p>
				<span
					className={`shrink-0 text-xs font-bold px-2 py-1 rounded border ${a.chip}`}
				>
					{a.label}
				</span>
			</div>
			<div className="flex items-baseline gap-2 mb-2 text-xs text-gray-400">
				<span className="text-base font-bold text-white">{krw(v.cpl)}</span>
				<span>
					{v.cplVsTarget !== null
						? `목표 ${krw(targetCpl)}의 ${v.cplVsTarget.toFixed(2)}배`
						: `리드 0건`}
				</span>
				<span className="ml-auto">
					지출 {krw(v.spend)} · 리드 {v.leads}건
				</span>
			</div>
			<TargetBar v={v} />
			<p className="text-xs text-gray-400 mt-3 leading-relaxed">{v.reason}</p>
		</div>
	);
}

interface Props {
	report: AuditReportType;
	selectedWeek?: string;
}

export default function DecisionPanel({ report, selectedWeek }: Props) {
	const stale = Boolean(
		selectedWeek && !report.period.includes(selectedWeek),
	);
	const verdicts = [...report.campaignVerdicts].sort(
		(x, y) => ACTION[x.action].rank - ACTION[y.action].rank,
	);
	const todos = report.quickWins.slice(0, 3);

	return (
		<section className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5">
			{/* 판정 헤더 */}
			<div className="flex items-center gap-4 mb-1">
				<div
					className={`flex items-center justify-center w-14 h-14 shrink-0 rounded-full border-2 ${gradeColor(report.grade)}`}
				>
					<span className="text-2xl font-black">{report.grade}</span>
				</div>
				<div className="min-w-0">
					<h2 className="text-base font-bold text-white">
						이번 주 진단 · {report.healthScore}점
					</h2>
					<p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
						{report.summary}
					</p>
				</div>
			</div>

			{stale && (
				<div className="mt-3 rounded-lg border border-critical/40 bg-critical/10 px-3 py-2 text-xs text-critical">
					⚠ 이 진단은 {report.period} 기준이라 현재 선택 주차({selectedWeek})와
					다릅니다. 업로드 화면에서 “Meta에서 동기화”를 실행하면 갱신됩니다.
				</div>
			)}

			{/* 이번 주 할 일 */}
			{todos.length > 0 && (
				<div className="mt-5">
					<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
						이번 주 할 일 — 우선순위
					</h3>
					<ol className="space-y-1.5">
						{todos.map((t) => (
							<li
								key={t.priority}
								className="flex items-start gap-3 bg-[#1a1a1a] rounded-lg px-3 py-2.5"
							>
								<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold">
									{t.priority}
								</span>
								<div className="min-w-0">
									<p className="text-sm text-white leading-snug">{t.action}</p>
									<p className="text-xs text-ok mt-0.5">{t.impact}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			)}

			{/* 캠페인별 권장 조치 */}
			{verdicts.length > 0 && (
				<div className="mt-5">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
							캠페인별 권장 조치
						</h3>
						<span className="text-xs text-gray-600">
							목표 CPL {krw(report.targetCpl)} 기준
						</span>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
						{verdicts.map((v) => (
							<VerdictCard key={v.name} v={v} targetCpl={report.targetCpl} />
						))}
					</div>
				</div>
			)}

			{/* 판단 기준 범례 */}
			<div className="mt-5 pt-4 border-t border-[#2a2a2a]">
				<p className="text-xs text-gray-500 leading-relaxed">
					<span className="font-semibold text-gray-400">판단 기준</span> · 목표
					CPL {krw(report.targetCpl)}(흰 세로선) 기준 —{" "}
					<span className="text-ok">증액</span> 0.6배 미만 ·{" "}
					<span className="text-ok">유지</span> 목표 이내 ·{" "}
					<span className="text-gold">점검</span> 1.5배 이내 ·{" "}
					<span className="text-warning">축소</span> 1.5배 초과 ·{" "}
					<span className="text-critical">중단</span> 리드 0건
				</p>
			</div>
		</section>
	);
}
