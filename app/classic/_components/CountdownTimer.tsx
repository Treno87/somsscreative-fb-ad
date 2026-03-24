"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

// TODO: 개강일 확인 후 변경
const TARGET = new Date("2026-05-11T10:30:00+09:00");

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
		<div className="flex justify-center gap-3">
			{units.map(({ label, value }) => (
				<div
					key={label}
					className="text-center bg-white/10 rounded-lg px-4 py-3 min-w-[72px]"
				>
					<span className="block text-3xl font-black text-gold-light">
						{pad(value)}
					</span>
					<span className="text-[11px] text-white/50 tracking-widest">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
