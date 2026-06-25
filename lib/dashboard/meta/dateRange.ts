// 동기화 기간 계산 헬퍼. now 를 주입 가능하게 해 테스트한다.

import type { DateRange } from "./types";

function fmt(d: Date): string {
	return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/** 최근 N일 (오늘 포함). 예: lastNDays(7) → [today-6, today] */
export function lastNDays(n: number, now: Date = new Date()): DateRange {
	const until = new Date(now);
	const since = new Date(now);
	since.setUTCDate(since.getUTCDate() - (n - 1));
	return { since: fmt(since), until: fmt(until) };
}

/**
 * 직전 완료된 ISO 주차(월~일). cron 의 기본값으로 적합.
 * 예: 화요일에 실행하면 지지난 월요일~지난 일요일 범위.
 */
export function previousIsoWeek(now: Date = new Date()): DateRange {
	const d = new Date(now);
	const dow = d.getUTCDay() || 7; // Mon=1..Sun=7
	// 이번 주 월요일
	const thisMonday = new Date(d);
	thisMonday.setUTCDate(d.getUTCDate() - (dow - 1));
	// 지난 주 월요일~일요일
	const lastMonday = new Date(thisMonday);
	lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);
	const lastSunday = new Date(thisMonday);
	lastSunday.setUTCDate(thisMonday.getUTCDate() - 1);
	return { since: fmt(lastMonday), until: fmt(lastSunday) };
}
