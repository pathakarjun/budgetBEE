"use client";

import RecentTransactions from "@/components/RecentTransactions";
import RecordTransactionForm from "@/components/forms/RecordTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HandCoins, Wallet } from "lucide-react";
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
		<div className="w-full flex h-svh max-h-svh">
			<div className="h-full flex-[0.25]"></div>

			<ScrollArea className="h-full flex-1 bg-gray-100 w-full">
				<div className="flex-1 space-y-4 p-4">
					<h2 className="text-2xl font-medium tracking-tight">Overview</h2>
					<div className="grid grid-cols-3 grid-rows-4 gap-4">
						<div className="col-span-2">
							<div className="flex flex-row">
								<div className="flex gap-8 flex-row pt-5">
									<Card className="bg-inherit border-none shadow-none">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-0">
											<CardTitle className="text-sm font-normal text-gray-700">
												Income
											</CardTitle>
											<Wallet color="rgb(52 211 153)" size={14} />
										</CardHeader>
										<CardContent className="pl-0">
											<div className="text-xl font-medium">$4,355.89</div>
										</CardContent>
									</Card>
									<div className="inline-block h-[75px] min-h-[1em] w-0.5 bg-gray-200 self-center"></div>
									<Card className="bg-inherit border-none shadow-none">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-normal text-gray-700">
												Expense
											</CardTitle>
											<HandCoins color="rgb(251 113 133)" size={14} />
										</CardHeader>
										<CardContent>
											<div className="text-xl font-medium">$2,145.46</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
						<div className="row-span-4 pt-5">
							<RecordTransactionForm userId={userId} />
						</div>
						<Card className="row-span-3 col-span-2">
							<CardHeader>
								<CardTitle className="text-lg">Overview</CardTitle>
							</CardHeader>
							<CardContent className="pl-2"></CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Recent Transactions</CardTitle>
						</CardHeader>
						<CardContent>
							<RecentTransactions />
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
};

export default page;
