import { MetaApiError } from "@/lib/dashboard/meta/client";
import type { MetaConfig } from "@/lib/dashboard/meta/config";
import {
	MetaWriteClient,
	serializePayload,
} from "@/lib/dashboard/meta/write/writeClient";

const CONFIG: MetaConfig = {
	accessToken: "TOKEN",
	accountId: "act_123",
	apiVersion: "v23.0",
	currencyOffset: 1,
	pageId: "PAGE1",
};

interface Captured {
	url: string;
	method: string;
	body?: URLSearchParams;
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
	return { ok, status, json: async () => body } as unknown as Response;
}

describe("serializePayload", () => {
	it("스칼라는 문자열, 중첩 객체/배열은 JSON 문자열", () => {
		const p = serializePayload({
			name: "캠페인",
			special_ad_categories: [],
			promoted_object: { pixel_id: "PX" },
			skip: undefined,
		});
		expect(p.get("name")).toBe("캠페인");
		expect(p.get("special_ad_categories")).toBe("[]");
		expect(p.get("promoted_object")).toBe('{"pixel_id":"PX"}');
		expect(p.has("skip")).toBe(false);
	});
});

describe("MetaWriteClient", () => {
	it("createCampaign — 올바른 URL·POST·body·access_token", async () => {
		const captured: Captured = { url: "", method: "" };
		const fetchFn = (async (input: RequestInfo | URL, init?: RequestInit) => {
			captured.url = String(input);
			captured.method = init?.method ?? "GET";
			captured.body = init?.body as URLSearchParams;
			return jsonResponse({ id: "C1" });
		}) as typeof fetch;

		const client = new MetaWriteClient({ config: CONFIG, fetchFn });
		const res = await client.createCampaign({ name: "캠페인", status: "PAUSED" });

		expect(res.id).toBe("C1");
		expect(captured.method).toBe("POST");
		expect(captured.url).toBe(
			"https://graph.facebook.com/v23.0/act_123/campaigns",
		);
		expect(captured.body?.get("name")).toBe("캠페인");
		expect(captured.body?.get("status")).toBe("PAUSED");
		expect(captured.body?.get("access_token")).toBe("TOKEN");
	});

	it("createAdSet/createAd 도 각 엣지로 POST", async () => {
		const urls: string[] = [];
		const fetchFn = (async (input: RequestInfo | URL) => {
			urls.push(String(input));
			return jsonResponse({ id: "X" });
		}) as typeof fetch;
		const client = new MetaWriteClient({ config: CONFIG, fetchFn });
		await client.createAdSet({ name: "as" });
		await client.createAd({ name: "ad" });
		expect(urls[0]).toContain("/act_123/adsets");
		expect(urls[1]).toContain("/act_123/ads");
	});

	it("Graph 오류 응답 → MetaApiError", async () => {
		const fetchFn = (async () =>
			jsonResponse(
				{ error: { message: "권한 없음", fbtrace_id: "tr1" } },
				false,
				400,
			)) as typeof fetch;
		const client = new MetaWriteClient({ config: CONFIG, fetchFn });
		await expect(client.createCampaign({ name: "x" })).rejects.toBeInstanceOf(
			MetaApiError,
		);
	});

	it("generatePreview — previews 엣지 GET·body 추출", async () => {
		let calledUrl = "";
		const fetchFn = (async (input: RequestInfo | URL) => {
			calledUrl = String(input);
			return jsonResponse({ data: [{ body: "<iframe src='x'></iframe>" }] });
		}) as typeof fetch;
		const client = new MetaWriteClient({ config: CONFIG, fetchFn });
		const html = await client.generatePreview("CR1", "MOBILE_FEED_STANDARD");
		expect(html).toBe("<iframe src='x'></iframe>");
		expect(calledUrl).toContain("/v23.0/CR1/previews");
		expect(calledUrl).toContain("ad_format=MOBILE_FEED_STANDARD");
	});
});
