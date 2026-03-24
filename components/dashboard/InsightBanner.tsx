"use client";

import { useState } from "react";
import type { InsightMessage } from "@/lib/dashboard/types";

const LEVEL_STYLES: Record<InsightMessage["level"], string> = {
	info: "bg-blue-900/40 border-blue-500 text-blue-200",
	warning: "bg-yellow-900/40 border-yellow-500 text-yellow-200",
	critical: "bg-red-900/40 border-red-500 text-red-200",
};

interface InsightBannerProps {
	insights: InsightMessage[];
}

export default function InsightBanner({ insights }: InsightBannerProps) {
	const [dismissed, setDismissed] = useState<Set<number>>(new Set());

	const visible = insights.filter((_, i) => !dismissed.has(i));
	if (visible.length === 0) return null;

	return (
		<div className="flex flex-col gap-2 mb-6">
			{insights.map((insight, i) => {
				if (dismissed.has(i)) return null;
				return (
					<div
						key={i}
						className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${LEVEL_STYLES[insight.level]}`}
					>
						<span>{insight.text}</span>
						<button
							onClick={() => setDismissed((prev) => new Set([...prev, i]))}
							className="ml-4 opacity-60 hover:opacity-100 text-lg leading-none"
							aria-label="닫기"
						>
							×
						</button>
					</div>
				);
			})}
		</div>
	);
}
