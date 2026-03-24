"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { computeTrendPoints } from "@/lib/dashboard/analytics";
import { getWeekSnapshot, listWeeks } from "@/lib/dashboard/storage";
import type { TrendPoint } from "@/lib/dashboard/types";

export default function TrendsPage() {
	const [points, setPoints] = useState<TrendPoint[]>([]);

	useEffect(() => {
		const weeks = listWeeks();
		const snapshots = weeks
			.map((w) => getWeekSnapshot(w))
			.filter(Boolean) as NonNullable<ReturnType<typeof getWeekSnapshot>>[];
		setPoints(computeTrendPoints(snapshots));
	}, []);

	if (points.length < 2) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-gray-400">
				<p>트렌드 분석에는 2주 이상의 데이터가 필요합니다</p>
				<a
					href="/dashboard/upload"
					className="text-gold hover:underline text-sm mt-2"
				>
					데이터 추가하기 →
				</a>
			</div>
		);
	}

	const chartData = points.map((p) => ({
		week: p.week.replace("2026-", ""),
		CPL: p.cpl ?? 0,
		CTR: p.ctr ? +(p.ctr * 100).toFixed(2) : 0,
		지출: p.spend,
		리드: p.leads,
	}));

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">주차별 트렌드</h1>

			<div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
				<p className="text-sm text-gray-400 mb-4">
					CPL (리드당 비용) & CTR 추이
				</p>
				<ResponsiveContainer width="100%" height={260}>
					<ComposedChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#333" />
						<XAxis dataKey="week" tick={{ fill: "#888", fontSize: 12 }} />
						<YAxis
							yAxisId="left"
							tick={{ fill: "#888", fontSize: 12 }}
							tickFormatter={(v) => `₩${(v / 1000).toFixed(0)}K`}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fill: "#888", fontSize: 12 }}
							tickFormatter={(v) => `${v}%`}
						/>
						<Tooltip
							contentStyle={{
								background: "#222",
								border: "1px solid #444",
								borderRadius: 8,
							}}
							formatter={(value, name) => {
								if (name === "CPL")
									return [`₩${Number(value).toLocaleString("ko-KR")}`, "CPL"];
								if (name === "CTR") return [`${value}%`, "CTR"];
								return [value, name];
							}}
						/>
						<Legend />
						<Bar yAxisId="left" dataKey="CPL" fill="#b8963e" opacity={0.8} />
						<Line
							yAxisId="right"
							dataKey="CTR"
							stroke="#22c55e"
							strokeWidth={2}
							dot={{ fill: "#22c55e" }}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>

			<div className="bg-[#1a1a1a] rounded-xl p-4">
				<p className="text-sm text-gray-400 mb-4">주차별 지출 & 리드</p>
				<ResponsiveContainer width="100%" height={200}>
					<ComposedChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#333" />
						<XAxis dataKey="week" tick={{ fill: "#888", fontSize: 12 }} />
						<YAxis
							yAxisId="left"
							tick={{ fill: "#888", fontSize: 12 }}
							tickFormatter={(v) => `₩${(v / 1000).toFixed(0)}K`}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fill: "#888", fontSize: 12 }}
						/>
						<Tooltip
							contentStyle={{
								background: "#222",
								border: "1px solid #444",
								borderRadius: 8,
							}}
						/>
						<Legend />
						<Bar yAxisId="left" dataKey="지출" fill="#6366f1" opacity={0.8} />
						<Bar yAxisId="right" dataKey="리드" fill="#22c55e" opacity={0.8} />
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
