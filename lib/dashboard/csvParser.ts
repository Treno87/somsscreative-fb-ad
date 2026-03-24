import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
	AD_COLUMN_MAP,
	AD_REQUIRED_COLUMNS,
	ADSET_COLUMN_MAP,
	ADSET_REQUIRED_COLUMNS,
	CAMPAIGN_COLUMN_MAP,
	CAMPAIGN_REQUIRED_COLUMNS,
} from "./constants";
import type { AdRow, AdSetRow, CampaignRow, CsvFileType } from "./types";

// ---- ParseError ----

export class ParseError extends Error {
	fileType: CsvFileType;
	missingColumns: string[];

	constructor(fileType: CsvFileType, missingColumns: string[]) {
		super(`[${fileType}] 필수 컬럼 누락: ${missingColumns.join(", ")}`);
		this.fileType = fileType;
		this.missingColumns = missingColumns;
	}
}

// ---- Primitive converters ----

export function parseKrwNumber(raw: string): number {
	const cleaned = raw.replace(/[₩KRW,\s]/g, "");
	if (!cleaned || cleaned === "-") return 0;
	const n = Number(cleaned);
	return isNaN(n) ? 0 : n;
}

export function parsePct(raw: string): number {
	if (!raw) return 0;
	const trimmed = raw.trim();
	const hasPct = trimmed.endsWith("%");
	const withoutPct = hasPct ? trimmed.slice(0, -1) : trimmed;
	const n = Number(withoutPct);
	if (isNaN(n)) return 0;
	// Already in 0-1 decimal range (XLSX raw:true gives 0.0394 for 3.94%)
	if (!hasPct && n >= 0 && n < 1) return n;
	// XLSX double-percent artifact: cell value=3.94 with "%" format → raw:false gives "394.09%"
	// CTR can never exceed 100%, so n > 100 means the value was already in percent form.
	if (hasPct && n > 100) return n / 10000;
	// Standard: "3.94" or "3.94%" both mean 3.94% → divide by 100
	return n / 100;
}

// ---- ISO week calculation ----

export function toIsoWeek(dateStr: string): string {
	const date = new Date(dateStr + "T00:00:00Z");
	// Set to nearest Thursday: current date + 4 - current day number (Mon=1)
	const dayOfWeek = date.getUTCDay() || 7; // Sunday=7
	const nearestThursday = new Date(date);
	nearestThursday.setUTCDate(date.getUTCDate() + 4 - dayOfWeek);

	const yearStart = new Date(Date.UTC(nearestThursday.getUTCFullYear(), 0, 1));
	const weekNum = Math.ceil(
		((nearestThursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
	);
	const year = nearestThursday.getUTCFullYear();
	return `${year}-W${String(weekNum).padStart(2, "0")}`;
}

// ---- Header validation ----

// Each group is an OR set — at least one column from the group must be present.
function validateHeaders(
	headers: string[],
	required: string[][],
	fileType: CsvFileType,
): void {
	const missing = required
		.filter((group) => !group.some((col) => headers.includes(col)))
		.map((group) => group[0]); // report the first alias as the "missing" name
	if (missing.length > 0) {
		throw new ParseError(fileType, missing);
	}
}

// ---- Generic row normaliser ----

function normaliseRow<T>(
	raw: Record<string, string>,
	columnMap: Record<string, string>,
	numericFields: Set<string>,
	pctFields: Set<string>,
): T {
	const result: Record<string, unknown> = {};
	for (const [krCol, fieldName] of Object.entries(columnMap)) {
		const rawVal = raw[krCol] ?? "";
		// Skip empty values — prevents alias columns from overwriting with zero/"".
		// The first non-empty alias encountered wins.
		if (rawVal === "" && fieldName in result) continue;
		if (pctFields.has(fieldName)) {
			result[fieldName] = parsePct(rawVal);
		} else if (numericFields.has(fieldName)) {
			result[fieldName] = parseKrwNumber(rawVal);
		} else {
			result[fieldName] = rawVal.trim();
		}
	}
	return result as T;
}

// ---- File readers ----

function parseCsvText(text: string): Record<string, string>[] {
	return Papa.parse<Record<string, string>>(text, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (h) => h.trim(),
	}).data;
}

function hasKoreanHeaders(rows: Record<string, string>[]): boolean {
	if (rows.length === 0) return false;
	return /[\uAC00-\uD7A3]/.test(Object.keys(rows[0])[0] ?? "");
}

function readTextWith(file: File, encoding: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			let text = e.target?.result as string;
			if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
			resolve(text);
		};
		reader.onerror = () => reject(new Error("파일 읽기 실패"));
		reader.readAsText(file, encoding);
	});
}

async function readCsvRows(file: File): Promise<Record<string, string>[]> {
	const utf8Text = await readTextWith(file, "utf-8");
	const utf8Rows = parseCsvText(utf8Text);
	if (hasKoreanHeaders(utf8Rows)) return utf8Rows;

	// UTF-8로 읽었을 때 한글 헤더가 없으면 EUC-KR로 재시도 (FB 광고 관리자 한국어 내보내기)
	const eucKrText = await readTextWith(file, "euc-kr");
	return parseCsvText(eucKrText);
}

function readXlsxRows(file: File): Promise<Record<string, string>[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = e.target?.result as ArrayBuffer;
				const wb = XLSX.read(data, { type: "array", cellDates: false });
				const sheet = wb.Sheets[wb.SheetNames[0]];
				const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
					defval: "",
					raw: false, // always return as string
				});
				// Convert all cell values to string
				const strRows = rows.map((row) =>
					Object.fromEntries(
						Object.entries(row).map(([k, v]) => [k.trim(), String(v ?? "")]),
					),
				);
				resolve(strRows);
			} catch (err) {
				reject(new Error("xlsx 파일 읽기 실패"));
			}
		};
		reader.onerror = () => reject(new Error("파일 읽기 실패"));
		reader.readAsArrayBuffer(file);
	});
}

function isXlsx(file: File): boolean {
	return (
		file.name.endsWith(".xlsx") ||
		file.name.endsWith(".xls") ||
		file.type ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
}

async function readRows(
	file: File,
): Promise<{ rows: Record<string, string>[]; headers: string[] }> {
	const rows = isXlsx(file)
		? await readXlsxRows(file)
		: await readCsvRows(file);
	const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
	return { rows, headers };
}

// ---- Generic file parser ----

async function parseCsv<T>(
	file: File,
	fileType: CsvFileType,
	columnMap: Record<string, string>,
	requiredColumns: string[][],
	numericFields: Set<string>,
	pctFields: Set<string>,
	nameField: string,
): Promise<T[]> {
	const { rows, headers } = await readRows(file);
	validateHeaders(headers, requiredColumns, fileType);

	return rows
		.filter((row) => {
			const name =
				row[
					Object.keys(columnMap).find((k) => columnMap[k] === nameField) ?? ""
				] ?? "";
			return name.trim() !== "" && name.trim() !== "합계";
		})
		.map((row) => {
			const normalised = normaliseRow<T>(
				row,
				columnMap,
				numericFields,
				pctFields,
			);
			const asRecord = normalised as Record<string, unknown>;
			const reportStart = asRecord["reportStart"] as string;
			if (reportStart) {
				asRecord["isoWeek"] = toIsoWeek(reportStart);
			}
			return normalised;
		});
}

// ---- Campaign ----

const CAMPAIGN_NUMERIC = new Set([
	"dailyBudget",
	"totalBudget",
	"spend",
	"impressions",
	"reach",
	"linkClicks",
	"leads",
	"costPerLead",
	"cpm",
	"frequency",
	"videoViews",
	"landingPageViews",
]);
const CAMPAIGN_PCT = new Set(["linkCtr"]);

export async function parseCampaignCsv(file: File): Promise<CampaignRow[]> {
	return parseCsv<CampaignRow>(
		file,
		"campaign",
		CAMPAIGN_COLUMN_MAP,
		CAMPAIGN_REQUIRED_COLUMNS,
		CAMPAIGN_NUMERIC,
		CAMPAIGN_PCT,
		"campaignName",
	);
}

// ---- AdSet ----

const ADSET_NUMERIC = new Set([
	"dailyBudget",
	"spend",
	"impressions",
	"reach",
	"linkClicks",
	"leads",
	"costPerLead",
	"cpm",
	"frequency",
]);
const ADSET_PCT = new Set(["linkCtr"]);

export async function parseAdSetCsv(file: File): Promise<AdSetRow[]> {
	return parseCsv<AdSetRow>(
		file,
		"adset",
		ADSET_COLUMN_MAP,
		ADSET_REQUIRED_COLUMNS,
		ADSET_NUMERIC,
		ADSET_PCT,
		"adSetName",
	);
}

// ---- Ad ----

const AD_NUMERIC = new Set([
	"spend",
	"impressions",
	"reach",
	"linkClicks",
	"leads",
	"costPerLead",
	"cpm",
]);
const AD_PCT = new Set(["linkCtr"]);

export async function parseAdCsv(file: File): Promise<AdRow[]> {
	return parseCsv<AdRow>(
		file,
		"ad",
		AD_COLUMN_MAP,
		AD_REQUIRED_COLUMNS,
		AD_NUMERIC,
		AD_PCT,
		"adName",
	);
}
