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
      <div className="flex self-stretch flex-col gap-4 ">
        <article
          className={`prose text-black leading-[160%] max-w-full w-full ${
            !isExpanded && 'line-clamp-4'
          }`}
        >
          <MDXRemote {...mdxSource} />
        </article>
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
