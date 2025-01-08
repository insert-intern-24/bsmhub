import React from "react";
import Image from "next/image";
import favorite from "@public/images/icon/favorite.svg";
import message from "@public/images/icon/message.svg";
import dots from "@public/images/icon/dots.svg";

export default function CommentReaction() {
  return (
    <>
      <div className="flex justify-between items-center self-stretch">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Image
              src={favorite}
              alt="favorite"
              width={(24 / 16) * 12}
              height={(24 / 16) * 12}
            />
            <span className="text-descriptionColor font-pretendard text-base font-normal leading-none">
              1.2k
            </span>
          </div>
          <Image
            src={message}
            alt="message"
            width={(24 / 16) * 12}
            height={(24 / 16) * 12}
          />
        </div>
        <Image
          src={dots}
          alt="dots"
          width={(24 / 16) * 12}
          height={(24 / 16) * 12}
        />
      </div>
    </>
  );
}
