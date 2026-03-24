import fs from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";

const WORKSPACE = path.join(process.cwd(), "audit-workspace");
const INPUT_DIR = path.join(WORKSPACE, "input");
const OUTPUT_DIR = path.join(WORKSPACE, "output");
const REPORT_FILE = path.join(OUTPUT_DIR, "report.json");

export async function GET() {
	try {
		const content = await fs.readFile(REPORT_FILE, "utf-8");
		return NextResponse.json(JSON.parse(content));
	} catch {
		return NextResponse.json(null);
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (body.action === "save-input") {
		await fs.mkdir(INPUT_DIR, { recursive: true });
		await Promise.all([
			fs.writeFile(
				path.join(INPUT_DIR, "campaigns.json"),
				JSON.stringify(body.campaigns, null, 2),
			),
			fs.writeFile(
				path.join(INPUT_DIR, "adsets.json"),
				JSON.stringify(body.adSets, null, 2),
			),
			fs.writeFile(
				path.join(INPUT_DIR, "ads.json"),
				JSON.stringify(body.ads, null, 2),
			),
		]);
		return NextResponse.json({ ok: true });
	}

	if (body.action === "save-results") {
		await fs.mkdir(OUTPUT_DIR, { recursive: true });
		await fs.writeFile(REPORT_FILE, JSON.stringify(body.report, null, 2));
		return NextResponse.json({ ok: true });
	}

	return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
