"use client";

import { transactions } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<transactions>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-0.5"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-0.5"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[250px] truncate font-medium capitalize">
						{row.getValue("description")}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "transaction_type",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Type" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex w-[100px] items-center">
					<span className="capitalize">{row.getValue("transaction_type")}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "transaction_subtype",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Classification" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex w-[100px] items-center">
					<span className="capitalize">
						{row.getValue("transaction_subtype")}
					</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "transaction_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Transaction Date" />
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("transaction_date"));
			const formattedDate = date.toLocaleDateString("en-US", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			});

			return (
				<div className="uppercase flex w-[100px] items-center">
					{formattedDate}
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const rowDate = new Date(row.getValue(id));
			const [startDate, endDate] = value;
			return rowDate >= startDate && rowDate <= endDate;
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			})
				.format(amount)
				.replace("$", "$ ");

			return (
				<div className="flex w-[100px] items-center">
					<span className="capitalize">{formatted}</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
