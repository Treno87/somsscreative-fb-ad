import { render, screen } from "@testing-library/react";
import KpiCard from "@/components/dashboard/KpiCard";

describe("KpiCard", () => {
	it("label, value, unit 렌더링", () => {
		render(<KpiCard label="총 지출" value="₩48,000" unit="원" />);
		expect(screen.getByText("총 지출")).toBeInTheDocument();
		expect(screen.getByText("₩48,000")).toBeInTheDocument();
		expect(screen.getByText("원")).toBeInTheDocument();
	});

	it("delta=20 → 빨간 상향 화살표 (CPL 상승 = 나쁨)", () => {
		render(<KpiCard label="CPL" value="10,000" delta={20} />);
		const badge = screen.getByTestId("delta-badge");
		expect(badge).toHaveClass("text-critical");
		expect(badge.textContent).toContain("▲");
	});

	it("delta=-20 → 초록 하향 화살표 (CPL 하락 = 좋음)", () => {
		render(<KpiCard label="CPL" value="8,000" delta={-20} />);
		const badge = screen.getByTestId("delta-badge");
		expect(badge).toHaveClass("text-ok");
		expect(badge.textContent).toContain("▼");
	});

	it("delta=undefined → 뱃지 미표시", () => {
		render(<KpiCard label="CPL" value="8,000" />);
		expect(screen.queryByTestId("delta-badge")).toBeNull();
	});

	it("isInvertedDelta=true: delta=+20 → 초록 (CTR 상승은 좋음)", () => {
		render(<KpiCard label="CTR" value="3%" delta={20} isInvertedDelta />);
		const badge = screen.getByTestId("delta-badge");
		expect(badge).toHaveClass("text-ok");
	});
});
