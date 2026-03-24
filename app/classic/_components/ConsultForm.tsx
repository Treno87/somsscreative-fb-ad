"use client";

import { useRouter } from "next/navigation";

export default function ConsultForm() {
	const router = useRouter();

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// TODO: Meta Pixel Lead event
		// fbq('track', 'Lead', { content_name: 'classic-consult' });
		router.push("/classic/thankyou");
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 max-w-md mx-auto text-left"
		>
			<input
				type="text"
				name="name"
				placeholder="이름"
				required
				className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gold"
			/>
			<input
				type="tel"
				name="phone"
				placeholder="연락처 (010-XXXX-XXXX)"
				required
				className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gold"
			/>
			<select
				name="question"
				className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gold bg-white"
			>
				<option value="">가장 궁금한 점을 선택해 주세요</option>
				<option>수업 난이도와 커리큘럼이 궁금해요</option>
				<option>수강료와 분납 방법이 궁금해요</option>
				<option>수업 위치와 일정이 궁금해요</option>
				<option>수료 후 어떻게 달라지는지 궁금해요</option>
			</select>
			<button
				type="submit"
				className="w-full py-4 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
			>
				자리 확인하기
			</button>
		</form>
	);
}
