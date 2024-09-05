"use client";

import RecentTransactions from "@/components/RecentTransactions";
import RecordTransactionForm from "@/components/forms/RecordTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const page = () => {
	const [userId, setUserId] = useState("");

	useEffect(() => {
		const getSession = async () => {
			const session = await fetch("/api/session");
			const sessionData = await session.json();
			if (sessionData) {
				setUserId(sessionData.user.id);
			}
		};
		getSession();
	}, []);

	return (
		<ScrollArea className="h-full">
			<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
				<RecordTransactionForm userId={userId} />
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Income
							</CardTitle>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="h-4 w-4 text-muted-foreground"
							>
								<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$4,355.89</div>
							<p className="text-xs text-muted-foreground">
								+0% from last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Expense
							</CardTitle>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								className="h-4 w-4 text-muted-foreground"
							>
								<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$2,145.46</div>
							<p className="text-xs text-muted-foreground">
								+0% from last month
							</p>
						</CardContent>
					</Card>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle className="text-lg">Overview</CardTitle>
						</CardHeader>
						<CardContent className="pl-2"></CardContent>
					</Card>
					<Card className="col-span-4 md:col-span-3">
						<CardHeader>
							<CardTitle className="text-lg">Recent Transactions</CardTitle>
						</CardHeader>
						<CardContent>
							<RecentTransactions />
						</CardContent>
					</Card>
				</div>
			</div>
		</ScrollArea>
	);
};

export default page;
