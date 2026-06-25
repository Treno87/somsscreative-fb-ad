import { syncFromMeta } from "@/lib/dashboard/meta/sync";
import type { MetaConfig } from "@/lib/dashboard/meta/config";

const CONFIG: MetaConfig = {
	accessToken: "TOKEN",
	accountId: "act_123",
	apiVersion: "v23.0",
	currencyOffset: 1,
};

function jsonResponse(body: unknown): Response {
	return {
		ok: true,
		status: 200,
		json: async () => body,
	} as unknown as Response;
}

// URL 의 엔드포인트에 따라 목 응답을 라우팅하는 fetch
function makeFetch(): typeof fetch {
	return (async (input: RequestInfo | URL) => {
		const url = String(input);
		if (url.includes("/insights") && url.includes("level=campaign")) {
			return jsonResponse({
				data: [
					{
						campaign_id: "c1",
						campaign_name: "캠페인 1",
						spend: "100000",
						impressions: "10000",
						inline_link_clicks: "200",
						inline_link_click_ctr: "2.0",
						actions: [{ action_type: "lead", value: "20" }],
						date_start: "2026-05-26",
						date_stop: "2026-06-01",
					},
				],
			});
		}
		if (url.includes("/insights") && url.includes("level=adset")) {
			return jsonResponse({
				data: [
					{
						adset_id: "as1",
						campaign_id: "c1",
						spend: "60000",
						actions: [{ action_type: "lead", value: "12" }],
						date_start: "2026-05-26",
						date_stop: "2026-06-01",
					},
				],
			});
		}
		if (url.includes("/insights") && url.includes("level=ad")) {
			return jsonResponse({
				data: [
					{
						ad_id: "ad1",
						adset_id: "as1",
						campaign_id: "c1",
						spend: "30000",
						actions: [{ action_type: "lead", value: "6" }],
						date_start: "2026-05-26",
						date_stop: "2026-06-01",
					},
				],
			});
		}
		if (url.includes("/campaigns")) {
			return jsonResponse({
				data: [
					{
						id: "c1",
						name: "캠페인 1",
						objective: "OUTCOME_LEADS",
						effective_status: "ACTIVE",
						daily_budget: "50000",
					},
				],
			});
		}
		if (url.includes("/adsets")) {
			return jsonResponse({
				data: [
					{ id: "as1", campaign_id: "c1", daily_budget: "30000" },
				],
			});
		}
		if (url.includes("/ads")) {
			return jsonResponse({
				data: [{ id: "ad1", adset_id: "as1", effective_status: "ACTIVE" }],
			});
		}
		throw new Error(`unexpected url: ${url}`);
	}) as unknown as typeof fetch;
}

describe("syncFromMeta", () => {
	it("3계층 insight + 메타데이터를 병합해 WeekSnapshot 생성", async () => {
		const result = await syncFromMeta({
			range: { since: "2026-05-26", until: "2026-06-01" },
			config: CONFIG,
			fetchFn: makeFetch(),
			uploadedAt: "2026-06-23T00:00:00.000Z",
		});

		expect(result.totals).toEqual({ campaigns: 1, adSets: 1, ads: 1 });
		expect(result.snapshots).toHaveLength(1);

		const snap = result.snapshots[0];
		expect(snap.isoWeek).toBe("2026-W22");
		expect(snap.campaigns[0].objective).toBe("OUTCOME_LEADS");
		expect(snap.campaigns[0].dailyBudget).toBe(50000);
		expect(snap.campaigns[0].costPerLead).toBe(5000); // 100000/20
		expect(snap.adSets[0].dailyBudget).toBe(30000);
		expect(snap.ads[0].status).toBe("ACTIVE");
		expect(snap.ads[0].costPerLead).toBe(5000); // 30000/6
	});

	it("잘못된 날짜 형식이면 에러", async () => {
		await expect(
			syncFromMeta({
				range: { since: "2026/05/26", until: "2026-06-01" },
				config: CONFIG,
				fetchFn: makeFetch(),
			}),
		).rejects.toThrow(/날짜 형식/);
	});
});
