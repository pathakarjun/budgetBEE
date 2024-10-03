import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, XIcon } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Categories, types } from "@/app/_lib/utilities";
import { getTransactionSubtype } from "@/app/_lib/queries";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	categories: Categories[];
}

export function DataTableToolbar<TData>({
	table,
	categories,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex flex-wrap items-center justify-between">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<Input
					placeholder="Filter description..."
					value={
						(table.getColumn("description")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) => {
						table.getColumn("description")?.setFilterValue(event.target.value);
					}}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn("transaction_type") && (
					<DataTableFacetedFilter
						column={table.getColumn("transaction_type")}
						title="Type"
						options={types}
					/>
				)}
				{table.getColumn("transaction_subtype") && (
					<DataTableFacetedFilter
						column={table.getColumn("transaction_subtype")}
						title="Categories"
						options={categories}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<XIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				{table.getFilteredSelectedRowModel().rows.length > 0 ? (
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Delete ({table.getFilteredSelectedRowModel().rows.length})
					</Button>
				) : null}
			</div>
		</div>
	);
}
