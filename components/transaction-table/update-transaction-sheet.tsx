"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import { transactions } from "@prisma/client";
import { FromSchema, fromSchema } from "@/app/_lib/validation";
import { updateTransaction } from "@/app/_lib/queries";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Categories, types } from "@/app/_lib/utilities";
import { ScrollArea } from "../ui/scroll-area";

interface UpdateTransactionSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {
	transaction: transactions;
	categories: Categories[];
	onSuccess?: () => void;
}

export function UpdateTransactionSheet({
	transaction,
	categories,
	onSuccess,
	...props
}: UpdateTransactionSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition();
	const [updateDateopen, setUpdateDateopen] = React.useState(false);

	const form = useForm<FromSchema>({
		resolver: zodResolver(fromSchema),
		defaultValues: {
			description: transaction.description ?? "",
			type: transaction.transaction_type,
			classification: transaction.transaction_subtype,
			transactionDate: transaction.transaction_date,
			amount: transaction.amount,
		},
	});

	React.useEffect(() => {
		form.reset({
			description: transaction.description ?? "",
			type: transaction.transaction_type,
			classification: transaction.transaction_subtype,
			transactionDate: transaction.transaction_date,
			amount: transaction.amount,
		});
	}, [transaction, form]);

	function onSubmit(input: FromSchema) {
		startUpdateTransition(async () => {
			const { error } = await updateTransaction({
				id: transaction.id,
				...input,
			});

			if (error) {
				toast.error(error.toString());
				return;
			}

			form.reset();
			props.onOpenChange?.(false);
			toast.success("Transaction updated");
			onSuccess?.();
		});
	}

	return (
		<Sheet {...props}>
			<SheetContent className="flex flex-col gap-6">
				<SheetHeader className="text-left">
					<SheetTitle>Update transaction</SheetTitle>
				</SheetHeader>
				<ScrollArea className="pr-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder="Description" type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="capitalize">
													<SelectValue placeholder="Select a type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{types.map((type) => (
														<SelectItem
															key={type.value}
															value={type.label}
															className="capitalize"
														>
															{type.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="classification"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Classification</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="capitalize">
													<SelectValue placeholder="Select a classification" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													{categories.map((category) => (
														<SelectItem
															key={category.value}
															value={category.label}
															className="capitalize"
														>
															{category.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="transactionDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Transaction Date</FormLabel>
										<Popover
											open={updateDateopen}
											onOpenChange={setUpdateDateopen}
										>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(e: any) => {
														field.onChange(e);
														setUpdateDateopen(false);
													}}
													disabled={(date: any) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Amount</FormLabel>
											<FormControl>
												<Input
													placeholder="Amount"
													type="number"
													{...field}
													value={field.value ?? ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<SheetFooter className="gap-2 pt-2 sm:space-x-0">
								<SheetClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</SheetClose>
								<Button disabled={isUpdatePending}>
									{isUpdatePending && (
										<LoaderCircle
											className="mr-2 size-4 animate-spin"
											aria-hidden="true"
										/>
									)}
									Save
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
