import React from "react";
import Image from "next/image";
import TeamProfile from "@public/images/icon/TeamProfile.svg";

export default function CommentHeader() {
  return (
    <>
      <div className="flex items-center gap-2 self-stretch">
        <Image
          src={TeamProfile}
          alt="TeamProfile"
          width={(44 / 16) * 12}
          height={(44 / 16) * 12}
        />
        <div className="flex items-center gap-1">
          <span className="text-black font-pretendard text-base font-bold leading-none">
            이준호
          </span>
          <span className="text-descriptionColor font-pretendard text-xs font-normal leading-none">
            2분전
          </span>
        </div>
        <span className="text-followBlue font-pretendard text-sm font-normal leading-none">
          Follow
        </span>
      </div>
    </>
  );
}
