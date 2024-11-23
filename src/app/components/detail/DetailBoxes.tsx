import React from 'react';
import DetailBox from '@components/detail/DetailBox';
import dummyData from '../../user/dummy.json';

const DetailBoxes = () => {
	return (
		<div className="w-full h-32 flex gap-6">
			{dummyData.map((item, index) => (
				<DetailBox key={index} symbol={item.symbol} length={item.details.length} data={item.details} />
			))}
		</div>
	);
};

export default DetailBoxes;
