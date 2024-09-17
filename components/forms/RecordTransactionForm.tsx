"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogDescription,
	DialogTitle,
	DialogContent,
	DialogHeader,
} from "../ui/dialog";
import AddClassificationForm from "./AddClassificationForm";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type propsType = {
	userId: string;
	onSuccess?: () => void;
};

const types = [
	{ label: "Income", value: "Income" },
	{ label: "Expense", value: "Expense" },
] as const;

const fromSchema = z.object({
	description: z.string().min(1).max(200),
	type: z.string({
		required_error: "Please select a type",
	}),
	classification: z
		.union([z.string(), z.undefined()])
		.refine((val) => val !== undefined && val !== "", {
			message: "Please select a classification",
		}),
	transactionDate: z.date({
		required_error: "A transaction date is required",
	}),
	amount: z.coerce.number().positive(),
});

const RecordTransactionForm = (props: propsType) => {
	const [typeopen, setTypeopen] = useState(false);
	const [type, setType] = useState("");
	const [classificationopen, setCassificationopen] = useState(false);
	const [dialogopen, setDialogopen] = useState(false);
	const [classifications, setCassifications] = useState<any[]>([]);
	const [dateopen, setDateopen] = useState(false);

	useEffect(() => {
		const getClassifications = async () => {
			const params = new URLSearchParams({
				userId: props.userId,
				transactionType: type,
			});
			const response = await fetch(
				`/api/transactionClassifications?${params.toString()}`,
				{
					method: "GET",
				}
			);
			const classificationData = await response.json();
			if (classificationData) {
				const transformedData = classificationData.map((item: any) => ({
					label: item.transaction_subtype,
					value: item.transaction_subtype,
				}));
				setCassifications(transformedData);
			}
		};
		getClassifications();
	}, [type, dialogopen]);

	const form = useForm<z.infer<typeof fromSchema>>({
		resolver: zodResolver(fromSchema),
		defaultValues: {
			description: "",
		},
	});

	const { trigger } = form;

	const submitData = async (values: z.infer<typeof fromSchema>) => {
		const session = await fetch("/api/session");
		const sessionData = await session.json();

		const response = await fetch("/api/transactions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: sessionData?.user.id,
				description: values.description,
				type: values.type,
				classification: values.classification,
				transactionDate: new Date(values.transactionDate),
				amount: values.amount,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			form.reset();
			if (props.onSuccess) props.onSuccess();
		} else {
			toast.error(data.message);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Add Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				<Dialog open={dialogopen} onOpenChange={setDialogopen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Classification</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						<AddClassificationForm
							typeValue={form.getValues("type")}
							setDialogopen={setDialogopen}
							types={types}
							userId={props.userId}
						/>
					</DialogContent>
				</Dialog>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submitData)} className="space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder="Description" type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Type</FormLabel>
									<Popover open={typeopen} onOpenChange={setTypeopen}>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value
														? types.find((type) => type.value === field.value)
																?.label
														: "Select Type"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search Type..." />
												<CommandList>
													<CommandEmpty>No type found.</CommandEmpty>
													<CommandGroup>
														{types.map((type) => (
															<CommandItem
																value={type.label}
																key={type.value}
																onSelect={() => {
																	form.setValue("type", type.value);
																	setTypeopen(false);
																	setType(type.label);
																	form.setValue("classification", undefined);
																	trigger("type");
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		type.value === field.value
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
																{type.label}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="classification"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Classification</FormLabel>
									<Popover
										open={classificationopen}
										onOpenChange={setCassificationopen}
									>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														!field.value && "text-muted-foreground"
													)}
													disabled={form.getValues("type") ? false : true}
												>
													{field.value
														? classifications.find(
																(classification) =>
																	classification.value === field.value
														  )?.label
														: "Select Classification"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search Classification..." />
												<CommandList>
													<CommandEmpty>No Classification found.</CommandEmpty>
													<CommandGroup>
														{classifications.map((classification) => (
															<CommandItem
																value={classification.label}
																key={classification.value}
																onSelect={() => {
																	form.setValue(
																		"classification",
																		classification.value
																	);
																	setCassificationopen(false);
																	trigger("classification");
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		classification.value === field.value
																			? "opacity-100"
																			: "opacity-0"
																	)}
																/>
																{classification.label}
															</CommandItem>
														))}
														<CommandItem
															onSelect={() => {
																setDialogopen(true);
															}}
														>
															<p className="mr-2 h-4 w-4">+</p>
															<span>Add new</span>
														</CommandItem>
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
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
									<Popover open={dateopen} onOpenChange={setDateopen}>
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
													setDateopen(false);
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

						<Button type="submit" className="w-32">
							Add
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default RecordTransactionForm;
