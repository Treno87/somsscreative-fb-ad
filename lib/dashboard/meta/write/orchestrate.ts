// 광고 생성 단계형 오케스트레이션 (서버측).
// 각 단계가 생성된 id 를 빌드상태 파일에 저장 → 다음 단계가 이어받는다(휴먼인더루프 재개).
//   plan      : 검증 + payload 출력 (쓰기 0, dry-run)
//   structure : 캠페인 + 광고세트 생성 (PAUSED)
//   creative  : 자산 업로드 + 크리에이티브 생성 + 실미리보기 수집 (사람 확인 대기)
//   ad        : 광고 생성 (PAUSED, 크리에이티브 연결)

import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { type FetchFn } from "../client";
import { assertWriteConfig, type MetaConfig, loadMetaConfig } from "../config";
import {
	buildAdPayload,
	buildAdSetPayload,
	buildCampaignPayload,
	buildCreativePayload,
	type CreativeAsset,
	type Payload,
} from "./payloads";
import { type AdSpec, type CreativeSpec, validateSpec } from "./adspec";
import { MetaWriteClient } from "./writeClient";

export type Phase = "plan" | "structure" | "creative" | "ad";

export interface AdBuildEntry {
	name: string;
	creativeId?: string;
	adId?: string;
	preview?: string; // 미리보기 iframe HTML
}

export interface BuildState {
	slug: string;
	specPath?: string;
	campaignId?: string;
	adSetId?: string;
	ads: AdBuildEntry[];
	updatedAt: string;
}

const STORE_DIR = path.join(process.cwd(), "analytics", "store");

/** course/batch/campaign 이름으로 안전한 파일 슬러그 생성. */
export function buildSlug(spec: AdSpec): string {
	return [spec.course, spec.batch, spec.campaign.name]
		.join("-")
		.replace(/[^a-zA-Z0-9가-힣]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}

function stateFile(slug: string): string {
	return path.join(STORE_DIR, `adbuild-${slug}.json`);
}

export async function loadBuildState(slug: string): Promise<BuildState | null> {
	try {
		const raw = await fs.readFile(stateFile(slug), "utf-8");
		return JSON.parse(raw) as BuildState;
	} catch {
		return null;
	}
}

async function saveBuildState(state: BuildState): Promise<void> {
	await fs.mkdir(STORE_DIR, { recursive: true });
	state.updatedAt = new Date().toISOString();
	await fs.writeFile(stateFile(state.slug), JSON.stringify(state, null, 2));
}

function resolveAsset(assetPath: string): string {
	return path.isAbsolute(assetPath)
		? assetPath
		: path.join(process.cwd(), assetPath);
}

export interface OrchestrateOptions {
	config?: MetaConfig;
	fetchFn?: FetchFn;
}

export interface PhaseResult {
	phase: Phase;
	slug: string;
	state: BuildState;
	payloads?: Record<string, Payload>; // plan 단계에서만
	previews?: { name: string; preview: string }[]; // creative 단계에서만
	errors?: string[];
}

/** 외부 진입점: 단계 하나를 실행한다. */
export async function runPhase(
	phase: Phase,
	spec: AdSpec,
	opts: OrchestrateOptions = {},
): Promise<PhaseResult> {
	const config = opts.config ?? loadMetaConfig();
	const slug = buildSlug(spec);

	// 모든 쓰기 단계는 스펙 검증 통과가 선행 조건.
	const errors = validateSpec(spec, {
		fileExists: existsSyncSafe,
	});
	if (errors.length > 0) {
		return { phase, slug, state: emptyState(slug), errors };
	}

	if (phase === "plan") return runPlan(phase, spec, slug, config);

	assertWriteConfig(config);
	const client = new MetaWriteClient({ config, fetchFn: opts.fetchFn });
	const state = (await loadBuildState(slug)) ?? emptyState(slug);

	if (phase === "structure") return runStructure(spec, slug, config, client, state);
	if (phase === "creative") return runCreative(spec, slug, config, client, state);
	return runAd(spec, slug, client, state);
}

function emptyState(slug: string): BuildState {
	return { slug, ads: [], updatedAt: new Date().toISOString() };
}

// 동기 존재검사 (validateSpec 의 fileExists 주입용).
function existsSyncSafe(p: string): boolean {
	try {
		return existsSync(resolveAsset(p));
	} catch {
		return false;
	}
}

function runPlan(
	phase: Phase,
	spec: AdSpec,
	slug: string,
	config: MetaConfig,
): PhaseResult {
	const campaign = buildCampaignPayload(spec);
	// adset/creative 는 id·hash 없이 미리보기용으로 구성(placeholder).
	const adSet = buildAdSetPayload(spec, "<campaign_id>", config.currencyOffset);
	return {
		phase,
		slug,
		state: emptyState(slug),
		payloads: { campaign, adSet },
	};
}

async function runStructure(
	spec: AdSpec,
	slug: string,
	config: MetaConfig,
	client: MetaWriteClient,
	state: BuildState,
): Promise<PhaseResult> {
	if (!state.campaignId) {
		const c = await client.createCampaign(buildCampaignPayload(spec));
		state.campaignId = c.id;
		await saveBuildState(state);
	}
	if (!state.adSetId) {
		const a = await client.createAdSet(
			buildAdSetPayload(spec, state.campaignId, config.currencyOffset),
		);
		state.adSetId = a.id;
		await saveBuildState(state);
	}
	return { phase: "structure", slug, state };
}

async function runCreative(
	spec: AdSpec,
	slug: string,
	config: MetaConfig,
	client: MetaWriteClient,
	state: BuildState,
): Promise<PhaseResult> {
	const cfg = { pageId: config.pageId!, instagramActorId: config.instagramActorId };
	const previews: { name: string; preview: string }[] = [];

	for (let i = 0; i < spec.ads.length; i++) {
		const ad = spec.ads[i];
		const entry = state.ads[i] ?? { name: ad.name };
		if (!entry.creativeId) {
			const asset = await uploadAsset(client, ad);
			const creative = await client.createAdCreative(
				buildCreativePayload(ad, cfg, asset),
			);
			entry.creativeId = creative.id;
			entry.preview = await client.generatePreview(creative.id);
			state.ads[i] = entry;
			await saveBuildState(state);
		}
		previews.push({ name: ad.name, preview: entry.preview ?? "" });
	}
	return { phase: "creative", slug, state, previews };
}

async function uploadAsset(
	client: MetaWriteClient,
	ad: CreativeSpec,
): Promise<CreativeAsset> {
	if (ad.type === "image") {
		const imageHash = await client.uploadImage(resolveAsset(ad.assetPath!));
		return { kind: "image", imageHash };
	}
	if (ad.type === "video") {
		const videoId = await client.uploadVideo(resolveAsset(ad.assetPath!));
		return { kind: "video", videoId };
	}
	const cardImageHashes: string[] = [];
	for (const card of ad.cards ?? []) {
		cardImageHashes.push(await client.uploadImage(resolveAsset(card.assetPath)));
	}
	return { kind: "carousel", cardImageHashes };
}

async function runAd(
	spec: AdSpec,
	slug: string,
	client: MetaWriteClient,
	state: BuildState,
): Promise<PhaseResult> {
	if (!state.adSetId) {
		return {
			phase: "ad",
			slug,
			state,
			errors: ["adSetId 없음 — 먼저 structure 단계를 실행하세요"],
		};
	}
	for (let i = 0; i < spec.ads.length; i++) {
		const ad = spec.ads[i];
		const entry = state.ads[i];
		if (!entry?.creativeId) {
			return {
				phase: "ad",
				slug,
				state,
				errors: [`ads[${i}] creativeId 없음 — 먼저 creative 단계를 실행하세요`],
			};
		}
		if (!entry.adId) {
			const created = await client.createAd(
				buildAdPayload(ad, state.adSetId, entry.creativeId),
			);
			entry.adId = created.id;
			await saveBuildState(state);
		}
	}
	return { phase: "ad", slug, state };
}
