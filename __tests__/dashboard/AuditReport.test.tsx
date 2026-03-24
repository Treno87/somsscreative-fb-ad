import { render, screen } from "@testing-library/react";
import AuditReport from "@/components/dashboard/AuditReport";
import type { AuditReport as AuditReportType } from "@/lib/dashboard/types";

const mockReport: AuditReportType = {
	generatedAt: "2026-03-24T12:00:00Z",
	period: "2026-03-21 ~ 2026-03-24",
	healthScore: 35,
	grade: "D",
	summary: "전체 계정 건강 점수가 낮습니다. 즉각적인 조치가 필요합니다.",
	categories: {
		creative: { score: 15, label: "소재" },
		budget: { score: 32, label: "예산" },
		structure: { score: 55, label: "구조" },
		audience: { score: 60, label: "오디언스" },
	},
	findings: [
		{
			category: "creative",
			level: "critical",
			title: "소재 수 부족",
			detail: "광고세트당 평균 2개 (기준: 5개)",
		},
		{
			category: "budget",
			level: "warning",
			title: "학습단계 미달",
			detail: "주간 전환 8건 (기준: 50건)",
		},
	],
	quickWins: [
		{
			priority: 1,
			action: "classic_landing 예산 증액",
			impact: "CPL 50% 절감 예상",
		},
		{
			priority: 2,
			action: "소재 3개 추가 제작",
			impact: "피로도 해소",
		},
	],
	killList: [
		{
			name: "classic_헤어타겟",
			reason: "CPL 30,254원 (평균의 3배)",
			wastedSpend: 30254,
		},
	],
	scalingOpportunities: [
		{
			name: "classic_landing",
			recommendation: "일일 예산 40,000원으로 증액",
			expectedImpact: "리드 2배 증가 예상",
		},
	],
	abConclusion: {
		winner: "classic_landing",
		winnerCpl: 8447,
		loserCpl: 16787,
		cplReduction: 0.5,
		recommendation: "예산을 classic_landing으로 이동하세요",
	},
	topCreatives: [
		{
			name: "classic-landing_헤어타겟_1P",
			cpl: 5565,
			leads: 5,
			ctr: 0.05,
		},
	],
};

describe("AuditReport", () => {
	it("Health Score 숫자와 등급을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("35")).toBeInTheDocument();
		expect(screen.getByText("D")).toBeInTheDocument();
	});

	it("분석 기간을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText(/2026-03-21/)).toBeInTheDocument();
	});

	it("요약 텍스트를 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(
			screen.getByText(
				"전체 계정 건강 점수가 낮습니다. 즉각적인 조치가 필요합니다.",
			),
		).toBeInTheDocument();
	});

	it("카테고리별 점수와 라벨을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("소재")).toBeInTheDocument();
		expect(screen.getByText("예산")).toBeInTheDocument();
		expect(screen.getByText("구조")).toBeInTheDocument();
		expect(screen.getByText("오디언스")).toBeInTheDocument();
	});

	it("Quick Wins 목록의 액션과 임팩트를 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("classic_landing 예산 증액")).toBeInTheDocument();
		expect(screen.getByText("CPL 50% 절감 예상")).toBeInTheDocument();
	});

	it("Kill List 캠페인명을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("classic_헤어타겟")).toBeInTheDocument();
	});

	it("A/B 테스트 결론의 승자를 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getAllByText("classic_landing").length).toBeGreaterThan(0);
	});

	it("A/B 결론 추천 텍스트를 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(
			screen.getByText("예산을 classic_landing으로 이동하세요"),
		).toBeInTheDocument();
	});

	it("abConclusion이 null이면 A/B 섹션을 렌더링하지 않는다", () => {
		render(<AuditReport report={{ ...mockReport, abConclusion: null }} />);
		expect(screen.queryByText("A/B 테스트 결론")).not.toBeInTheDocument();
	});

	it("최우수 소재 이름을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("classic-landing_헤어타겟_1P")).toBeInTheDocument();
	});

	it("findings의 critical 항목을 표시한다", () => {
		render(<AuditReport report={mockReport} />);
		expect(screen.getByText("소재 수 부족")).toBeInTheDocument();
	});
});
