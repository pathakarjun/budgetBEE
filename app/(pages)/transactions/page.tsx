"use client";

import {
	deleteTransactions,
	getTransactions,
	getTransactionSubtype,
} from "@/app/_lib/queries";
import { Categories } from "@/app/_lib/utilities";
import { columns } from "@/components/transaction-table/columns";
import { DataTable } from "@/components/transaction-table/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transactions } from "@prisma/client";
import { useEffect, useState } from "react";

export default function page() {
	const [data, setData] = useState<transactions[]>([]);
	const [categories, setCategories] = useState<Categories[]>([]);

	const fetchData = async () => {
		const responseData = await getTransactions();
		if (responseData) {
			setData(responseData);
		}
	};

	const fetchCategories = async () => {
		const responseCategories = await getTransactionSubtype();
		if (responseCategories) {
			setCategories(responseCategories);
		}
	};

	const handleSuccess = async () => {
		await fetchData();
	};

	useEffect(() => {
		fetchData();
		fetchCategories();
	}, []);

	return (
		<ScrollArea className="h-full flex-1 w-full">
			<div className="flex-1 space-y-8 p-10">
				<h2 className="text-2xl font-medium tracking-tight">
					Transaction Records
				</h2>
				<DataTable
					columns={columns(handleSuccess, categories)}
					data={data}
					categories={categories}
					onDeleteSuccess={handleSuccess}
				/>
			</div>
		</ScrollArea>
	);
}
