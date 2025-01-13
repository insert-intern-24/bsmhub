import React from 'react';
import DetailBox from '@components/detail/DetailBox';

interface ContentItem {
  name: string
	symbol: 'link' | 'license' | 'prize' | null;
	details: { value: string; certified?: boolean; edit?: boolean; address?: string }[];
}

interface Contents {
  contents: ContentItem[];
}

const DetailBoxes = ({contents}:Contents) => {
  return (
    <>
      {contents.map((item, index) => (
        <DetailBox
          key={index}
          name={item.name}
          symbol={item.symbol}
          length={item.details.length}
          details={item.details}
        />
      ))}
    </>
  );
};

export default DetailBoxes;
