// Hero 배경 — 헤어 모티프 추상화
// 가위 라인 + 머리카락 흐름 + 도해도 단면을 마젠타-퍼플-사이언 그라데이션으로 추상화
// Phase 3에서 실제 이미지로 교체 가능 (현재는 SVG placeholder)
export default function HeroBackground() {
	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none"
			viewBox="0 0 1728 700"
			preserveAspectRatio="xMidYMid slice"
			fill="none"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="grad-hair-1" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#ff3bff" stopOpacity="0.0" />
					<stop offset="20%" stopColor="#ff3bff" stopOpacity="0.7" />
					<stop offset="50%" stopColor="#d94fd5" stopOpacity="0.8" />
					<stop offset="80%" stopColor="#5c24ff" stopOpacity="0.7" />
					<stop offset="100%" stopColor="#5c24ff" stopOpacity="0.0" />
				</linearGradient>
				<linearGradient id="grad-hair-2" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#5c24ff" stopOpacity="0.0" />
					<stop offset="30%" stopColor="#5c24ff" stopOpacity="0.5" />
					<stop offset="70%" stopColor="#ff3bff" stopOpacity="0.5" />
					<stop offset="100%" stopColor="#d94fd5" stopOpacity="0.0" />
				</linearGradient>
				<radialGradient id="grad-glow" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#ff3bff" stopOpacity="0.18" />
					<stop offset="60%" stopColor="#5c24ff" stopOpacity="0.05" />
					<stop offset="100%" stopColor="#000" stopOpacity="0" />
				</radialGradient>
			</defs>

			{/* 배경 글로우 */}
			<rect width="1728" height="700" fill="url(#grad-glow)" />

			{/* 머리카락 흐름 라인 — Bezier curves */}
			<g opacity="0.9" strokeWidth="1.5" fill="none">
				<path
					d="M -100 480 Q 300 360, 600 440 T 1200 380 T 1900 460"
					stroke="url(#grad-hair-1)"
				/>
				<path
					d="M -100 520 Q 280 420, 580 500 T 1180 440 T 1900 520"
					stroke="url(#grad-hair-1)"
					opacity="0.8"
				/>
				<path
					d="M -100 560 Q 320 480, 620 560 T 1220 500 T 1900 580"
					stroke="url(#grad-hair-2)"
					opacity="0.7"
				/>
				<path
					d="M -100 600 Q 260 540, 560 620 T 1160 560 T 1900 640"
					stroke="url(#grad-hair-2)"
					opacity="0.6"
				/>
				<path
					d="M -100 440 Q 340 320, 640 400 T 1240 340 T 1900 420"
					stroke="url(#grad-hair-1)"
					opacity="0.5"
				/>
				<path
					d="M -100 400 Q 380 280, 680 360 T 1280 300 T 1900 380"
					stroke="url(#grad-hair-2)"
					opacity="0.4"
				/>
			</g>

			{/* 도해도 단면 — 격자 grid 추상화 */}
			<g
				opacity="0.15"
				stroke="#5c24ff"
				strokeWidth="0.5"
				fill="none"
				transform="translate(1200 100)"
			>
				<line x1="0" y1="0" x2="0" y2="280" />
				<line x1="60" y1="0" x2="60" y2="280" />
				<line x1="120" y1="0" x2="120" y2="280" />
				<line x1="180" y1="0" x2="180" y2="280" />
				<line x1="240" y1="0" x2="240" y2="280" />
				<line x1="0" y1="0" x2="240" y2="0" />
				<line x1="0" y1="70" x2="240" y2="70" />
				<line x1="0" y1="140" x2="240" y2="140" />
				<line x1="0" y1="210" x2="240" y2="210" />
				<line x1="0" y1="280" x2="240" y2="280" />
				{/* 두상 단면 곡선 */}
				<path d="M 30 250 Q 120 60, 210 250" stroke="#ff3bff" strokeWidth="1.5" opacity="0.6" />
				<path d="M 50 250 Q 120 110, 190 250" stroke="#d94fd5" strokeWidth="1.5" opacity="0.5" />
			</g>

			{/* 가위 라인 — 두 선이 X자로 교차 (가위 모티프) */}
			<g opacity="0.25" stroke="#ff3bff" strokeWidth="1" fill="none">
				<line x1="100" y1="120" x2="280" y2="240" />
				<line x1="100" y1="240" x2="280" y2="120" />
				<circle cx="100" cy="120" r="14" />
				<circle cx="100" cy="240" r="14" />
			</g>
		</svg>
	);
}
