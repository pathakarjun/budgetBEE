"use client";

import * as React from "react";
import { type Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { transactions } from "@prisma/client";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteTransactions } from "@/app/_lib/queries";

interface DeleteTransactionDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	transactions: Row<transactions>["original"][];
	showTrigger?: boolean;
	onSuccess?: () => void;
}

export function DeleteTransactionDialog({
	transactions,
	showTrigger = true,
	onSuccess,
	...props
}: DeleteTransactionDialogProps) {
	const [isDeletePending, startDeleteTransition] = React.useTransition();
	function onDelete() {
		startDeleteTransition(async () => {
			const { error } = await deleteTransactions({
				ids: transactions.map((transaction) => transaction.id),
			});
			if (error) {
				toast.error(error.toString());
				return;
			}
			props.onOpenChange?.(false);
			toast.success("Transactions deleted");
			onSuccess?.();
		});
	}
	return (
		<Dialog {...props}>
			{showTrigger ? (
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Delete ({transactions.length})
					</Button>
				</DialogTrigger>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your{" "}
						<span className="font-medium">{transactions.length}</span>
						{transactions.length === 1 ? " transaction" : " transactions"}.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={onDelete}
						disabled={isDeletePending}
					>
						{isDeletePending && (
							<LoaderCircle
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
