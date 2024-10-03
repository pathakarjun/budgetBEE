"use client";

import { format } from "date-fns";
import { Transaction } from "@/types/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

type RecentTransactionsProps = {
	transactionsData: Transaction[];
};

const RecentTransactions = ({ transactionsData }: RecentTransactionsProps) => {
	const formatTransactionDate = (date: string | Date): string => {
		const dateObj = new Date(date);
		return format(dateObj, "dd MMM, yyyy");
	};

	return (
		<div className="w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Transaction</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Transaction Date</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactionsData.map((data, index) => (
						<TableRow key={index}>
							<TableCell className="ml-4 space-y-1 py-3">
								<p className="text-sm font-medium leading-none">
									{data.transaction_subtype}
								</p>
								<p className="text-xs text-muted-foreground">
									{data.transaction_type}
								</p>
							</TableCell>
							<TableCell>{data.description}</TableCell>
							<TableCell className="uppercase">
								{formatTransactionDate(data.transaction_date)}
							</TableCell>
							<TableCell className="text-right">
								$&nbsp;{data.amount.toFixed(2)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default RecentTransactions;
