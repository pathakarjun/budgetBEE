"use client";

import { useEffect, useState } from "react";

const RecentTransactions = () => {
	const [transactionsData, setTransactionsData] = useState<any[]>([]);

	useEffect(() => {
		const getTransactions = async () => {
			const session = await fetch("/api/session");
			const sessionData = await session.json();
			const params = new URLSearchParams({
				userId: sessionData?.user.id,
			});
			const response = await fetch(`/api/transactions?${params.toString()}`, {
				method: "GET",
			});
			const responseData = await response.json();

			if (responseData) {
				const transformedData = responseData.map((item: any) => ({
					type: item.transaction_type,
					subType: item.transaction_subtype,
					amount: item.amount,
				}));
				setTransactionsData(transformedData);
			}
		};
		getTransactions();
	}, []);

	return (
		<div className="space-y-8">
			{transactionsData.map((data, index) => (
				<div key={index} className="flex items-center">
					<div className="ml-4 space-y-1">
						<p className="text-sm font-medium leading-none">{data.subType}</p>
						<p className="text-xs text-muted-foreground">{data.type}</p>
					</div>
					<div className="ml-auto font-medium">${data.amount}</div>
				</div>
			))}
		</div>
	);
};

export default RecentTransactions;
