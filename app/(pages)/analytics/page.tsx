import React from "react";
import Image from "next/image";
import UnderConstruction from "@/public/UnderConstruction.svg";

const page = () => {
	return (
		<div className="flex flex-col">
			<div className="flex justify-center p-20">
				<Image
					priority
					src={UnderConstruction}
					alt="Page Under Construction"
					height={250}
					width={250}
				/>
			</div>
			<span className="text-center text-2xl font-semibold text-slate-400">
				Page under Construction
			</span>
		</div>
	);
};

export default page;
