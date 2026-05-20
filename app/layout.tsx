import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clashGrotesk = localFont({
	src: "../public/fonts/ClashGrotesk-Variable.woff2",
	variable: "--font-clash",
	display: "swap",
	weight: "200 700",
});

const cabinetGrotesk = localFont({
	src: "../public/fonts/CabinetGrotesk-Variable.woff2",
	variable: "--font-cabinet",
	display: "swap",
	weight: "100 900",
});

const spaceGrotesk = localFont({
	src: "../public/fonts/SpaceGrotesk-Variable.woff2",
	variable: "--font-space",
	display: "swap",
	weight: "300 700",
});

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
		<html
			lang="ko"
			className={`${clashGrotesk.variable} ${cabinetGrotesk.variable} ${spaceGrotesk.variable}`}
		>
			<body>{children}</body>
		</html>
	);
}
