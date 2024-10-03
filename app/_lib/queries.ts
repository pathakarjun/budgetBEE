"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions } from "@prisma/client";
import { getServerSession } from "next-auth";
import { Categories } from "./utilities";

export async function getTransactions(): Promise<transactions[]> {
	const session = await getServerSession(authOptions);
	const transactionsData = await db.transactions.findMany({
		where: {
			user_id: session?.user.id ?? "",
		},
	});

	return transactionsData;
}

export async function getTransactionSubtype(): Promise<Categories[]> {
	const session = await getServerSession(authOptions);
	const findTransactionClassification =
		await db.transaction_classifications.findMany({
			where: {
				user_id: session?.user.id ?? "",
			},
		});
	if (findTransactionClassification) {
		const transformedData = findTransactionClassification.map((item: any) => ({
			label: item.transaction_subtype,
			value: item.transaction_subtype,
		}));
		return transformedData;
	}
	return [
		{
			label: "",
			value: "",
		},
	];
}
