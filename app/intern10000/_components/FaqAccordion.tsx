"use client";

import { useState } from "react";

const FAQS = [
	{
		q: "디자이너 승급 전에 받아도 늦지 않나요?",
		a: "오히려 승급 전이 가장 좋은 타이밍입니다. 잘못된 습관이 굳기 전에 구조부터 잡으면 데뷔 후 시술 시간과 자신감이 다릅니다.",
	},
	{
		q: "현장 일과 병행 가능한가요?",
		a: "회당 3시간 14회차로 설계되어 살롱 근무와 병행 가능합니다. 매주 300분 자가 훈련을 권장하며, 소수정예라 불가피한 결석 시 개별 보강 협의 가능합니다.",
	},
	{
		q: "1년차인데 따라갈 수 있을까요?",
		a: "1회차 SOMSS Hair Cut Theory부터 시작합니다. 어깨너머 경험만 있어도 도해도 학습과 실습이 단계적으로 쌓이기 때문에 충분히 따라옵니다.",
	},
	{
		q: "수강료가 부담스러워요.",
		a: "20% 선납으로 기수 확정 후 잔여 수강료를 개강 전까지 납부할 수 있어 부담을 분산합니다. 단발성 워크숍 4~5회 비용 수준에서 14회 × 3시간 + 매주 실전 훈련이 진행됩니다.",
	},
	{
		q: "이론만 많은 거 아닌가요?",
		a: "14회차 중 12회차가 DEMO + WORKSHOP 실습입니다. 도해도 학습은 손이 정확해지기 위한 도구일 뿐, 메인은 가위질입니다.",
	},
	{
		q: "클래식코스와 다른 점은?",
		a: "클래식코스는 경력 3~7년 디자이너의 심화 과정입니다. 인턴10000은 인턴~경력 2년 미만의 기초 보강이 목표 — LINE·GRADUATION·LAYER 베이직을 14회차로 더 천천히, 더 단단히 다집니다.",
	},
];

export default function FaqAccordion() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<div className="flex flex-col gap-3">
			{FAQS.map((faq, i) => {
				const isOpen = open === i;
				return (
					<div
						key={faq.q}
						className={`rounded-2xl border transition-colors ${
							isOpen
								? "border-white/30 bg-white/[0.04]"
								: "border-white/10 bg-white/[0.02] hover:border-white/20"
						}`}
					>
						<button
							type="button"
							className="w-full text-left px-6 md:px-8 py-6 flex justify-between items-center gap-4 font-[family-name:var(--font-cabinet)] font-medium text-base md:text-lg text-white"
							onClick={() => setOpen(isOpen ? null : i)}
						>
							{faq.q}
							<span
								className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform"
								style={{
									background: isOpen
										? "linear-gradient(135deg, #ff3bff, #5c24ff)"
										: "transparent",
									border: isOpen ? "0" : "1px solid rgba(255,255,255,0.2)",
									transform: isOpen ? "rotate(45deg)" : "rotate(0)",
								}}
							>
								+
							</span>
						</button>
						{isOpen && (
							<div className="px-6 md:px-8 pb-6 font-[family-name:var(--font-cabinet)] text-sm md:text-base text-white/70 leading-relaxed">
								{faq.a}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
