"use client";
import React, { useState } from "react";
import Tag from "@/app/components/community/search/Tag";
import Input from "@/app/components/community/search/Input";
import PopularNew from "@/app/components/community/search/SortToggleBox";

export default function Search() {
  return (
    <>
      <div className="flex w-full px-3 py-[0.875rem] flex-col items-start gap-[0.625rem] self-stretch rounded-2xl bg-white">
        <div className="flex w-full h-11 items-center gap-4">
          <Input />
          <PopularNew />
        </div>
        <div className="flex items-start gap-[0.625rem]">
          <Tag />
        </div>
      </div>
    </>
  );
}
