import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const findTransactionClassification =
			await db.transaction_classifications.findMany({
				where: {
					user_id: userId,
				},
				select: {
					transaction_subtype: true,
					transaction_type: true,
				},
			});

		return NextResponse.json(findTransactionClassification);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong!" },
			{ status: 500 }
		);
	}
}
