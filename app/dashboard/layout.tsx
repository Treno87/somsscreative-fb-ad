import type { Metadata } from "next";
import DashboardNav from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
	title: "SOMSS 광고 대시보드",
	robots: "noindex, nofollow",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-dashboard-bg text-white flex">
			<DashboardNav />
			<main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
				{children}
			</main>
		</div>
	);
}
