"use client";

import { useRouter } from "next/navigation";

export default function ConsultForm() {
	const router = useRouter();

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// TODO: Meta Pixel Lead event
		// fbq('track', 'Lead', { content_name: 'intern10000-consult' });
		router.push("/intern10000/thankyou");
	}

	const inputCls =
		"w-full px-5 py-4 bg-white/5 border border-white/15 rounded-xl text-base text-white placeholder-white/30 focus:outline-none focus:border-magenta focus:bg-white/[0.08] transition-colors";

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 max-w-xl mx-auto text-left"
		>
			<input
				type="text"
				name="name"
				placeholder="이름"
				required
				className={inputCls}
			/>
			<input
				type="tel"
				name="phone"
				placeholder="연락처 (010-XXXX-XXXX)"
				required
				className={inputCls}
			/>
			<select
				name="status"
				className={`${inputCls} appearance-none cursor-pointer`}
				defaultValue=""
				required
			>
				<option value="" disabled className="bg-black text-white/30">
					현재 단계를 선택해 주세요
				</option>
				<option className="bg-black">인턴 (승급 준비 중)</option>
				<option className="bg-black">초급 디자이너 (승급 직후~1년)</option>
				<option className="bg-black">경력 디자이너 (기초 보강 목적)</option>
				<option className="bg-black">기타</option>
			</select>
			<select
				name="question"
				className={`${inputCls} appearance-none cursor-pointer`}
				defaultValue=""
			>
				<option value="" disabled className="bg-black text-white/30">
					가장 궁금한 점을 선택해 주세요
				</option>
				<option className="bg-black">커리큘럼과 수업 난이도가 궁금해요</option>
				<option className="bg-black">수강료·분납 방법이 궁금해요</option>
				<option className="bg-black">개강일과 정원 잔여가 궁금해요</option>
				<option className="bg-black">현장 일과 병행 가능한지 궁금해요</option>
			</select>
			<button
				type="submit"
				className="cta-capsule cta-capsule-magenta mt-4 w-full"
			>
				자리 확인하기
			</button>
		</form>
	);
}
