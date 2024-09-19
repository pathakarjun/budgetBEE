"use client";

import Link from "next/link";
import React from "react";
import SidebarButton from "./Sidebar-button";
import {
	FileBarChart,
	LayoutDashboard,
	LineChartIcon,
	LogOut,
	Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
	return (
		<aside className="w-[200px max-w-xs h-screen fixed left-0 top-0]">
			<div className="h-full px-4 py-4 flex flex-col justify-between">
				<div className="h-1/3"></div>
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
