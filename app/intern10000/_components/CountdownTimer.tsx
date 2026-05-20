"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

// TODO: 인턴10000 1기 개강일 확정 시 변경 (현재 placeholder: 2026-06-15)
const TARGET = new Date("2026-06-15T10:30:00+09:00");

function calcTimeLeft(): TimeLeft {
	const diff = TARGET.getTime() - Date.now();
	if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	return {
		days: Math.floor(diff / (1000 * 60 * 60 * 24)),
		hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
		minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((diff % (1000 * 60)) / 1000),
	};
}

export default function CountdownTimer() {
	const [time, setTime] = useState<TimeLeft>(calcTimeLeft);

	useEffect(() => {
		const id = setInterval(() => setTime(calcTimeLeft()), 1000);
		return () => clearInterval(id);
	}, []);

	const pad = (n: number) => String(n).padStart(2, "0");
	const units = [
		{ label: "DAYS", value: time.days },
		{ label: "HRS", value: time.hours },
		{ label: "MIN", value: time.minutes },
		{ label: "SEC", value: time.seconds },
	];

	return (
		<div className="flex justify-center gap-3 md:gap-4">
			{units.map(({ label, value }) => (
				<div
					key={label}
					className="text-center rounded-2xl px-4 md:px-6 py-3 md:py-4 min-w-[72px] md:min-w-[88px] border border-white/15 bg-white/[0.03]"
				>
					<span
						className="block text-3xl md:text-4xl font-[family-name:var(--font-clash)] font-medium leading-none mb-1"
						style={{
							background:
								"linear-gradient(135deg, #ff3bff, #5c24ff)",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}
					>
						{pad(value)}
					</span>
					<span className="font-[family-name:var(--font-space)] text-[10px] md:text-[11px] text-white/40 tracking-[0.2em]">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
