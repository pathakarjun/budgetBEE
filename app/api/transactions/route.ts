import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";

//Define a schema for input validation
const transactionsSchema = z.object({
	description: z.string().min(1, "Description is required").max(200),
	type: z.string().min(1, "Transaction type is required").max(50),
	classification: z
		.string()
		.min(1, "Transaction classification is required")
		.max(50),
	transactionDate: z.date(),
	amount: z.coerce.number().positive(),
	userId: z.string(),
	classificationId: z.string(),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {
			description,
			type,
			classification,
			transactionDate,
			amount,
			userId,
		} = transactionsSchema.parse(body);

		const newtransaction = await db.transactions.create({
			data: {
				description: description,
				transaction_type: type,
				transaction_subtype: classification,
				transaction_date: transactionDate,
				amount: amount,
				user_id: userId,
				transaction_classification: {
					connect: {
						tnClassification_identifier: {
							transaction_type: type,
							transaction_subtype: classification,
							user_id: userId,
						},
					},
				},
			},
		});

		return NextResponse.json(
			{ user: newtransaction, message: "Transaction registered successfully" },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong!" },
			{ status: 500 }
		);
	}
}
