// ISO 8601 주차 계산 — CSV 파서와 Meta API 동기화가 공유한다.
// (csvParser는 xlsx/papaparse를 top-level import하므로, 서버 번들에 그 의존성을
//  끌고 오지 않도록 날짜 로직만 별도 모듈로 분리)

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
