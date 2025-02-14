import React from 'react';
import Detail from '@components/detail/Detail';
import type { Detail as DetailType, DetailBoxType } from '@models/collection.d.ts';

interface DetailBoxProps extends DetailType {
	type : DetailBoxType;
	length?: number;
}

function DetailBox({ label, symbol, length = 0, contents, type = "general" }: DetailBoxProps) {
	return (
		<div className={`block max-w-[21.0625rem] w-full overflow-auto h-auto mb-[1.2rem] ${type === "general" && "min-h-[9rem] p-14px border border-strokeColor rounded-lg" }`}>
			<div className="flex gap-2">
				<p className="text-descriptionColor">{label}</p>
				<span className="text-descriptionColor text-14px">{length > 1 ? length : ''}</span>
			</div>
			{contents.map((content, index) => (
				<Detail 
					key={index} 
					symbol={symbol} 
					value={content.value} 
					certified={content.certified}
					edit={false}
					address={content.address}
				/>
			))}
		</div>
	);
}

export default DetailBox;
