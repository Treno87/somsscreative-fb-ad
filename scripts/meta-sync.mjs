#!/usr/bin/env node
// 시스템 cron 용 동기화 트리거. 실행 중인 Next 서버의 /api/meta/cron 을 호출한다.
//
// 환경변수:
//   META_SYNC_BASE_URL   기본 http://localhost:3000
//   CRON_SECRET          /api/meta/cron 인증 시크릿 (필수)
//   META_SYNC_DAYS       선택 — 최근 N일 (미지정 시 직전 ISO 주차)
//
// crontab 예시 (매주 월요일 09:00, 지난 주 데이터 수집):
//   0 9 * * 1  cd /home/ken/project/somsscreative-fb-ad && node scripts/meta-sync.mjs >> /tmp/meta-sync.log 2>&1

const base = process.env.META_SYNC_BASE_URL || "http://localhost:3000";
const secret = process.env.CRON_SECRET;
const days = process.env.META_SYNC_DAYS;

if (!secret) {
	console.error("[meta-sync] CRON_SECRET 미설정 — 중단");
	process.exit(1);
}

const url = new URL("/api/meta/cron", base);
if (days) url.searchParams.set("days", days);

try {
	const res = await fetch(url, {
		headers: { authorization: `Bearer ${secret}` },
	});
	const json = await res.json();
	if (!res.ok || json.ok === false) {
		console.error(`[meta-sync] 실패 (HTTP ${res.status}):`, json.error ?? json);
		process.exit(1);
	}
	console.log(
		`[meta-sync] 완료 weeks=${(json.weeks || []).join(",")} totals=`,
		json.totals,
	);
} catch (err) {
	console.error("[meta-sync] 요청 오류:", err.message);
	process.exit(1);
}
