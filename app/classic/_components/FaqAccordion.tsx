"use client";

import { useState } from "react";

const FAQS = [
	{
		q: "경력이 짧아도 들을 수 있나요?",
		a: "네. 클래식코스는 커트 원리를 처음부터 체계적으로 배우는 과정입니다. 신입 디자이너나 학교를 갓 졸업한 분도 충분히 따라올 수 있도록 설계되어 있습니다. 오히려 잘못된 습관이 굳기 전에 시작하시는 분들이 더 빠르게 성장합니다.",
	},
	{
		q: "수업은 어디서 진행되나요?",
		a: "서울 내 소옴크리에이티브 전용 스튜디오에서 진행됩니다. 상담 신청 시 정확한 위치를 안내해 드립니다.",
	},
	{
		q: "결석하면 어떻게 되나요?",
		a: "불가피한 사정으로 결석 시, 사전 연락을 주시면 개별 보강 일정을 협의합니다. 소수정예 수업이라 가능한 방식입니다.",
	},
	{
		q: "수강료 분납이 가능한가요?",
		a: "네, 2회 분납이 가능합니다. 신청 시 분납 의사를 말씀해 주시면 상세히 안내해 드립니다.",
	},
	{
		q: "수업 후 어느 정도 달라지나요?",
		a: "커트의 원리와 구조를 이해하게 되어, 처음 보는 커트도 분석하고 재현할 수 있는 눈이 생깁니다. 수료생 평균적으로 수료 후 2~3개월 내 고객 재방문율과 추천 고객이 눈에 띄게 늘었다는 후기가 많습니다.",
	},
	{
		q: "지금 신청하면 언제부터 수업인가요?",
		a: "5월 11일(월) 개강 예정입니다. 선착순 마감이니 자리가 남아 있을 때 신청해 두시길 권장합니다.",
	},
];

export default function FaqAccordion() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
			{FAQS.map((faq, i) => (
				<div key={i}>
					<button
						className="w-full text-left px-6 py-5 flex justify-between items-center gap-3 font-semibold text-sm hover:bg-gray-50 transition-colors"
						onClick={() => setOpen(open === i ? null : i)}
					>
						{faq.q}
						<span className="text-gold text-xl flex-shrink-0">
							{open === i ? "−" : "+"}
						</span>
					</button>
					{open === i && (
						<div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
							{faq.a}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
