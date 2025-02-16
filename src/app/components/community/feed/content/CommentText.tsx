'use client';
import React, { useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

export default function CommentText({
  mdxSource,
  text,
}: {
  mdxSource: MDXRemoteSerializeResult;
  text: string;
}) {
  const [isExpanded, setIsExpanded] = useState(text.length < 300);

  const handleToggle = () => setIsExpanded((prev) => !prev);
  return (
    <>
      <div className="flex self-stretch flex-col gap-4 ">]
        <span
          className={`text-black text-base font-normal leading-[160%] flex-col ${
            !isExpanded &&
            'line-clamp-8 transition-all duration-500 ease-in-out'
          }`}
        >
          <MDXRemote {...mdxSource} />
        </span>
        {!isExpanded && (
          <div className="flex justify-center">
            <span
              className="cursor-pointer text-center text-moreGray text-base font-normal leading-none"
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
