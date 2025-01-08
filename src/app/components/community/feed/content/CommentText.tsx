"use client";
import React, { useState } from "react";

export default function CommentText() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex self-stretch flex-col gap-4 ">
        <span
          className={`text-black font-pretendard text-base font-normal leading-[160%] flex-col ${
            isExpanded
              ? ""
              : "line-clamp-8 transition-all duration-500 ease-in-out"
          }`}
        >
          [온라인] CS스터디 추가 인원 모집합니다 <br />
          안녕하세요, 스터디 인원을 두세분 더 충원하고자 글을 올리게 되었습니다.
          <br /> <br /> <br /> [스터디 시간]
          <br /> 매주 수요일 오후 9시 ~ 오후 10시반
          <br />
          <br /> [추가 모집 인원]
          <br />- 2~3명
          <br />
          [스터디 진행 방식]
          <br /> - 모든 인원이 1주일동안 발표할 주제를 정하고 각자 발표 준비를
          해옵니다
          <br /> - 스터디 시간에 돌아가면서 준비해온 내용을 발표하고 궁금한 점을
          주고받습니다 (면접 방식보다는 서로의 생각이나 경험을 공유하고,
          토론하는 방식입니다.) <br />- 발표 주제로는 자료구조, 네트워크,
          데이터베이스, 방법론, 디자인 패턴, 아키텍처, 컴퓨터 구조, 학습하는 책
          등 어떠한 주제도 가능합니다.
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
