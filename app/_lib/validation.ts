import { z } from "zod";

export const fromSchema = z.object({
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

export type FromSchema = z.infer<typeof fromSchema>;
