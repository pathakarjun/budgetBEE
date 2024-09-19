"use client";

import RecentTransactions from "@/components/RecentTransactions";
import RecordTransactionForm from "@/components/forms/RecordTransactionForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, HandCoins, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Transaction } from "@/types/types";
import { format } from "date-fns";
import DashboardExpenseChart from "@/components/DashboardExpenseChart";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/Monthpicker";
import { cn } from "@/lib/utils";

const page = () => {
	const [userId, setUserId] = useState<string | null>(null);
	const [totalIncome, setTotalIncome] = useState<number>(0);
	const [totalExpense, setTotalExpense] = useState<number>(0);
	const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
	const [monthlyData, setMonthlyData] = useState<Transaction[]>([]);
	const [date, setDate] = useState<Date>(new Date());
	const [dateopen, setDateopen] = useState<boolean>(false);

	const formatDate = (date: Date): string => {
		return date.toISOString().split("T")[0];
	};

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
			.format(amount)
			.replace("$", "$ ");
	};

	const getMonthlyTransaction = async () => {
		if (!userId) return;

		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		try {
			const params = new URLSearchParams({
				userId: userId,
				firstDate: formatDate(firstDay),
				lastDate: formatDate(lastDay),
			});
			const response = await fetch(`/api/transactions?${params.toString()}`, {
				method: "GET",
			});

			if (!response.ok) {
				toast.error("Network response was not ok");
			}

			const responseData: Transaction[] = await response.json();

			if (responseData) {
				let totalIncome = 0;
				let totalExpense = 0;

				responseData.forEach((item) => {
					if (item.transaction_type === "Income") {
						totalIncome += item.amount;
					} else if (item.transaction_type === "Expense") {
						totalExpense += item.amount;
					}
				});

				setTotalIncome(totalIncome);
				setTotalExpense(totalExpense);
				setMonthlyData(responseData);
			}
		} catch (error) {
			console.error("Error fetching transactions:", error);
		}
	};

	const fetchRecentTransactions = async () => {
		if (!userId) return;
		try {
			const params = new URLSearchParams({
				userId: userId,
				take: "5",
			});
			const response = await fetch(`/api/transactions?${params.toString()}`, {
				method: "GET",
			});

			if (!response.ok) {
				toast.error("Network response was not ok");
			}
			const responseData: Transaction[] = await response.json();

			if (responseData) {
				setTransactionsData(responseData);
			}
		} catch (error) {
			console.error("Error fetching recent transactions:", error);
		}
	};

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

	useEffect(() => {
		getMonthlyTransaction();
	}, [userId, date]);

	useEffect(() => {
		fetchRecentTransactions();
	}, [userId]);

	const handleFormSubmit = async () => {
		await getMonthlyTransaction();
		await fetchRecentTransactions();
	};

	return (
		<ScrollArea className="h-full flex-1 w-full">
			<div className="flex-1 space-y-4 p-10">
				<div className="flex flex-row justify-between">
					<h2 className="text-2xl font-medium tracking-tight">
						Monthly Overview
					</h2>
					<Popover open={dateopen} onOpenChange={setDateopen}>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-[140px] font-normal text-right",
									!date && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-4 h-4 w-4" />
								{date ? format(date, "MMM, yyyy") : <span>Pick a month</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<MonthPicker
								onMonthSelect={(selectedDate) => {
									setDate(selectedDate);
									setDateopen(false);
								}}
								selectedMonth={date}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="grid grid-cols-3 grid-rows-4 gap-4">
					<div className="col-span-2">
						<div className="flex flex-row">
							<div className="flex gap-8 flex-row pt-5">
								<Card className="bg-inherit border-none shadow-none">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 gap-10 pb-2 pl-0">
										<CardTitle className="text-sm font-normal text-gray-700">
											Income
										</CardTitle>
										<Wallet color="rgb(52 211 153)" size={14} />
									</CardHeader>
									<CardContent className="pl-0">
										<div className="text-xl font-medium">
											{formatCurrency(totalIncome)}
										</div>
									</CardContent>
								</Card>
								<div className="inline-block h-[75px] min-h-[1em] w-0.5 bg-gray-200 self-center"></div>
								<Card className="bg-inherit border-none shadow-none">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 gap-10 pb-2">
										<CardTitle className="text-sm font-normal text-gray-700">
											Expenses
										</CardTitle>
										<HandCoins color="rgb(251 113 133)" size={14} />
									</CardHeader>
									<CardContent>
										<div className="text-xl font-medium">
											{formatCurrency(totalExpense)}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
					<div className="row-span-4 pt-5">
						<RecordTransactionForm
							userId={userId || ""}
							onSuccess={handleFormSubmit}
						/>
					</div>
					<div className="row-span-3 col-span-2 flex flex-col">
						<DashboardExpenseChart transactionsData={monthlyData} date={date} />
					</div>
				</div>
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Recent Transactions</CardTitle>
					</CardHeader>
					<CardContent>
						<RecentTransactions transactionsData={transactionsData} />
					</CardContent>
				</Card>
			</div>
		</ScrollArea>
	);
};

export default page;
