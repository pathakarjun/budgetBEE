import Sidebar from "@/components/Sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Sidebar />
			<main className="ml-[220px] h-screen border-l">{children}</main>
		</>
	);
}
