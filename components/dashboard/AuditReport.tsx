"use client";

import type {
	AuditFinding,
	AuditGrade,
	AuditLevel,
	AuditReport as AuditReportType,
} from "@/lib/dashboard/types";

function krw(n: number) {
	return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}

function gradeColor(grade: AuditGrade) {
	if (grade === "A") return "text-ok";
	if (grade === "B") return "text-ok";
	if (grade === "C") return "text-warning";
	if (grade === "D") return "text-critical";
	return "text-critical";
}

function scoreColor(score: number) {
	if (score >= 70) return "bg-ok";
	if (score >= 40) return "bg-warning";
	return "bg-critical";
}

function levelBadge(level: AuditLevel) {
	if (level === "critical")
		return (
			<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-critical/20 text-critical">
				FAIL
			</span>
		);
	if (level === "warning")
		return (
			<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warning/20 text-warning">
				경고
			</span>
		);
	return (
		<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ok/20 text-ok">
			PASS
		</span>
	);
}

function FindingRow({ f }: { f: AuditFinding }) {
	return (
		<div className="flex items-start gap-3 py-2.5 border-b border-[#2a2a2a] last:border-0">
			<div className="mt-0.5">{levelBadge(f.level)}</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm text-white font-medium">{f.title}</p>
				<p className="text-xs text-gray-500 mt-0.5">{f.detail}</p>
			</div>
		</div>
	);
}

interface Props {
	report: AuditReportType;
}

export default function AuditReport({ report }: Props) {
	const generatedDate = report.generatedAt.slice(0, 10);

	return (
		<section className="mt-10 border-t border-[#2a2a2a] pt-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-bold text-white">AI 광고 진단 보고서</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						분석 기간: {report.period} · 생성일: {generatedDate}
					</p>
				</div>
			</div>

			{/* Health Score + Categories */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{/* Health Score */}
				<div className="bg-[#1a1a1a] rounded-xl p-5 flex items-center gap-5">
					<div className="relative flex items-center justify-center w-20 h-20 shrink-0">
						<svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
							<circle
								cx="40"
								cy="40"
								r="32"
								fill="none"
								stroke="#2a2a2a"
								strokeWidth="8"
							/>
							<circle
								cx="40"
								cy="40"
								r="32"
								fill="none"
								stroke={
									report.healthScore >= 70
										? "var(--color-ok, #22c55e)"
										: report.healthScore >= 40
											? "var(--color-warning, #eab308)"
											: "var(--color-critical, #ef4444)"
								}
								strokeWidth="8"
								strokeDasharray={`${(report.healthScore / 100) * 201} 201`}
								strokeLinecap="round"
							/>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center">
							<span className="text-xl font-bold text-white leading-none">
								{report.healthScore}
							</span>
							<span
								className={`text-sm font-bold leading-none mt-0.5 ${gradeColor(report.grade)}`}
							>
								{report.grade}
							</span>
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs text-gray-500 mb-1">Health Score</p>
						<p className="text-sm text-gray-300 leading-snug">
							{report.summary}
						</p>
					</div>
				</div>

				{/* Category scores */}
				<div className="bg-[#1a1a1a] rounded-xl p-5 space-y-3">
					{Object.values(report.categories).map((cat) => (
						<div key={cat.label}>
							<div className="flex justify-between text-xs mb-1">
								<span className="text-gray-400">{cat.label}</span>
								<span className="text-white font-mono">{cat.score}</span>
							</div>
							<div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all ${scoreColor(cat.score)}`}
									style={{ width: `${cat.score}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Quick Wins */}
			{report.quickWins.length > 0 && (
				<div className="bg-[#1a1a1a] rounded-xl p-5 mb-4">
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
						즉시 조치 (Quick Wins)
					</h3>
					<div className="space-y-2">
						{report.quickWins.map((w) => (
							<div
								key={w.priority}
								className="flex items-start gap-3 bg-[#111] rounded-lg p-3"
							>
								<span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded shrink-0">
									#{w.priority}
								</span>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-white">{w.action}</p>
									<p className="text-xs text-ok mt-0.5">{w.impact}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Kill List + Scaling in 2 cols */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				{/* Kill List */}
				{report.killList.length > 0 && (
					<div className="bg-[#1a1a1a] rounded-xl p-5">
						<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
							종료 권장
						</h3>
						<div className="space-y-2">
							{report.killList.map((k) => (
								<div key={k.name} className="bg-critical/5 rounded-lg p-3">
									<p className="text-sm text-white font-medium">{k.name}</p>
									<p className="text-xs text-gray-500 mt-0.5">{k.reason}</p>
									<p className="text-xs text-critical mt-1">
										낭비 예산: {krw(k.wastedSpend)}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Scaling Opportunities */}
				{report.scalingOpportunities.length > 0 && (
					<div className="bg-[#1a1a1a] rounded-xl p-5">
						<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
							확장 기회
						</h3>
						<div className="space-y-2">
							{report.scalingOpportunities.map((s) => (
								<div key={s.name} className="bg-ok/5 rounded-lg p-3">
									<p className="text-sm text-white font-medium">{s.name}</p>
									<p className="text-xs text-gray-400 mt-0.5">
										{s.recommendation}
									</p>
									<p className="text-xs text-ok mt-1">{s.expectedImpact}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* A/B Conclusion */}
			{report.abConclusion && (
				<div className="bg-[#1a1a1a] rounded-xl p-5 mb-4">
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
						A/B 테스트 결론
					</h3>
					<div className="flex flex-col md:flex-row gap-4 items-start">
						<div className="flex gap-4">
							<div className="text-center">
								<p className="text-xs text-gray-500 mb-1">승자</p>
								<p className="text-sm font-bold text-ok">
									{report.abConclusion.winner}
								</p>
								<p className="text-xs text-gray-400 font-mono mt-0.5">
									CPL {krw(report.abConclusion.winnerCpl)}
								</p>
							</div>
							<div className="text-center">
								<p className="text-xs text-gray-500 mb-1">CPL 절감</p>
								<p className="text-2xl font-bold text-ok">
									{Math.round(report.abConclusion.cplReduction * 100)}%
								</p>
							</div>
						</div>
						<div className="flex-1 bg-[#111] rounded-lg p-3">
							<p className="text-sm text-gray-300">
								{report.abConclusion.recommendation}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Findings */}
			{report.findings.length > 0 && (
				<div className="bg-[#1a1a1a] rounded-xl p-5 mb-4">
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
						세부 진단 항목
					</h3>
					{report.findings.map((f, i) => (
						<FindingRow key={i} f={f} />
					))}
				</div>
			)}

			{/* Top Creatives */}
			{report.topCreatives.length > 0 && (
				<div className="bg-[#1a1a1a] rounded-xl p-5">
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
						최우수 소재
					</h3>
					<div className="space-y-2">
						{report.topCreatives.map((c, i) => (
							<div
								key={i}
								className="flex items-center gap-3 py-2 border-b border-[#2a2a2a] last:border-0"
							>
								<span className="text-xs text-gray-600 font-mono w-4">
									{i + 1}
								</span>
								<span
									className="flex-1 text-sm text-white truncate"
									title={c.name}
								>
									{c.name}
								</span>
								<span className="text-xs text-gray-400 font-mono">
									리드 {c.leads}건
								</span>
								<span className="text-xs text-ok font-mono">
									{c.cpl !== null ? krw(c.cpl) : "-"}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
