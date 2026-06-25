// Meta Marketing API 연동 설정 — 환경변수에서 자격증명을 읽는다.
//
// .env.local 에 아래 값을 채우면 실제 연동이 동작한다. (코드는 값이 없어도 빌드/테스트 가능)
//   META_ACCESS_TOKEN     = 시스템 유저 장기 토큰 (ads_read 권한)
//   META_AD_ACCOUNT_ID    = act_XXXXXXXXXXXX  (act_ 접두사 포함)
//   META_API_VERSION      = v23.0  (선택, 기본값 아래)
//   META_CURRENCY_OFFSET  = 1      (선택, KRW=1 / USD 등 2자리 통화=100)
//   CRON_SECRET           = cron 라우트 보호용 임의 문자열

export const DEFAULT_API_VERSION = "v23.0";

export interface MetaConfig {
	accessToken: string;
	accountId: string; // act_ 접두사 포함
	apiVersion: string;
	currencyOffset: number; // Meta 예산값(최소 단위) → 통화 단위 변환 제수
	pageId?: string; // 광고 노출 주체 페이지 (creative object_story_spec.page_id) — 쓰기 전용
	instagramActorId?: string; // 선택: IG 노출용 actor — 쓰기 전용
}

export class MetaConfigError extends Error {
	constructor(missing: string[]) {
		super(
			`Meta API 환경변수 누락: ${missing.join(", ")} — .env.local 을 확인하세요.`,
		);
		this.name = "MetaConfigError";
	}
}

/** act_ 접두사를 보정한다. */
function normaliseAccountId(raw: string): string {
	const id = raw.trim();
	return id.startsWith("act_") ? id : `act_${id}`;
}

/**
 * 환경변수에서 Meta 설정을 읽는다. 필수값이 없으면 MetaConfigError.
 * 서버(라우트/스크립트)에서만 호출할 것 — 토큰을 클라이언트에 노출하지 않는다.
 */
export function loadMetaConfig(
	env: NodeJS.ProcessEnv = process.env,
): MetaConfig {
	const accessToken = env.META_ACCESS_TOKEN?.trim() ?? "";
	const rawAccountId = env.META_AD_ACCOUNT_ID?.trim() ?? "";

	const missing: string[] = [];
	if (!accessToken) missing.push("META_ACCESS_TOKEN");
	if (!rawAccountId) missing.push("META_AD_ACCOUNT_ID");
	if (missing.length > 0) throw new MetaConfigError(missing);

	const offsetRaw = Number(env.META_CURRENCY_OFFSET);
	const currencyOffset =
		Number.isFinite(offsetRaw) && offsetRaw > 0 ? offsetRaw : 1;

	return {
		accessToken,
		accountId: normaliseAccountId(rawAccountId),
		apiVersion: env.META_API_VERSION?.trim() || DEFAULT_API_VERSION,
		currencyOffset,
		pageId: env.META_PAGE_ID?.trim() || undefined,
		instagramActorId: env.META_INSTAGRAM_ACTOR_ID?.trim() || undefined,
	};
}

/** 설정이 존재하는지(토큰+계정ID) 여부만 — UI에서 토큰 노출 없이 확인용. */
export function hasMetaConfig(env: NodeJS.ProcessEnv = process.env): boolean {
	return !!(env.META_ACCESS_TOKEN?.trim() && env.META_AD_ACCOUNT_ID?.trim());
}

/**
 * 쓰기(캠페인/소재 생성) 경로 전용 검증.
 * 크리에이티브는 page_id 가 반드시 필요하므로 누락 시 MetaConfigError.
 */
export function assertWriteConfig(config: MetaConfig): void {
	if (!config.pageId) throw new MetaConfigError(["META_PAGE_ID"]);
}
