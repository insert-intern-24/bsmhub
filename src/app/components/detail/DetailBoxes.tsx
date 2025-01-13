import React from "react";
import DetailBox from "@components/detail/DetailBox";
import dummyData from "../../user/dummy.json";

const DetailBoxes = () => {
  return (
    <div className="w-full h-fit flex flex-wrap gap-[0.7rem]">
      {dummyData.map((item, index) => (
        <DetailBox
          key={index}
          name={item.name}
          symbol={item.symbol as "link" | "license" | "prize" | null}
          length={item.details.length}
          data={item.details}
        />
      ))}
    </div>
  );
};

export default DetailBoxes;
