import React from 'react';
import Detail from '@components/detail/Detail';

interface DetailBoxProps {
	name: string;
	symbol: 'link' | 'license' | 'prize' | null;
	length?: number;
	data: { value: string; certified?: boolean; edit: boolean; address?: string }[];
}

function DetailBox({ name ,symbol, length, data }: DetailBoxProps) {
	return (
		<div className="block w-[21.0625rem] overflow-auto min-h-[9rem] h-auto p-14px mb-[1.2rem] border border-strokeColor rounded-lg">
			<div className="flex gap-2">
				<p className="text-descriptionColor">{name}</p>
				<span className="text-descriptionColor text-14px">{length}</span>
			</div>
			{data.map((detail, index) => (
				<Detail 
					key={index} 
					symbol={symbol} 
					value={detail.value} 
					certified={detail.certified? detail.certified : false}
          edit={detail.edit}
          address={detail.address ? detail.address : ""}
				/>
			))}
		</div>
	);
}

export default DetailBox;
