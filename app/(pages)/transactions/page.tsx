import { getTransactions } from "@/app/_lib/queries";
import { columns } from "@/components/transaction-table/columns";
import { DataTable } from "@/components/transaction-table/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function page() {
	const data = await getTransactions();
	return (
		<ScrollArea className="h-full flex-1 w-full p-10">
			<DataTable columns={columns} data={data} />
		</ScrollArea>
	);
}
