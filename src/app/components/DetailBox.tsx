import React from 'react';
import Detail from '@components/shared/Detail';

const DetailBox = () => {
  const details = [
    { symbol: "link", value: "obtuse.kr", address: "/" },
    { symbol: "link", value: "triangledrop.obtuse.kr", address: "/" },
    { symbol: "link", value: "triangledrop.obtuse.kr", address: "/" },
    { symbol: "link", value: "triangledrop.obtuse.kr", address: "/" },
  ];

  return (
    <div className="block w-[25rem] overflow-auto min-h-[10rem] h-auto p-[0.875rem] mb-[1.2rem] border border-strokeColor rounded-lg">
      <p className="text-descriptionColor">링크</p>
      {details.map((detail, index) => (
        <Detail
          key={index} // 고유 key 필요
          symbol={detail.symbol}
          value={detail.value}
          address={detail.address}
        />
      ))}
    </div>
  );
};

export default DetailBox;
