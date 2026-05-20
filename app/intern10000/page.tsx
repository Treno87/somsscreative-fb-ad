import type { Metadata } from "next";
import ConsultForm from "./_components/ConsultForm";
import CountdownTimer from "./_components/CountdownTimer";
import FaqAccordion from "./_components/FaqAccordion";
import HeroBackground from "./_components/HeroBackground";

export const metadata: Metadata = {
	title: "어깨 너머로 배운 기술은 실력이 되지 않습니다 — 소옴 인턴10000",
	description:
		"인턴을 위한 만분의 기적. 14회 × 3시간 + 매주 300분 실전 훈련으로 커트의 메커니즘을 처음부터 체득합니다. 7명 소수정예. 2026년 6월 중 1기 개강.",
	robots: "index, follow",
	openGraph: {
		title: "어깨 너머로 배운 기술은 실력이 되지 않습니다 | 인턴10000",
		description:
			"일반 교육은 유행하는 형태를 가르칩니다. 인턴10000은 커트의 메커니즘 자체를 훈련시킵니다. 디자이너 승급을 위한 가장 정확한 기준 — 정원 7명.",
		type: "website",
		locale: "ko_KR",
		siteName: "소옴크리에이티브",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Course",
	name: "소옴크리에이티브 인턴을 위한 만분의 기적",
	description:
		"미용 입문~경력 2년차 디자이너를 위한 14회차 커트 베이직 코스. 런던 사순 강사 코스 수료 마스터에게 LINE·GRADUATION·LAYER 메커니즘을 처음부터 체득.",
	provider: {
		"@type": "Organization",
		name: "소옴크리에이티브",
		url: "https://somsscreative.com",
	},
	courseMode: "onsite",
	numberOfCredits: 14,
	offers: {
		"@type": "Offer",
		price: "2800000",
		priceCurrency: "KRW",
		availability: "https://schema.org/LimitedAvailability",
	},
};

const CURRICULUM = [
	{
		stage: "기초 이론·자세",
		weeks: "1~2",
		desc: "오리엔테이션, SOMSS Hair Cut Theory, 정확한 섹션·빗질·바디포지션",
	},
	{
		stage: "LINE 테크닉",
		weeks: "3~5",
		desc: "Triangle / Square Line + 블로우드라이 + 도해도 + 이론 Level 1·2 테스트",
	},
	{
		stage: "GRADUATION",
		weeks: "6~8",
		desc: "Triangle / Square / Round Graduation + 도해도 실습",
	},
	{
		stage: "LAYER",
		weeks: "9~11",
		desc: "Flat (Square) / Convex / Concave (Round) Layer",
	},
	{
		stage: "종합·졸업",
		weeks: "12~14",
		desc: "Combination Design / Salon Design (Long·Medium) + 졸업식",
	},
];

const TESTIMONIALS = [
	{
		id: "1기",
		name: "김○○",
		role: "인턴 2년차, 승급 준비",
		quote:
			"인턴 2년 동안 어깨너머로 본 게 전부였어요. 승급 시험 앞두고 막막했는데, 처음으로 '아, 커트가 이렇게 만들어지는구나' 싶었어요. 도해도 그려보면서 머릿속이 정리됐습니다.",
	},
	{
		id: "1기",
		name: "이○○",
		role: "초급 디자이너 1년차",
		quote:
			"승급은 했는데 고객 앞에 서면 손이 떨렸어요. 배운 형태 말고는 자신이 없었거든요. 14회 수업 끝나고 처음으로 'Square를 잘라보세요' 했을 때 머릿속에 단면도가 그려졌습니다.",
	},
	{
		id: "1기",
		name: "최○○",
		role: "디자이너 3년차, 기초 보강",
		quote:
			"경력은 쌓였는데 기본기가 약하다는 걸 스스로 알고 있었어요. LINE·GRADUATION·LAYER 순서로 구조를 처음부터 짚어주니까 비로소 채워졌습니다.",
	},
];

export default function Intern10000Page() {
	return (
		<main className="bg-black text-white font-[var(--font-cabinet)]">
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* ── HEADER ── */}
			<header className="absolute top-0 left-0 right-0 z-20 px-6 py-6 md:px-12">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<a
						href="/intern10000"
						className="font-[family-name:var(--font-clash)] text-xl md:text-2xl font-medium tracking-tight"
					>
						SOMSS · Intern10000
					</a>
					<nav className="hidden md:flex gap-8 font-[family-name:var(--font-space)] text-sm text-white/70">
						<a href="#why" className="hover:text-white transition-colors">
							Why
						</a>
						<a
							href="#curriculum"
							className="hover:text-white transition-colors"
						>
							Curriculum
						</a>
						<a href="#pricing" className="hover:text-white transition-colors">
							Pricing
						</a>
						<a href="#faq" className="hover:text-white transition-colors">
							FAQ
						</a>
					</nav>
					<a
						href="#consult"
						className="font-[family-name:var(--font-space)] text-sm text-white/90 hover:text-white border-b border-white/30 hover:border-white pb-0.5 transition-colors"
					>
						상담 신청 →
					</a>
				</div>
			</header>

			{/* ── HERO ── */}
			<section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
				<HeroBackground />
				<div className="relative z-10 max-w-5xl mx-auto text-center">
					<p className="font-[family-name:var(--font-space)] text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 mb-6">
						런던 사순 강사 코스 수료 · 클래식 300명+ 배출
					</p>
					<h1 className="font-[family-name:var(--font-clash)] font-medium leading-[1.05] tracking-tight mb-8">
						<span className="block text-hero-gradient text-5xl md:text-7xl lg:text-[88px]">
							어깨 너머로 배운
						</span>
						<span className="block text-5xl md:text-7xl lg:text-[88px] text-white">
							기술은 실력이 되지 않습니다
						</span>
					</h1>
					<p className="font-[family-name:var(--font-cabinet)] text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
						처음부터 제대로 된 뼈대를 세우지 않으면, 평생 형태만 외우다 끝납니다.
						인턴10000은 커트의 메커니즘을 가장 기초부터 체계적으로 훈련합니다.
					</p>

					<div className="mb-10 md:mb-12">
						<CountdownTimer />
						<p className="font-[family-name:var(--font-space)] text-xs text-white/40 mt-4 tracking-wider">
							1기 개강까지 남은 시간 · 개강일 추후 확정
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<a href="#consult" className="cta-capsule cta-capsule-magenta">
							무료 상담 신청
						</a>
						<a href="#pricing" className="cta-capsule cta-capsule-white">
							수강 정보 보기
						</a>
					</div>
				</div>
			</section>

			{/* ── PAIN POINTS ── */}
			<section id="why" className="relative px-6 py-24 md:py-32 bg-black">
				<div className="max-w-5xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						Why Intern10000
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-[1.1] text-center mb-16 tracking-tight">
						<span className="text-white">영상도 보고 선배도 따라했는데</span>
						<br />
						<span className="text-hero-gradient">왜 손은 멈출까요</span>
					</h2>
					<div className="grid md:grid-cols-3 gap-6 md:gap-8">
						{[
							{
								n: "01",
								title: "영상을 볼 때는 알 것 같은데, 손이 멈춥니다",
								desc: "시각적 결과물만 눈으로 소비했기 때문입니다. 구조를 모르면 재현할 수 없습니다.",
							},
							{
								n: "02",
								title:
									"선배 따라 자르는 법은 익혔는데, 다른 두상에는 안 통합니다",
								desc: "메커니즘 없이 단편적 패턴만 외웠기 때문입니다. 원리 없이는 응용도 없습니다.",
							},
							{
								n: "03",
								title: "승급은 했는데 고객 앞에 서면 손이 떨립니다",
								desc: "어깨너머로 모은 경험은 자신감으로 이어지지 않습니다. 뼈대가 없는 시술은 흔들립니다.",
							},
						].map((item) => (
							<div
								key={item.n}
								className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
							>
								<p className="font-[family-name:var(--font-clash)] text-magenta text-3xl font-medium mb-4">
									{item.n}
								</p>
								<p className="font-[family-name:var(--font-cabinet)] font-medium text-lg leading-snug mb-3">
									{item.title}
								</p>
								<p className="font-[family-name:var(--font-cabinet)] text-sm text-white/60 leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
					<div className="mt-16 mx-auto max-w-3xl text-center p-8 md:p-10 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent">
						<p className="font-[family-name:var(--font-clash)] text-2xl md:text-3xl leading-snug mb-3">
							일반 교육은 유행하는 <span className="text-white/40">형태</span>를 가르칩니다.
						</p>
						<p className="font-[family-name:var(--font-clash)] text-2xl md:text-3xl leading-snug">
							인턴10000은 <span className="text-hero-gradient">커트의 메커니즘</span>을 훈련시킵니다.
						</p>
					</div>
				</div>
			</section>

			{/* ── INSTRUCTOR ── */}
			<section className="relative px-6 py-24 md:py-32 bg-black border-y border-white/5">
				<div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
					<div>
						<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
							Instructor
						</p>
						<h2 className="font-[family-name:var(--font-clash)] text-4xl md:text-5xl font-medium leading-tight mb-2">
							심일보
						</h2>
						<p className="font-[family-name:var(--font-space)] text-sm text-white/50 mb-8 tracking-wide">
							Head Instructor · 소옴크리에이티브
						</p>
						<p className="font-[family-name:var(--font-cabinet)] text-lg text-white/80 leading-relaxed mb-8">
							런던 사순 강사 코스 수료, 클래식과정 300명 이상 배출한 베이직
							전문가
						</p>
					</div>
					<ul className="flex flex-col gap-5">
						{[
							"런던 사순 아카데미(Sassoon Academy) 강사 코스(TTC) 수료",
							"사순 커트 콘테스트 2위 입상",
							"소옴크리에이티브 클래식과정 61기 운영",
							"클래식·인턴 과정 누적 300명 이상 배출",
						].map((item) => (
							<li
								key={item}
								className="flex gap-4 items-start font-[family-name:var(--font-cabinet)]"
							>
								<span
									className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5"
									style={{
										background:
											"linear-gradient(90deg, #ff3bff, #5c24ff)",
									}}
								/>
								<span className="text-white/85 text-base leading-relaxed">
									{item}
								</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* ── CURRICULUM ── */}
			<section id="curriculum" className="relative px-6 py-24 md:py-32 bg-black">
				<div className="max-w-5xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						Curriculum
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-tight text-center mb-3 tracking-tight">
						14회차로 완성하는
						<br />
						<span className="text-hero-gradient">베이직의 전부</span>
					</h2>
					<p className="font-[family-name:var(--font-cabinet)] text-base text-white/50 text-center mb-16">
						매 회차 3시간 · 매주 300분 자가 훈련 · 1:1 멘토링
					</p>
					<div className="flex flex-col gap-px bg-white/10 rounded-3xl overflow-hidden">
						{CURRICULUM.map(({ stage, weeks, desc }) => (
							<div
								key={stage}
								className="flex gap-6 md:gap-10 items-start p-6 md:p-8 bg-black hover:bg-white/[0.02] transition-colors"
							>
								<span className="font-[family-name:var(--font-clash)] text-hero-gradient text-3xl md:text-4xl font-medium flex-shrink-0 min-w-[80px] md:min-w-[120px]">
									{weeks}
								</span>
								<div className="flex-1">
									<p className="font-[family-name:var(--font-cabinet)] font-semibold text-xl md:text-2xl mb-2">
										{stage}
									</p>
									<p className="font-[family-name:var(--font-cabinet)] text-sm md:text-base text-white/60 leading-relaxed">
										{desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── TESTIMONIALS ── */}
			<section className="relative px-6 py-24 md:py-32 bg-black border-y border-white/5">
				<div className="max-w-5xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						Reviews
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-tight text-center mb-3 tracking-tight">
						수강생들의 변화
					</h2>
					<p className="font-[family-name:var(--font-cabinet)] text-xs text-white/40 text-center mb-16">
						※ 1기 모집 중 — 페르소나 기반 후보 후기
					</p>
					<div className="grid md:grid-cols-3 gap-6 md:gap-8">
						{TESTIMONIALS.map(({ id, name, role, quote }) => (
							<div
								key={`${id}-${name}`}
								className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col"
							>
								<p
									className="font-[family-name:var(--font-clash)] text-4xl mb-6 leading-none"
									style={{
										background:
											"linear-gradient(90deg, #ff3bff, #5c24ff)",
										WebkitBackgroundClip: "text",
										backgroundClip: "text",
										color: "transparent",
									}}
								>
									"
								</p>
								<p className="font-[family-name:var(--font-cabinet)] text-sm md:text-base text-white/80 leading-relaxed mb-8 flex-1">
									{quote}
								</p>
								<div className="flex items-center justify-between border-t border-white/10 pt-4">
									<div>
										<p className="font-[family-name:var(--font-cabinet)] font-semibold text-sm">
											{name}
										</p>
										<p className="font-[family-name:var(--font-space)] text-xs text-white/40 tracking-wide mt-0.5">
											{role}
										</p>
									</div>
									<span className="font-[family-name:var(--font-space)] text-[11px] text-magenta tracking-wider">
										{id}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── PRICING ── */}
			<section id="pricing" className="relative px-6 py-24 md:py-32 bg-black">
				<div className="max-w-4xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						Pricing
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-tight text-center mb-16 tracking-tight">
						수강 정보
					</h2>
					<div
						className="rounded-3xl p-10 md:p-14 border border-white/15"
						style={{
							background:
								"linear-gradient(135deg, rgba(255,59,255,0.08) 0%, rgba(92,36,255,0.08) 100%)",
						}}
					>
						<div className="flex items-baseline gap-3 mb-12 justify-center md:justify-start">
							<span className="font-[family-name:var(--font-clash)] text-hero-gradient text-6xl md:text-8xl font-medium leading-none">
								280
							</span>
							<span className="font-[family-name:var(--font-cabinet)] text-2xl md:text-3xl text-white/60">
								만원
							</span>
						</div>
						<ul className="grid md:grid-cols-2 gap-6 mb-12">
							{[
								{ label: "기간", value: "14회 × 3시간 (총 42시간)" },
								{ label: "자가 훈련", value: "매주 300분 + 1:1 멘토링" },
								{ label: "정원", value: "7명 소수정예" },
								{ label: "등록 조건", value: "20% 선납으로 기수 확정" },
								{ label: "개강", value: "2026년 6월 중 (추후 공지)" },
								{ label: "잔여", value: "모집 진행 중" },
							].map(({ label, value }) => (
								<li
									key={label}
									className="font-[family-name:var(--font-cabinet)] border-b border-white/10 pb-4"
								>
									<p className="font-[family-name:var(--font-space)] text-xs text-white/40 uppercase tracking-widest mb-2">
										{label}
									</p>
									<p className="text-base md:text-lg text-white">{value}</p>
								</li>
							))}
						</ul>
						<a
							href="#consult"
							className="cta-capsule cta-capsule-magenta w-full"
						>
							자리 확인하기
						</a>
					</div>
				</div>
			</section>

			{/* ── CONSULT FORM ── */}
			<section
				id="consult"
				className="relative px-6 py-24 md:py-32 bg-black border-y border-white/5"
			>
				<div className="max-w-2xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						Consult
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-tight text-center mb-3 tracking-tight">
						무료 상담 신청
					</h2>
					<p className="font-[family-name:var(--font-cabinet)] text-base text-white/50 text-center mb-12">
						24시간 내 연락드립니다
					</p>
					<ConsultForm />
				</div>
			</section>

			{/* ── FAQ ── */}
			<section id="faq" className="relative px-6 py-24 md:py-32 bg-black">
				<div className="max-w-3xl mx-auto">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
						FAQ
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-4xl md:text-6xl leading-tight text-center mb-16 tracking-tight">
						자주 묻는 질문
					</h2>
					<FaqAccordion />
				</div>
			</section>

			{/* ── FINAL CTA ── */}
			<section className="relative px-6 py-24 md:py-32 bg-black overflow-hidden">
				<div
					className="absolute inset-0 opacity-30"
					style={{
						background:
							"radial-gradient(ellipse at center, rgba(255,59,255,0.25) 0%, rgba(92,36,255,0.15) 40%, transparent 70%)",
					}}
				/>
				<div className="relative max-w-4xl mx-auto text-center">
					<p className="font-[family-name:var(--font-space)] text-xs tracking-[0.3em] uppercase text-white/60 mb-6">
						7명 소수정예 · 1기 모집 중
					</p>
					<h2 className="font-[family-name:var(--font-clash)] font-medium text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
						<span className="text-hero-gradient">디자이너 승급</span>을 위한
						<br />
						가장 정확한 기준
					</h2>
					<p className="font-[family-name:var(--font-cabinet)] text-lg text-white/60 mb-12">
						베이직 테크닉을 14회차에 완성합니다
					</p>
					<a href="#consult" className="cta-capsule cta-capsule-magenta">
						무료 상담 신청
					</a>
				</div>
			</section>

			{/* ── FOOTER ── */}
			<footer className="px-6 py-12 bg-black border-t border-white/10">
				<div className="max-w-5xl mx-auto text-center">
					<p className="font-[family-name:var(--font-clash)] text-lg mb-2 text-white/70">
						소옴크리에이티브
					</p>
					<p className="font-[family-name:var(--font-cabinet)] text-xs text-white/40">
						대표: 심일보
					</p>
					<p className="font-[family-name:var(--font-cabinet)] text-xs text-white/30 mt-4">
						© 2026 소옴크리에이티브. All rights reserved.
					</p>
				</div>
			</footer>
		</main>
	);
}
