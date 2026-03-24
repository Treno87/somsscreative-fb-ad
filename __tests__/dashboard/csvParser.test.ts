import iconv from "iconv-lite";
import {
	ParseError,
	parseAdCsv,
	parseAdSetCsv,
	parseCampaignCsv,
	parseKrwNumber,
	parsePct,
	toIsoWeek,
} from "@/lib/dashboard/csvParser";

// Helper to create a File from CSV string
function makeFile(content: string, name = "test.csv"): File {
	const bom = ""; // no BOM by default
	return new File([bom + content], name, { type: "text/csv" });
}

// EUC-KR 인코딩 파일 생성 헬퍼
function encodeEucKr(content: string): Uint8Array {
	return iconv.encode(content, "euc-kr");
}

function makeBomFile(content: string, name = "test.csv"): File {
	const bom = "\uFEFF";
	return new File([bom + content], name, { type: "text/csv" });
}

// Minimal valid CSV rows
const CAMPAIGN_HEADERS =
	'캠페인 ID,캠페인 이름,게재,캠페인 목표,예산 유형,일일 예산,총 예산,지출 금액,노출,도달,링크 클릭,링크 클릭률(CTR),리드,리드당 비용,"1,000회 노출당 비용(CPM)",게재빈도,동영상 재생,보고 시작,보고 종료';
const CAMPAIGN_ROW =
	"123,클래식 코스,활성,리드 생성,일일,50000,350000,48000,10000,8000,300,0.03,5,9600,4800,1.25,200,2026-03-21,2026-03-27";
const CAMPAIGN_TOTAL_ROW = "합계,,,,,,,,,,,,,,,,,,";

const ADSET_HEADERS =
	'광고 세트 ID,광고 세트 이름,캠페인 ID,캠페인 이름,게재,오디언스 유형,일일 예산,지출 금액,노출,도달,링크 클릭,링크 클릭률(CTR),리드,리드당 비용,"1,000회 노출당 비용(CPM)",게재빈도,보고 시작,보고 종료';
const ADSET_ROW =
	"456,팔로워 세트,123,클래식 코스,활성,팔로워,30000,29000,6000,5000,180,0.03,3,9666,4833,1.2,2026-03-21,2026-03-27";

const AD_HEADERS =
	'광고 ID,광고 이름,광고 세트 ID,광고 세트 이름,캠페인 ID,캠페인 이름,게재,지출 금액,노출,도달,링크 클릭,링크 클릭률(CTR),리드,리드당 비용,"1,000회 노출당 비용(CPM)",보고 시작,보고 종료';
const AD_ROW =
	"789,광고 A,456,팔로워 세트,123,클래식 코스,활성,29000,6000,5000,180,0.03,3,9666,4833,2026-03-21,2026-03-27";

// --------------- parseKrwNumber ---------------
describe("parseKrwNumber", () => {
	it("₩1,234 → 1234", () => expect(parseKrwNumber("₩1,234")).toBe(1234));
	it("KRW 5,000 → 5000", () => expect(parseKrwNumber("KRW 5,000")).toBe(5000));
	it("숫자 문자열 그대로", () => expect(parseKrwNumber("48000")).toBe(48000));
	it("쉼표 제거", () => expect(parseKrwNumber("1,000,000")).toBe(1000000));
	it("공백 제거", () => expect(parseKrwNumber(" 9 600 ")).toBe(9600));
	it("빈 문자열 → 0", () => expect(parseKrwNumber("")).toBe(0));
	it("- 문자 → 0", () => expect(parseKrwNumber("-")).toBe(0));
});

// --------------- parsePct ---------------
describe("parsePct", () => {
	it("7.53% → 0.0753", () => expect(parsePct("7.53%")).toBeCloseTo(0.0753));
	it("3% → 0.03", () => expect(parsePct("3%")).toBeCloseTo(0.03));
	it("이미 소수점 형태 → 그대로", () =>
		expect(parsePct("0.03")).toBeCloseTo(0.03));
	it("빈 문자열 → 0", () => expect(parsePct("")).toBe(0));
});

// --------------- toIsoWeek ---------------
describe("toIsoWeek", () => {
	it("2026-03-21 → 2026-W12", () =>
		expect(toIsoWeek("2026-03-21")).toBe("2026-W12"));
	it("2026-01-01 → 2026-W01", () =>
		expect(toIsoWeek("2026-01-01")).toBe("2026-W01"));
	it("2025-12-29 → 2026-W01 (ISO 연도 넘어감)", () =>
		expect(toIsoWeek("2025-12-29")).toBe("2026-W01"));
});

// --------------- parseCampaignCsv ---------------
describe("parseCampaignCsv", () => {
	it("유효한 CSV → CampaignRow[] 반환", async () => {
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${CAMPAIGN_ROW}`);
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(1);
		expect(rows[0].campaignName).toBe("클래식 코스");
		expect(rows[0].spend).toBe(48000);
	});

	it('"합계" 행 자동 필터링', async () => {
		const file = makeFile(
			`${CAMPAIGN_HEADERS}\n${CAMPAIGN_ROW}\n${CAMPAIGN_TOTAL_ROW}`,
		);
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(1);
	});

	it("빈 campaignName 행 필터링", async () => {
		const emptyNameRow = CAMPAIGN_ROW.replace("클래식 코스", "");
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${emptyNameRow}`);
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(0);
	});

	it("reportStart → isoWeek 자동 변환", async () => {
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${CAMPAIGN_ROW}`);
		const rows = await parseCampaignCsv(file);
		expect(rows[0].isoWeek).toBe("2026-W12");
	});

	it("UTF-8 BOM 있는 파일 정상 파싱", async () => {
		const file = makeBomFile(`${CAMPAIGN_HEADERS}\n${CAMPAIGN_ROW}`);
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(1);
	});

	it("EUC-KR 인코딩 파일: UTF-8로 읽으면 헤더가 깨져 ParseError 발생하지 않도록 EUC-KR 재시도", async () => {
		// EUC-KR 인코딩 바이트를 직접 생성
		const eucKrBytes = encodeEucKr(`${CAMPAIGN_HEADERS}\n${CAMPAIGN_ROW}`);
		const file = new File([eucKrBytes], "euckr.csv", { type: "text/csv" });
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(1);
		expect(rows[0].campaignName).toBe("클래식 코스");
	});

	it("inactive 캠페인도 포함", async () => {
		const inactiveRow = CAMPAIGN_ROW.replace("활성", "비활성");
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${inactiveRow}`);
		const rows = await parseCampaignCsv(file);
		expect(rows).toHaveLength(1);
	});

	it("필수 헤더 누락 시 ParseError throw", async () => {
		const badHeaders = "캠페인 ID,캠페인 이름";
		const file = makeFile(`${badHeaders}\n123,테스트`);
		await expect(parseCampaignCsv(file)).rejects.toBeInstanceOf(ParseError);
	});

	it("ParseError에 missingColumns 포함", async () => {
		const badHeaders = "캠페인 ID,캠페인 이름";
		const file = makeFile(`${badHeaders}\n123,테스트`);
		const err = await parseCampaignCsv(file).catch((e) => e);
		expect(err.missingColumns.length).toBeGreaterThan(0);
		expect(err.fileType).toBe("campaign");
	});

	it('링크 클릭률(CTR) "7.53%" → 0.0753', async () => {
		const pctRow = CAMPAIGN_ROW.replace(",0.03,", ",7.53%,");
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${pctRow}`);
		const rows = await parseCampaignCsv(file);
		expect(rows[0].linkCtr).toBeCloseTo(0.0753);
	});

	it('지출 금액 "₩48,000" 형식 파싱', async () => {
		const krwRow = CAMPAIGN_ROW.replace(",48000,", ',"₩48,000",');
		const file = makeFile(`${CAMPAIGN_HEADERS}\n${krwRow}`);
		const rows = await parseCampaignCsv(file);
		expect(rows[0].spend).toBe(48000);
	});
});

// --------------- parseAdSetCsv ---------------
describe("parseAdSetCsv", () => {
	it("유효한 CSV → AdSetRow[] 반환", async () => {
		const file = makeFile(`${ADSET_HEADERS}\n${ADSET_ROW}`);
		const rows = await parseAdSetCsv(file);
		expect(rows).toHaveLength(1);
		expect(rows[0].adSetName).toBe("팔로워 세트");
	});

	it("필수 헤더 누락 시 ParseError throw", async () => {
		const file = makeFile("광고 세트 ID,광고 세트 이름\n1,테스트");
		await expect(parseAdSetCsv(file)).rejects.toBeInstanceOf(ParseError);
	});
});

// --------------- parseAdCsv ---------------
describe("parseAdCsv", () => {
	it("유효한 CSV → AdRow[] 반환", async () => {
		const file = makeFile(`${AD_HEADERS}\n${AD_ROW}`);
		const rows = await parseAdCsv(file);
		expect(rows).toHaveLength(1);
		expect(rows[0].adName).toBe("광고 A");
	});

	it("필수 헤더 누락 시 ParseError throw", async () => {
		const file = makeFile("광고 ID,광고 이름\n1,테스트");
		await expect(parseAdCsv(file)).rejects.toBeInstanceOf(ParseError);
	});
});
