import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "BudgetBee",
	description: "Personal Finance Tool",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<main>
						{children}
						<Toaster richColors position="top-right" />
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
