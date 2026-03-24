"use client";

import { useEffect, useState } from "react";
import { detectCreativeFatigue } from "@/lib/dashboard/analytics";
import { getWeekSnapshot, listWeeks } from "@/lib/dashboard/storage";
import type { CreativeFatigue, FatigueStatus } from "@/lib/dashboard/types";

const STATUS_BADGE: Record<FatigueStatus, { label: string; class: string }> = {
	critical: {
		label: "심각",
		class: "bg-critical/20 text-critical border-critical/30",
	},
	warning: {
		label: "주의",
		class: "bg-warning/20 text-warning border-warning/30",
	},
	ok: { label: "정상", class: "bg-ok/20 text-ok border-ok/30" },
};

type Tab = "all" | FatigueStatus;

export default function FatiguePage() {
	const [fatigue, setFatigue] = useState<CreativeFatigue[]>([]);
	const [tab, setTab] = useState<Tab>("all");
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const weeks = listWeeks();
		if (weeks.length < 2) {
			setLoaded(true);
			return;
		}
		const curr = getWeekSnapshot(weeks[weeks.length - 1]);
		const prev = getWeekSnapshot(weeks[weeks.length - 2]);
		if (curr && prev) {
			const result = detectCreativeFatigue(curr.ads, prev.ads);
			result.sort((a, b) => b.ctrDropPct - a.ctrDropPct);
			setFatigue(result);
		}
		setLoaded(true);
	}, []);

	if (!loaded) return null;

	if (fatigue.length === 0) {
		return (
			<div className="text-gray-400">
				<h1 className="text-2xl font-bold text-white mb-4">소재 피로도</h1>
				<p>
					{listWeeks().length < 2
						? "피로도 분석에는 2주 이상의 데이터가 필요합니다."
						: "분석 가능한 광고가 없습니다."}
				</p>
				<a
					href="/dashboard/upload"
					className="text-gold hover:underline text-sm mt-2 inline-block"
				>
					데이터 추가하기 →
				</a>
			</div>
		);
	}

	const filtered =
		tab === "all" ? fatigue : fatigue.filter((f) => f.status === tab);
	const counts = {
		critical: fatigue.filter((f) => f.status === "critical").length,
		warning: fatigue.filter((f) => f.status === "warning").length,
		ok: fatigue.filter((f) => f.status === "ok").length,
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">소재 피로도</h1>

			{/* Tabs */}
			<div className="flex gap-2 mb-4 text-sm">
				{(["all", "critical", "warning", "ok"] as Tab[]).map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`px-3 py-1.5 rounded-lg border transition-colors ${
							tab === t
								? "border-gold text-gold"
								: "border-gray-700 text-gray-500 hover:text-gray-300"
						}`}
					>
						{t === "all"
							? `전체 (${fatigue.length})`
							: `${STATUS_BADGE[t as FatigueStatus].label} (${counts[t as FatigueStatus]})`}
					</button>
				))}
			</div>

			<div className="flex flex-col gap-2">
				{filtered.map((item, i) => {
					const badge = STATUS_BADGE[item.status];
					const isDropping = item.ctrDropPct > 0;
					return (
						<div
							key={i}
							className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between gap-4"
						>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-white font-medium truncate">
									{item.adName}
								</p>
								<p className="text-xs text-gray-500 truncate">
									{item.campaignName}
								</p>
							</div>
							<div className="text-right shrink-0">
								<p
									className={`text-sm font-mono font-bold ${isDropping ? "text-critical" : "text-ok"}`}
								>
									{isDropping ? "▼" : "▲"} {(item.ctrDropPct * 100).toFixed(1)}%
								</p>
								<p className="text-xs text-gray-500">
									{(item.previousCtr * 100).toFixed(2)}% →{" "}
									{(item.currentCtr * 100).toFixed(2)}%
								</p>
							</div>
							<span
								className={`text-xs px-2 py-1 rounded border shrink-0 ${badge.class}`}
							>
								{badge.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
