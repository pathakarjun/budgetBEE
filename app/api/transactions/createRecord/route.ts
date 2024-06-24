import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";

//Define a schema for input validation
const transactionSchema = z.object({
	transactionType: z.string().min(1, "Transaction type is required").max(50),
	transactionSubtype: z
		.string()
		.min(1, "Transaction classification is required")
		.max(50),
	userId: z.string(),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { transactionType, transactionSubtype, userId } =
			transactionSchema.parse(body);

		//check if transaction classification already exists for a user
		const existingTransactionByUser =
			await db.transaction_classifications.findUnique({
				where: {
					tnClassification_identifier: {
						user_id: userId,
						transaction_type: transactionType,
						transaction_subtype: transactionSubtype,
					},
				},
			});

		if (existingTransactionByUser) {
			return NextResponse.json(
				{
					transactionClassification: null,
					message: "Transaction classification for this User already exists",
				},
				{ status: 409 }
			);
		}

		const newTransactionClassification =
			await db.transaction_classifications.create({
				data: {
					transaction_type: transactionType,
					transaction_subtype: transactionSubtype,
					user_id: userId,
				},
			});

		return NextResponse.json(
			{
				transactionClassification: newTransactionClassification,
				message: "Transaction Classification Registered Successfully",
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong!" },
			{ status: 500 }
		);
	}
}
