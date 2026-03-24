import type { Metadata } from "next";
import ConsultForm from "./_components/ConsultForm";
import CountdownTimer from "./_components/CountdownTimer";
import FaqAccordion from "./_components/FaqAccordion";

export const metadata: Metadata = {
	title: "배웠는데 왜 안 느는 걸까요 — 소옴 클래식코스",
	description:
		"여러 번 수업을 들어도 실력이 제자리라면, 스타일이 아닌 커트 자체를 배운 게 아닙니다. 클래식코스는 커트의 원리와 구조를 처음부터 가르칩니다. 7명 소수정예 · 5월 18일 개강.",
	robots: "index, follow",
	openGraph: {
		title: "배웠는데 왜 안 느는 걸까요 | 소옴크리에이티브 클래식코스",
		description:
			"다른 학원은 스타일을 가르칩니다. 소옴 클래식코스는 커트 자체를 가르칩니다. 한 번 이해한 구조는 어떤 커트에도 통합니다.",
		type: "website",
		locale: "ko_KR",
		siteName: "소옴크리에이티브",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Course",
	name: "소옴크리에이티브 헤어커트 클래식코스",
	description:
		"런던 비달사순 TTC 수료 강사에게 배우는 헤어커트 기초 원리 8주 마스터클래스. 7명 소수정예.",
	provider: {
		"@type": "Organization",
		name: "소옴크리에이티브",
		url: "https://somsscreative.com",
	},
	courseMode: "onsite",
	numberOfCredits: 8,
	offers: {
		"@type": "Offer",
		price: "1600000",
		priceCurrency: "KRW",
		availability: "https://schema.org/LimitedAvailability",
	},
};

const CURRICULUM = [
	{ week: 1, title: "커트의 기초 원리", desc: "섹션, 라인, 각도의 개념 이해" },
	{
		week: 2,
		title: "원랭스 & 그래쥬에이션",
		desc: "기본형 커트 구조 분석 및 실습",
	},
	{ week: 3, title: "레이어드 커트 원리", desc: "레이어 분배와 텍스처 이해" },
	{ week: 4, title: "얼굴형에 따른 디자인", desc: "형태와 실루엣 조절 방법" },
	{
		week: 5,
		title: "응용 커트 실습 I",
		desc: "배운 원리를 조합한 응용 스타일링",
	},
	{ week: 6, title: "응용 커트 실습 II", desc: "고객 모발 유형별 대응 전략" },
	{
		week: 7,
		title: "리빌드 & 수정 테크닉",
		desc: "틀린 커트를 살리는 수정 기술",
	},
	{ week: 8, title: "최종 종합 실습", desc: "처음부터 끝까지 혼자 완성하기" },
];

const TESTIMONIALS = [
	{
		id: "56기",
		name: "김지원",
		role: "강남 살롱 3년차",
		quote:
			"3년을 잘랐는데 왜 안 되는지 몰랐어요. 원리를 배우니까 눈앞이 트이는 느낌이었습니다.",
	},
	{
		id: "54기",
		name: "박성훈",
		role: "프리랜서 헤어디자이너",
		quote:
			"단골이 3명에서 11명으로 늘었고, 수강료를 한 달 만에 회수했어요. ROI가 확실한 수업입니다.",
	},
	{
		id: "58기",
		name: "이수빈",
		role: "신입 1년차",
		quote: "고객 앞에서 항상 긴장했는데, 이제 자신 있게 가위를 잡을 수 있어요.",
	},
];

export default function ClassicPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* ── HERO ── */}
			<section className="bg-brand-black text-white px-5 pt-16 pb-14 text-center">
				<p className="text-gold text-xs tracking-[0.2em] uppercase mb-4 font-semibold">
					런던 비달사순 출신 · 36년 경력 마스터
				</p>
				<h1 className="text-4xl font-black leading-tight mb-4">
					배웠는데
					<br />왜 안 느는
					<br />
					걸까요
				</h1>
				<p className="text-white/70 text-base leading-relaxed mb-8 max-w-xs mx-auto">
					여러 번 수업을 들어도 실력이 제자리라면 —<br />
					스타일을 배운 것이지, 커트를 배운 게 아닙니다.
					<br />
					클래식코스는 커트의 원리와 구조를 처음부터 가르칩니다.
				</p>

				<div className="mb-8">
					<CountdownTimer />
					<p className="text-white/40 text-xs mt-3">5월 개강까지 남은 시간</p>
				</div>

				<div className="flex flex-col gap-3 max-w-xs mx-auto">
					<a
						href="#consult"
						className="block w-full py-4 bg-gold text-white font-bold rounded-lg text-base hover:opacity-90 transition-opacity"
					>
						무료 상담 신청
					</a>
					<a
						href="#pricing"
						className="block w-full py-4 border border-white/30 text-white font-semibold rounded-lg text-base hover:bg-white/5 transition-colors"
					>
						수강 정보 보기
					</a>
				</div>
			</section>

			{/* ── PAIN POINTS ── */}
			<section className="px-5 py-14 bg-white">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Why Classic
				</p>
				<h2 className="text-2xl font-black text-center mb-10 leading-snug">
					수업을 들어도
					<br />
					실력이 안 느는 이유
				</h2>
				<ul className="flex flex-col gap-5 max-w-sm mx-auto">
					{[
						{
							icon: "✗",
							title: "배운 스타일 말고는 못하겠어요",
							desc: "한 스타일씩 외워서 배웠기 때문입니다. 원리를 배우지 않으면 응용이 없습니다.",
						},
						{
							icon: "✗",
							title: "다른 커트는 여전히 아무것도 몰라요",
							desc: "스타일 하나를 배워도 그 체계를 모르면 다음 커트는 처음부터 다시 외워야 합니다.",
						},
						{
							icon: "✗",
							title: "모든 커트가 비슷하게 나와요",
							desc: "각도·섹션·텐션의 구조를 이해하지 못하면 변주가 없습니다.",
						},
					].map((item) => (
						<li key={item.title} className="flex gap-4 items-start">
							<span className="text-gold text-xl font-black flex-shrink-0 mt-0.5">
								{item.icon}
							</span>
							<div>
								<p className="font-bold text-sm mb-0.5">{item.title}</p>
								<p className="text-gray-500 text-sm leading-relaxed">
									{item.desc}
								</p>
							</div>
						</li>
					))}
				</ul>
				<div className="mt-10 p-5 bg-gray-50 rounded-xl border border-gray-100 max-w-sm mx-auto text-center">
					<p className="font-black text-base mb-2">
						다른 학원은 스타일을 가르칩니다.
					</p>
					<p className="text-gray-600 text-sm leading-relaxed">
						소옴 클래식코스는 <strong>커트 자체</strong>를 가르칩니다.
						<br />한 번 이해한 원리는 어떤 커트에도 적용됩니다.
					</p>
				</div>
			</section>

			{/* ── INSTRUCTOR ── */}
			<section className="px-5 py-14 bg-brand-black text-white">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Instructor
				</p>
				<h2 className="text-2xl font-black text-center mb-8">강사 소개</h2>
				<div className="max-w-sm mx-auto">
					<div className="bg-white/5 rounded-2xl p-6">
						<p className="text-gold font-black text-lg mb-1">심일보</p>
						<p className="text-white/50 text-xs mb-2">
							Head Instructor, 소옴크리에이티브
						</p>
						<p className="text-white/70 text-sm mb-5 leading-relaxed">
							36년간 원리 중심 커트를 연구하고 가르쳐온 클래식 커트 전문가
						</p>
						<ul className="flex flex-col gap-3 text-sm">
							{[
								"런던 비달사순 TTC(Technical Training Course) 수료",
								"비달사순 커트콘테스트 2위",
								"헤어 경력 36년",
								"서울패션위크 참여 헤어디렉터",
								"현 60기 배출 클래식코스 운영",
							].map((item) => (
								<li key={item} className="flex gap-2 items-start">
									<span className="text-gold flex-shrink-0">—</span>
									<span className="text-white/80">{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* ── CURRICULUM ── */}
			<section className="px-5 py-14 bg-white">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Curriculum
				</p>
				<h2 className="text-2xl font-black text-center mb-2">8주 커리큘럼</h2>
				<p className="text-center text-gray-400 text-sm mb-8">
					매주 월요일 10:30 — 13:30
				</p>
				<ol className="flex flex-col gap-3 max-w-sm mx-auto">
					{CURRICULUM.map(({ week, title, desc }) => (
						<li key={week} className="flex gap-4 items-start">
							<span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 text-gold font-black text-xs flex items-center justify-center">
								{week}
							</span>
							<div className="pt-0.5">
								<p className="font-semibold text-sm">{title}</p>
								<p className="text-gray-500 text-xs mt-0.5">{desc}</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			{/* ── TESTIMONIALS ── */}
			<section className="px-5 py-14 bg-gray-50">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Reviews
				</p>
				<h2 className="text-2xl font-black text-center mb-8">수강생 후기</h2>
				<ul className="flex flex-col gap-4 max-w-sm mx-auto">
					{TESTIMONIALS.map(({ id, name, role, quote }) => (
						<li
							key={id}
							className="bg-white rounded-2xl p-6 border border-gray-100"
						>
							<p className="text-sm leading-relaxed text-gray-700 mb-4">
								&ldquo;{quote}&rdquo;
							</p>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-bold text-sm">{name}</p>
									<p className="text-gray-400 text-xs">{role}</p>
								</div>
								<span className="text-[11px] text-gold font-semibold tracking-wide">
									{id}
								</span>
							</div>
						</li>
					))}
				</ul>
			</section>

			{/* ── PRICING ── */}
			<section id="pricing" className="px-5 py-14 bg-brand-black text-white">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Pricing
				</p>
				<h2 className="text-2xl font-black text-center mb-8">수강 정보</h2>
				<div className="max-w-sm mx-auto bg-white/5 rounded-2xl p-6 border border-white/10">
					<ul className="flex flex-col gap-4 mb-8">
						{[
							{ label: "수강료", value: "160만원" },
							{ label: "기간", value: "8주 (2개월)" },
							{ label: "일정", value: "매주 월요일 10:30 — 13:30" },
							{ label: "정원", value: "7명 소수정예" },
							{ label: "분납", value: "2회 분납 가능" },
							{ label: "개강", value: "2026년 5월 (선착순 마감)" },
						].map(({ label, value }) => (
							<li
								key={label}
								className="flex justify-between text-sm border-b border-white/10 pb-4 last:border-0 last:pb-0"
							>
								<span className="text-white/50">{label}</span>
								<span className="font-semibold">{value}</span>
							</li>
						))}
					</ul>
					<a
						href="#consult"
						className="block w-full py-4 bg-gold text-white font-bold rounded-lg text-base text-center hover:opacity-90 transition-opacity"
					>
						자리 확인하기
					</a>
				</div>
			</section>

			{/* ── CONSULT FORM ── */}
			<section id="consult" className="px-5 py-14 bg-white">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					Consult
				</p>
				<h2 className="text-2xl font-black text-center mb-2">무료 상담 신청</h2>
				<p className="text-center text-gray-400 text-sm mb-8">
					24시간 내 연락드립니다
				</p>
				<ConsultForm />
			</section>

			{/* ── FAQ ── */}
			<section className="px-5 py-14 bg-gray-50">
				<p className="text-center text-xs tracking-widest text-gold uppercase font-semibold mb-3">
					FAQ
				</p>
				<h2 className="text-2xl font-black text-center mb-8">자주 묻는 질문</h2>
				<div className="max-w-sm mx-auto">
					<FaqAccordion />
				</div>
			</section>

			{/* ── FINAL CTA ── */}
			<section className="px-5 py-14 bg-brand-black text-white text-center">
				<p className="text-gold text-xs tracking-widest uppercase font-semibold mb-4">
					7명 소수정예 · 선착순 마감
				</p>
				<h2 className="text-2xl font-black mb-3 leading-snug">
					지금 자리가
					<br />
					남아 있습니다
				</h2>
				<p className="text-white/50 text-sm mb-8">
					이미 절반 이상 마감되었습니다
				</p>
				<a
					href="#consult"
					className="inline-block w-full max-w-xs py-4 bg-gold text-white font-bold rounded-lg text-base hover:opacity-90 transition-opacity"
				>
					무료 상담 신청
				</a>
			</section>

			{/* ── FOOTER ── */}
			<footer className="px-5 py-8 bg-gray-900 text-white/40 text-xs text-center leading-relaxed">
				<p className="font-semibold text-white/60 mb-1">소옴크리에이티브</p>
				<p>대표: 심일보</p>
				{/* TODO: 사업자등록번호 확인 후 추가 */}
				<p className="mt-3">© 2026 소옴크리에이티브. All rights reserved.</p>
			</footer>
		</>
	);
}
