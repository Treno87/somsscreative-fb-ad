"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
	{ href: "/dashboard/upload", label: "업로드", icon: "📤" },
	{ href: "/dashboard/overview", label: "개요", icon: "📊" },
	{ href: "/dashboard/trends", label: "트렌드", icon: "📈" },
	{ href: "/dashboard/ab-test", label: "A/B", icon: "🔬" },
	{ href: "/dashboard/fatigue", label: "피로도", icon: "⚠️" },
];

export default function DashboardNav({
	currentWeek,
}: {
	currentWeek?: string;
}) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile: bottom tab bar */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-gray-800 flex">
				{TABS.map((tab) => {
					const isActive = pathname.startsWith(tab.href);
					return (
						<Link
							key={tab.href}
							href={tab.href}
							className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors
                ${isActive ? "text-gold" : "text-gray-500 hover:text-gray-300"}`}
						>
							<span>{tab.icon}</span>
							<span>{tab.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Desktop: left sidebar */}
			<aside className="hidden md:flex flex-col w-52 shrink-0 bg-[#111] border-r border-gray-800 min-h-screen p-4 gap-1">
				<div className="mb-4">
					<div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
						SOMSS 대시보드
					</div>
					{currentWeek && (
						<div className="text-xs text-gold font-mono">{currentWeek}</div>
					)}
				</div>
				{TABS.map((tab) => {
					const isActive = pathname.startsWith(tab.href);
					return (
						<Link
							key={tab.href}
							href={tab.href}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive ? "bg-gold/10 text-gold" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
						>
							<span>{tab.icon}</span>
							<span>{tab.label}</span>
						</Link>
					);
				})}
			</aside>
		</>
	);
}
