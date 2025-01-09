'use client';
import React, { useState } from 'react';

interface CommentTextProps {
  text: string;
}

export default function CommentText({ text }: CommentTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <div className="flex self-stretch flex-col gap-4 ">
        <span
          className={`text-black font-pretendard text-base font-normal leading-[160%] flex-col ${
            !isExpanded &&
            'line-clamp-8 transition-all duration-500 ease-in-out'
          }`}
        >
          {text}
        </span>
        {!isExpanded && (
          <div className="flex justify-center">
            <span
              className="cursor-pointer text-center text-moreGray font-pretendard text-base font-normal leading-none"
              onClick={handleToggle}
            >
              더보기
            </span>
          </div>
        )}
      </div>
    </>
  );
}
