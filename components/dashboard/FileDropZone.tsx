"use client";

import { useRef, useState } from "react";

interface FileDropZoneProps {
	label: string;
	onFile: (file: File) => void;
	onRemove?: () => void;
	error?: string;
}

export default function FileDropZone({
	label,
	onFile,
	onRemove,
	error,
}: FileDropZoneProps) {
	const [fileName, setFileName] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	function handleFile(file: File) {
		setFileName(file.name);
		onFile(file);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	}

	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm text-gray-300 font-medium">{label} CSV</span>
			<div
				data-testid="dropzone"
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`
          cursor-pointer rounded-lg border-2 border-dashed p-6 text-center
          transition-colors
          ${isDragging ? "border-gold bg-gold/5" : "border-gray-600 hover:border-gray-400"}
        `}
			>
				<input
					data-testid="file-input"
					ref={inputRef}
					type="file"
					accept=".csv,.xlsx,.xls"
					className="hidden"
					onChange={handleChange}
				/>
				{fileName ? (
					<span className="flex items-center justify-center gap-2 text-sm text-white">
						{fileName}
						<button
							aria-label="파일 삭제"
							onClick={(e) => {
								e.stopPropagation();
								setFileName(null);
								if (inputRef.current) inputRef.current.value = "";
								onRemove?.();
							}}
							className="text-gray-400 hover:text-white leading-none"
						>
							×
						</button>
					</span>
				) : (
					<span className="text-sm text-gray-400">
						CSV 또는 xlsx 파일을 드래그하거나 클릭해서 선택
					</span>
				)}
			</div>
			{error && <span className="text-xs text-critical">{error}</span>}
		</div>
	);
}
