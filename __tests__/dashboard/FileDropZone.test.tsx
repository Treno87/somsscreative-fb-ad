import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileDropZone from "@/components/dashboard/FileDropZone";

describe("FileDropZone", () => {
	it("파일 없을 시 안내 텍스트 표시", () => {
		render(<FileDropZone label="캠페인" onFile={jest.fn()} />);
		expect(screen.getByText(/드래그하거나 클릭/)).toBeInTheDocument();
	});

	it("파일 선택 후 파일명 표시", async () => {
		const onFile = jest.fn();
		render(<FileDropZone label="캠페인" onFile={onFile} />);
		const input = screen.getByTestId("file-input");
		const file = new File(["content"], "campaign.csv", { type: "text/csv" });
		await userEvent.upload(input, file);
		expect(screen.getByText("campaign.csv")).toBeInTheDocument();
		expect(onFile).toHaveBeenCalledWith(file);
	});

	it("error prop → 에러 메시지 빨간색 표시", () => {
		render(
			<FileDropZone label="캠페인" onFile={jest.fn()} error="헤더 누락" />,
		);
		const err = screen.getByText("헤더 누락");
		expect(err).toBeInTheDocument();
		expect(err).toHaveClass("text-critical");
	});

	it("드래그 오버 시 테두리 변환", () => {
		render(<FileDropZone label="캠페인" onFile={jest.fn()} />);
		const zone = screen.getByTestId("dropzone");
		fireEvent.dragOver(zone);
		expect(zone).toHaveClass("border-gold");
	});

	it("파일 선택 후 × 버튼 표시, 클릭 시 onRemove 호출 및 파일명 제거", async () => {
		const onFile = jest.fn();
		const onRemove = jest.fn();
		render(<FileDropZone label="캠페인" onFile={onFile} onRemove={onRemove} />);
		const input = screen.getByTestId("file-input");
		const file = new File(["content"], "campaign.csv", { type: "text/csv" });
		await userEvent.upload(input, file);

		const removeBtn = screen.getByRole("button", { name: /삭제/ });
		expect(removeBtn).toBeInTheDocument();

		await userEvent.click(removeBtn);
		expect(onRemove).toHaveBeenCalledTimes(1);
		expect(screen.queryByText("campaign.csv")).not.toBeInTheDocument();
	});
});
