import { getTransactions, getTransactionSubtype } from "@/app/_lib/queries";
import { columns } from "@/components/transaction-table/columns";
import { DataTable } from "@/components/transaction-table/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function page() {
	const data = await getTransactions();
	const categories = await getTransactionSubtype();
	return (
		<ScrollArea className="h-full flex-1 w-full">
			<div className="flex-1 space-y-8 p-10">
				<h2 className="text-2xl font-medium tracking-tight">
					Transaction Records
				</h2>
				<DataTable columns={columns} data={data} categories={categories} />
			</div>
		</ScrollArea>
	);
}
