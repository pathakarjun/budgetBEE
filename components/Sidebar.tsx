"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SidebarButton from "./Sidebar-button";
import {
	FileBarChart,
	LayoutDashboard,
	LineChartIcon,
	LogOut,
	Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Sidebar = () => {
	const [userName, setUserName] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [firstName, setfirstName] = useState<string | null>(null);
	const [lastName, setlastName] = useState<string | null>(null);

	useEffect(() => {
		const getSession = async () => {
			const session = await fetch("/api/session");
			const sessionData = await session.json();
			if (sessionData) {
				setUserName(sessionData.user.username);
				setEmail(sessionData.user.email);
				setfirstName(sessionData.user.firstName);
				setlastName(sessionData.user.lastName);
			}
		};
		getSession();
	}, []);

	return (
		<aside className="w-[200px max-w-xs h-screen fixed left-0 top-0]">
			<div className="h-full px-4 py-4 flex flex-col justify-between">
				<div className="h-1/4">
					<Avatar className="h-16 w-16 mt-3 ml-4">
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<Link href="/dashboard">
						<SidebarButton icon={LayoutDashboard}>Dashboard</SidebarButton>
					</Link>
					<Link href="/analytics">
						<SidebarButton icon={LineChartIcon}>Analytics</SidebarButton>
					</Link>
					<Link href="/transactions">
						<SidebarButton icon={FileBarChart}>Transactions</SidebarButton>
					</Link>
					<Link href="/settings">
						<SidebarButton icon={Settings}>Settings</SidebarButton>
					</Link>
				</div>
				<hr />
				<SidebarButton icon={LogOut} onClick={() => signOut()} className="mb-5">
					Log Out
				</SidebarButton>
			</div>
		</aside>
	);
};

export default Sidebar;
