import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SignInForm from "./components/form/SignInForm";
import { Toaster } from "sonner";

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
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </body>
    </html>
  );
}
