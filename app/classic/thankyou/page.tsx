import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "상담 신청 완료 | 소옴크리에이티브",
	description: "상담 신청이 완료되었습니다. 24시간 내에 연락드리겠습니다.",
	robots: "noindex",
};

export default function ThankyouPage() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
			<div className="max-w-md w-full">
				<p className="text-5xl mb-6">🎉</p>
				<h1 className="text-3xl font-black mb-3">상담 신청 완료!</h1>
				<p className="text-gray-500 mb-8 leading-relaxed">
					신청해 주셔서 감사합니다.
					<br />
					24시간 내 담당자가 연락드리겠습니다.
				</p>
				<Link
					href="/classic"
					className="inline-block px-6 py-3 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
				>
					처음으로 돌아가기
				</Link>
			</div>
		</main>
	);
}
