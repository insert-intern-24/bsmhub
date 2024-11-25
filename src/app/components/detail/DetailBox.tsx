import React from 'react';
import Detail from '@components/detail/Detail';

interface DetailBoxProps {
	symbol: 'link' | 'license' | 'prize';
	length?: number;
	data: { value: string; certified: boolean; edit: boolean; address: string }[];
}

const symbolName = {
	license: '자격증',
	link: '링크',
	prize: '수상이력',
};

const DetailBox: React.FC<DetailBoxProps> = ({ symbol, length, data }) => {
	return (
		<div className="block w-[21.0625rem] overflow-auto min-h-[9rem] h-auto p-14px mb-[1.2rem] border border-strokeColor rounded-lg">
			<div className="flex gap-2">
				<p className="text-descriptionColor">{symbolName[symbol]}</p>
				<span className="text-descriptionColor text-14px">{length}</span>
			</div>
			{data.map((detail, index) => (
				<Detail key={index} symbol={symbol} value={detail.value} certified={detail.certified} edit={detail.edit} address={detail.address} />
			))}
		</div>
	);
};

export default DetailBox;
