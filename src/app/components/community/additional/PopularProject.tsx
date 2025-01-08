import React from 'react';
// import axios from "axios";
import Link from 'next/link';

// const options = {
//   method: "GET",
//   url: "/rank/project",
//   headers: { accept: "application/json", "content-type": "application/json" },
// };
// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

const response = [
  {
    name: 'IOJ',
    description: '실시간 알고리즘 경쟁 서비스 - IOJ',
    logo: 'url',
  },
  {
    name: '부마위키',
    description: '여러분이 가꾸어 나가는 역사의 고서',
    logo: 'url',
  },
  {
    name: '산뜻',
    description: '정보의 바다 속에 산뜻함을 더하다',
    logo: 'url',
  },
  {
    name: 'BSM+',
    description: '부소마를 위한 새로워진 BSM',
    logo: 'url',
  },
];

export default function PopularProject() {
  return (
    <>
      <div className="w-[18.75rem] h-[18.75rem] bg-white rounded-2xl flex flex-col align-middle items-center p-[1rem] ">
        <div className="flex justify-between w-full ">
          <span className="font-bold text-4 text-titleColor">
            🔥 인기 프로젝트
          </span>
          <Link
            rel="stylesheet"
            href="http://localhost:3000/community"
            className="text-[0.875rem] text-detailColor"
          >
            더보기
          </Link>
        </div>
        <div className="w-full ">
          {response.map((project, index) => (
            <div
              key={index}
              className="flex gap-[0.375rem] w-full items-center py-[0.75rem]"
            >
              <span className="text-[0.75rem] text-detailColor">
                {index + 1}
              </span>
              <div className="w-[2.25rem] h-[2.25rem] bg-strokeColor rounded-xl"></div>
              <div className="flex flex-col">
                <span className="text-[0.875rem] font-bold text-titleColor">
                  {project.name}
                </span>
                <span className="text-[0.75rem] text-descriptionColor">
                  {project.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
