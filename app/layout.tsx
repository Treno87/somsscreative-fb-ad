import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		template: "%s | 소옴크리에이티브",
		default: "소옴크리에이티브",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ko">
			<body>{children}</body>
		</html>
	);
}
