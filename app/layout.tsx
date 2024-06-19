import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SignUpForm from "./components/form/SignUpForm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Caishen",
	description: "Personal Finance Tool",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main>
					<SignUpForm />
					{children}
				</main>
			</body>
		</html>
	);
}
