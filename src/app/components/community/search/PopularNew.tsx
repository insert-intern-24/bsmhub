import React, { useState } from "react";

export default function PopularNew() {
  const [selectedTab, setSelectedTab] = useState("인기");
  return (
    <>
      <div className="flex h-11 p-1 items-center gap-1 rounded-lg border border-solid border-customGray bg-customGray">
        <div
          className={`flex px-2 py-4 justify-center items-center gap-[0.625rem] self-stretch rounded-lg font-pretendard text-base font-normal leading-none cursor-pointer ${
            selectedTab === "인기" ? "bg-white text-black" : "text-black"
          }`}
          onClick={() => setSelectedTab("인기")}
        >
          인기
        </div>
        <div
          className={`flex px-2 py-4 justify-center items-center gap-[0.625rem] self-stretch rounded-lg font-pretendard text-base font-normal leading-none cursor-pointer ${
            selectedTab === "최신" ? "bg-white text-black" : "text-black"
          }`}
          onClick={() => setSelectedTab("최신")}
        >
          최신
        </div>
      </div>
    </>
  );
}
