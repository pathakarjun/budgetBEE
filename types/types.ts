// types.ts
export type Transaction = {
  description: string;
  transaction_type: "Income" | "Expense";
  transaction_subtype: string;
  transaction_date: Date;
  amount: number;
};
