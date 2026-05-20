import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "상담 신청 완료 | 소옴크리에이티브 인턴10000",
	description: "상담 신청이 완료되었습니다. 24시간 내에 연락드리겠습니다.",
	robots: "noindex",
};

export default function ThankyouPage() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-black text-white">
			<div className="max-w-md w-full">
				<p
					className="font-[family-name:var(--font-clash)] text-6xl md:text-7xl font-medium mb-6"
					style={{
						background:
							"linear-gradient(135deg, #ff3bff, #5c24ff, #d94fd5)",
						WebkitBackgroundClip: "text",
						backgroundClip: "text",
						color: "transparent",
					}}
				>
					Done.
				</p>
				<h1 className="font-[family-name:var(--font-clash)] font-medium text-3xl md:text-4xl mb-4 leading-tight">
					상담 신청이
					<br />
					완료되었습니다
				</h1>
				<p className="font-[family-name:var(--font-cabinet)] text-base text-white/60 mb-10 leading-relaxed">
					신청해 주셔서 감사합니다.
					<br />
					24시간 내 담당자가 연락드리겠습니다.
				</p>
				<Link href="/intern10000" className="cta-capsule cta-capsule-magenta">
					처음으로 돌아가기
				</Link>
			</div>
		</main>
	);
}
