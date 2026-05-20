"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FileDropZone from "@/components/dashboard/FileDropZone";
import { CAMPAIGN_COLUMN_MAP } from "@/lib/dashboard/constants";
import {
	ParseError,
	parseAdCsv,
	parseAdSetCsv,
	parseCampaignCsv,
	toIsoWeek,
} from "@/lib/dashboard/csvParser";
import { saveWeekSnapshot } from "@/lib/dashboard/storage";

// 파일 첫 행에서 보고 시작일 + 헤더 추출
async function peekFile(
	file: File,
): Promise<{ reportStart: string | null; headers: string[] }> {
	try {
		// Read raw headers via PapaParse
		const { default: Papa } = await import("papaparse");
		const text = await file.text().catch(async () => {
			// fallback EUC-KR
			return new Promise<string>((res) => {
				const r = new FileReader();
				r.onload = (e) => res(e.target?.result as string);
				r.readAsText(file, "euc-kr");
			});
		});
		const result = Papa.parse<string[]>(text, {
			header: false,
			preview: 1,
		});
		const headers: string[] =
			(result.data[0] as string[])?.map((h) => h.trim()) ?? [];

		const rows = await parseCampaignCsv(file).catch(() => []);
		return { reportStart: rows[0]?.reportStart ?? null, headers };
	} catch {
		return { reportStart: null, headers: [] };
	}
}

function ColumnDebug({ headers }: { headers: string[] }) {
	const [open, setOpen] = useState(false);
	if (headers.length === 0) return null;

	const known = new Set(Object.keys(CAMPAIGN_COLUMN_MAP));
	const matched = headers.filter((h) => known.has(h));
	const unmatched = headers.filter((h) => !known.has(h));

	return (
		<div className="mt-2 text-xs">
			<button
				onClick={() => setOpen((v) => !v)}
				className="text-gray-500 hover:text-gray-300 underline"
			>
				{open ? "▲ 컬럼 닫기" : `▼ 컬럼 확인 (${headers.length}개 감지)`}
			</button>
			{open && (
				<div className="mt-2 bg-[#111] rounded-lg p-3 space-y-2">
					<div>
						<p className="text-ok mb-1">인식됨 ({matched.length}개)</p>
						<div className="flex flex-wrap gap-1">
							{matched.map((h) => (
								<span
									key={h}
									className="bg-ok/10 text-ok px-2 py-0.5 rounded text-[10px]"
								>
									{h}
								</span>
							))}
						</div>
					</div>
					{unmatched.length > 0 && (
						<div>
							<p className="text-gray-500 mb-1">
								미인식 ({unmatched.length}개)
							</p>
							<div className="flex flex-wrap gap-1">
								{unmatched.map((h) => (
									<span
										key={h}
										className="bg-[#222] text-gray-500 px-2 py-0.5 rounded text-[10px]"
									>
										{h}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default function UploadPage() {
	const router = useRouter();
	const [files, setFiles] = useState<{
		campaign?: File;
		adset?: File;
		ad?: File;
	}>({});
	const [errors, setErrors] = useState<{
		campaign?: string;
		adset?: string;
		ad?: string;
	}>({});
	const [isProcessing, setIsProcessing] = useState(false);
	const [reportDate, setReportDate] = useState(""); // YYYY-MM-DD
	const [weekError, setWeekError] = useState("");
	const [campaignHeaders, setCampaignHeaders] = useState<string[]>([]);

	const isoWeek = reportDate ? toIsoWeek(reportDate) : "";
	const allSelected = !!(files.campaign && files.adset && files.ad);

	async function handleCampaignFile(file: File) {
		setFiles((p) => ({ ...p, campaign: file }));
		setErrors((p) => ({ ...p, campaign: undefined }));

		const { reportStart, headers } = await peekFile(file);
		setCampaignHeaders(headers);
		if (!reportDate && reportStart) setReportDate(reportStart);
	}

	async function handleSubmit() {
		if (!reportDate) {
			setWeekError("보고 시작일을 선택하세요");
			return;
		}
		if (!allSelected) return;

		setIsProcessing(true);
		const newErrors: typeof errors = {};

		try {
			const [campaigns, adSets, ads] = await Promise.all([
				parseCampaignCsv(files.campaign!).catch((e) => {
					newErrors.campaign = e instanceof ParseError ? e.message : String(e);
					return null;
				}),
				parseAdSetCsv(files.adset!).catch((e) => {
					newErrors.adset = e instanceof ParseError ? e.message : String(e);
					return null;
				}),
				parseAdCsv(files.ad!).catch((e) => {
					newErrors.ad = e instanceof ParseError ? e.message : String(e);
					return null;
				}),
			]);

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			}

			saveWeekSnapshot(isoWeek, {
				uploadedAt: new Date().toISOString(),
				campaigns: campaigns!,
				adSets: adSets!,
				ads: ads!,
			});

			// analytics/input 에 저장 (분석용 — 실패해도 무시)
			fetch("/api/audit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "save-input",
					campaigns: campaigns!,
					adSets: adSets!,
					ads: ads!,
				}),
			}).catch(() => {});

			router.push("/dashboard/overview");
		} finally {
			setIsProcessing(false);
			if (Object.keys(newErrors).length > 0) setErrors(newErrors);
		}
	}

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-2">주차 데이터 업로드</h1>
			<p className="text-gray-400 text-sm mb-8">
				Facebook 광고 관리자에서 내보낸 파일 3종을 업로드하세요. (CSV 또는 xlsx
				모두 가능)
			</p>

			{/* Date picker → ISO week 자동 계산 */}
			<div className="mb-6">
				<label className="block text-sm text-gray-300 font-medium mb-1">
					보고 시작일
				</label>
				<div className="flex items-center gap-3">
					<input
						type="date"
						value={reportDate}
						onChange={(e) => {
							setReportDate(e.target.value);
							setWeekError("");
						}}
						className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold"
					/>
					{isoWeek && (
						<span className="text-gold font-mono text-sm font-semibold bg-gold/10 px-3 py-2 rounded-lg">
							{isoWeek}
						</span>
					)}
				</div>
				{weekError && <p className="text-xs text-critical mt-1">{weekError}</p>}
				<p className="text-xs text-gray-500 mt-1">
					캠페인 파일 업로드 시 날짜가 자동으로 입력됩니다.
				</p>
			</div>

			{/* File uploads */}
			<div className="flex flex-col gap-4 mb-8">
				<div>
					<FileDropZone
						label="캠페인"
						onFile={handleCampaignFile}
						onRemove={() => {
							setFiles((p) => ({ ...p, campaign: undefined }));
							setCampaignHeaders([]);
						}}
						error={errors.campaign}
					/>
					<ColumnDebug headers={campaignHeaders} />
				</div>
				<FileDropZone
					label="광고 세트"
					onFile={(f) => {
						setFiles((p) => ({ ...p, adset: f }));
						setErrors((p) => ({ ...p, adset: undefined }));
					}}
					onRemove={() => setFiles((p) => ({ ...p, adset: undefined }))}
					error={errors.adset}
				/>
				<FileDropZone
					label="광고"
					onFile={(f) => {
						setFiles((p) => ({ ...p, ad: f }));
						setErrors((p) => ({ ...p, ad: undefined }));
					}}
					onRemove={() => setFiles((p) => ({ ...p, ad: undefined }))}
					error={errors.ad}
				/>
			</div>

			<button
				onClick={handleSubmit}
				disabled={!allSelected || isProcessing}
				className="w-full py-3 rounded-lg font-semibold text-sm transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-gold text-brand-black hover:bg-gold-light"
			>
				{isProcessing ? "분석 중..." : "분석 시작"}
			</button>

			<div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg text-xs text-gray-500 space-y-1">
				<p className="font-medium text-gray-400 mb-2">파일 내보내기 방법</p>
				<p>1. Facebook 광고 관리자 → 캠페인/광고 세트/광고 탭</p>
				<p>2. 날짜 범위 설정 → 내보내기 → CSV 또는 Excel 다운로드</p>
				<p>3. 3개 파일 각각 업로드 (.csv / .xlsx 모두 가능)</p>
			</div>

			<div className="mt-3 text-center">
				<button
					onClick={() => {
						if (confirm("저장된 모든 데이터를 삭제할까요?")) {
							localStorage.removeItem("somss_dashboard_v2");
							window.location.reload();
						}
					}}
					className="text-xs text-gray-600 hover:text-critical underline"
				>
					저장된 데이터 초기화
				</button>
			</div>
		</div>
	);
}
