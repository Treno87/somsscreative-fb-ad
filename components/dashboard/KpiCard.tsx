type KpiStatus = "ok" | "warning" | "critical";

interface KpiCardProps {
	label: string;
	value: string;
	unit?: string;
	delta?: number;
	isInvertedDelta?: boolean;
	status?: KpiStatus;
}

const statusColor: Record<KpiStatus, string> = {
	ok: "text-ok",
	warning: "text-warning",
	critical: "text-critical",
};

export default function KpiCard({
	label,
	value,
	unit,
	delta,
	isInvertedDelta = false,
	status,
}: KpiCardProps) {
	const hasDelta = delta !== undefined && delta !== null;

	const isPositive = (delta ?? 0) > 0;
	// For CPL: positive delta = bad (red). For CTR: positive delta = good (green).
	const isGood = isInvertedDelta ? isPositive : !isPositive;
	const colorClass = isGood ? "text-ok" : "text-critical";
	const arrow = isPositive ? "▲" : "▼";

	const valueColor = status ? statusColor[status] : "text-white";

	return (
		<div className="rounded-lg bg-[#1a1a1a] p-2.5 flex flex-col gap-0.5">
			<span className="text-[10px] text-gray-400 uppercase tracking-wide">
				{label}
			</span>
			<div className="flex items-end gap-1">
				<span className={`text-sm font-bold ${valueColor}`}>{value}</span>
				{unit && (
					<span className="text-[10px] text-gray-400 mb-0.5">{unit}</span>
				)}
			</div>
			{hasDelta && (
				<span
					data-testid="delta-badge"
					className={`text-xs font-medium ${colorClass}`}
				>
					{arrow} {Math.abs(delta!).toFixed(1)}%
				</span>
			)}
		</div>
	);
}
