// Meta Graph API 쓰기(생성) 클라이언트.
// 읽기 client.ts 와 동형: 생성자 {config, fetchFn}, 에러는 MetaApiError 로 통일.
// fetchFn 주입으로 단위 테스트(목 응답) 가능. 자산 업로드만 fs(파일)를 읽는다.

import fs from "fs/promises";
import path from "path";
import { type FetchFn, MetaApiError } from "../client";
import type { MetaConfig } from "../config";
import type { Payload } from "./payloads";

const GRAPH_BASE = "https://graph.facebook.com";

export interface WriteClientOptions {
	config: MetaConfig;
	fetchFn?: FetchFn;
}

/** 생성 응답: 보통 {id}. */
export interface CreatedEntity {
	id: string;
}

/** 중첩 객체/배열은 JSON 문자열로, 스칼라는 문자열로 직렬화한다. */
export function serializePayload(payload: Payload): URLSearchParams {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(payload)) {
		if (value === undefined || value === null) continue;
		params.set(
			key,
			typeof value === "object" ? JSON.stringify(value) : String(value),
		);
	}
	return params;
}

export class MetaWriteClient {
	private config: MetaConfig;
	private fetchFn: FetchFn;

	constructor({ config, fetchFn }: WriteClientOptions) {
		this.config = config;
		this.fetchFn = fetchFn ?? fetch;
	}

	private url(pathSeg: string): string {
		return `${GRAPH_BASE}/${this.config.apiVersion}/${pathSeg}`;
	}

	/** 공통 응답 파싱: !ok 또는 error 필드면 MetaApiError. */
	private async parse<T>(res: Response): Promise<T> {
		const json = (await res.json()) as T & {
			error?: { message: string; fbtrace_id?: string };
		};
		if (!res.ok || json.error) {
			throw new MetaApiError(
				json.error?.message ?? `Graph API 쓰기 오류 (HTTP ${res.status})`,
				res.status,
				json.error?.fbtrace_id,
			);
		}
		return json;
	}

	/** form-urlencoded POST (access_token 자동 첨부). */
	private async post<T>(pathSeg: string, payload: Payload): Promise<T> {
		const body = serializePayload(payload);
		body.set("access_token", this.config.accessToken);
		const res = await this.fetchFn(this.url(pathSeg), {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body,
		});
		return this.parse<T>(res);
	}

	createCampaign(payload: Payload): Promise<CreatedEntity> {
		return this.post<CreatedEntity>(`${this.config.accountId}/campaigns`, payload);
	}

	createAdSet(payload: Payload): Promise<CreatedEntity> {
		return this.post<CreatedEntity>(`${this.config.accountId}/adsets`, payload);
	}

	createAdCreative(payload: Payload): Promise<CreatedEntity> {
		return this.post<CreatedEntity>(
			`${this.config.accountId}/adcreatives`,
			payload,
		);
	}

	createAd(payload: Payload): Promise<CreatedEntity> {
		return this.post<CreatedEntity>(`${this.config.accountId}/ads`, payload);
	}

	/** 이미지 업로드(multipart) → image_hash 반환. */
	async uploadImage(filePath: string): Promise<string> {
		const json = await this.uploadFile<{
			images?: Record<string, { hash: string; url: string }>;
		}>(`${this.config.accountId}/adimages`, filePath);
		const first = json.images && Object.values(json.images)[0];
		if (!first?.hash) {
			throw new MetaApiError("이미지 업로드 응답에 hash 없음", 502);
		}
		return first.hash;
	}

	/** 동영상 업로드(multipart, 단순 업로드) → video_id 반환. */
	async uploadVideo(filePath: string): Promise<string> {
		const json = await this.uploadFile<{ id?: string }>(
			`${this.config.accountId}/advideos`,
			filePath,
		);
		if (!json.id) throw new MetaApiError("동영상 업로드 응답에 id 없음", 502);
		return json.id;
	}

	private async uploadFile<T>(pathSeg: string, filePath: string): Promise<T> {
		const data = await fs.readFile(filePath);
		const form = new FormData();
		form.set("access_token", this.config.accessToken);
		form.set("source", new Blob([data]), path.basename(filePath));
		const res = await this.fetchFn(this.url(pathSeg), {
			method: "POST",
			body: form,
		});
		return this.parse<T>(res);
	}

	/**
	 * 크리에이티브 실미리보기 HTML(iframe) 을 받는다 — 휴먼인더루프 검토용.
	 * ad_format: MOBILE_FEED_STANDARD | INSTAGRAM_STANDARD | DESKTOP_FEED_STANDARD …
	 */
	async generatePreview(
		creativeId: string,
		adFormat = "MOBILE_FEED_STANDARD",
	): Promise<string> {
		const url = new URL(this.url(`${creativeId}/previews`));
		url.searchParams.set("ad_format", adFormat);
		url.searchParams.set("access_token", this.config.accessToken);
		const res = await this.fetchFn(url.toString());
		const json = await this.parse<{ data?: { body: string }[] }>(res);
		return json.data?.[0]?.body ?? "";
	}
}
