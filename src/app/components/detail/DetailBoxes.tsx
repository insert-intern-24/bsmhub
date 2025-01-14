import React from 'react';
import DetailBox from '@components/detail/DetailBox';
import { Details, DetailBoxType } from '@models/collection';

interface DetailBoxesType extends Details {
  type : DetailBoxType
}

const DetailBoxes = ({details, type = "general"} : DetailBoxesType) => {
  return (
    <>
      {details.map((detail, index) => (
        <DetailBox
          key={index}
          label={detail.label}
          symbol={detail.symbol}
          length={detail.contents.length}
          contents={detail.contents}
          type={type}
          />
      ))}
    </>
  );
};

export default DetailBoxes;
