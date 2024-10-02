"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { transactions } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getTransactions(): Promise<transactions[]> {
	const session = await getServerSession(authOptions);
	const transactionsData = await db.transactions.findMany({
		where: {
			user_id: session?.user.id ?? "",
		},
	});

	return transactionsData;
}
