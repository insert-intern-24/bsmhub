import React, { useState } from "react";
import SortToggleButton from "./SortToggleButton";

export default function SortToggleBox() {
  const [selectedTab, setSelectedTab] = useState("인기");
  return (
    <>
      <div className="flex h-11 p-1 items-center gap-1 rounded-lg border border-solid border-customGray bg-customGray">
        <SortToggleButton label="인기" selectedTab={selectedTab} onClick={() => setSelectedTab("인기")}/>
        <SortToggleButton label="최신" selectedTab={selectedTab} onClick={() => setSelectedTab("최신")}/>

      </div>
    </>
  );
}
