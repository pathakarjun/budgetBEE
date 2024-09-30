import { Transaction } from "@/types/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { format } from "date-fns";

type DashboardExpenseChartProps = {
	transactionsData: Transaction[];
	date: Date;
};

interface ChartDatum {
	category: string;
	amount: number;
	fill: string;
}

interface ChartConfig {
	amount: { label: string };
	[key: string]: { label: string; color: string } | { label: string };
}

const DashboardExpenseChart = ({
	transactionsData,
	date,
}: DashboardExpenseChartProps) => {
	function generateUniqueColor(index: number): string {
		const hue = (index * 137.508) % 360;
		return `hsl(${hue}, 60%, 70%)`; // Return a pastel-like color
	}

	function generateExpenseChartData(transactionsData: Transaction[]): {
		expenseChartData: ChartDatum[];
		expenseChartConfig: ChartConfig;
	} {
		const groupedExpenses = transactionsData.reduce(
			(acc: { [key: string]: number }, transaction: Transaction) => {
				if (transaction.transaction_type === "Expense") {
					if (!acc[transaction.transaction_subtype]) {
						acc[transaction.transaction_subtype] = 0;
					}
					acc[transaction.transaction_subtype] += transaction.amount;
				}
				return acc;
			},
			{}
		);

		const expenseChartConfig: ChartConfig = {
			amount: { label: "Amount" },
		};

		const expenseChartData: ChartDatum[] = Object.entries(groupedExpenses).map(
			([subtype, total], index) => {
				const color = generateUniqueColor(index);

				expenseChartConfig[subtype] = {
					label: subtype,
					color: color,
				};

				const expenseChartDatum: ChartDatum = {
					category: subtype,
					amount: total,
					fill: color,
				};

				return expenseChartDatum;
			}
		);

		return { expenseChartData, expenseChartConfig };
	}

	function generateIncomeChartData(transactionsData: Transaction[]): {
		incomeChartData: ChartDatum[];
		incomeChartConfig: ChartConfig;
	} {
		const groupedIncomes = transactionsData.reduce(
			(acc: { [key: string]: number }, transaction: Transaction) => {
				if (transaction.transaction_type === "Income") {
					if (!acc[transaction.transaction_subtype]) {
						acc[transaction.transaction_subtype] = 0;
					}
					acc[transaction.transaction_subtype] += transaction.amount;
				}
				return acc;
			},
			{}
		);

		const incomeChartConfig: ChartConfig = {
			amount: { label: "Amount" },
		};

		const incomeChartData: ChartDatum[] = Object.entries(groupedIncomes).map(
			([subtype, total], index) => {
				const color = generateUniqueColor(index + 15);

				incomeChartConfig[subtype] = {
					label: subtype,
					color: color,
				};

				const incomeChartDatum: ChartDatum = {
					category: subtype,
					amount: total,
					fill: color,
				};

				return incomeChartDatum;
			}
		);

		return { incomeChartData, incomeChartConfig };
	}

	const { expenseChartData, expenseChartConfig } =
		generateExpenseChartData(transactionsData);

	const { incomeChartData, incomeChartConfig } =
		generateIncomeChartData(transactionsData);

	return (
		<div className="flex flex-row gap-4 h-full w-full">
			<Card className="flex flex-col w-1/2">
				<CardHeader className="pb-0">
					<CardTitle className="text-xl">Income</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={incomeChartConfig} className="w-full h-full">
						{incomeChartData.length > 0 ? (
							<PieChart className="w-full h-full">
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={incomeChartData}
									dataKey="amount"
									nameKey="category"
									innerRadius={60}
								/>
							</PieChart>
						) : (
							<div className="flex items-center w-full h-full justify-center">
								<div className="text-sm leading-none text-muted-foreground text-center">
									No income added for {format(date, "MMM, yyyy")}
								</div>
							</div>
						)}
					</ChartContainer>
				</CardContent>
				{incomeChartData.length > 0 && (
					<CardFooter className="text-sm leading-none text-muted-foreground justify-center text-center">
						Showing income for {format(date, "MMM, yyyy")}
					</CardFooter>
				)}
			</Card>
			<Card className="flex flex-col w-1/2">
				<CardHeader className="pb-0">
					<CardTitle className="text-xl">Expenses</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={expenseChartConfig} className="w-full h-full">
						{expenseChartData.length > 0 ? (
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={expenseChartData}
									dataKey="amount"
									nameKey="category"
									innerRadius={60}
								/>
							</PieChart>
						) : (
							<div className="flex items-center w-full h-full justify-center">
								<div className="text-sm leading-none text-muted-foreground text-center">
									No expenses added for {format(date, "MMM, yyyy")}
								</div>
							</div>
						)}
					</ChartContainer>
				</CardContent>
				{expenseChartData.length > 0 && (
					<CardFooter className="text-sm leading-none text-muted-foreground justify-center text-center">
						Showing expenses for {format(date, "MMM, yyyy")}
					</CardFooter>
				)}
			</Card>
		</div>
	);
};

export default DashboardExpenseChart;
