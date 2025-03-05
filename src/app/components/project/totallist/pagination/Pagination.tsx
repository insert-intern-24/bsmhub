import React from 'react';
import { Projects } from '@/app/models/projectSearch';

export default function Pagination({
  projects,
  currentPage,
  setCurrentPage,
}: {
  projects: Projects;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const pageLength = Math.ceil(projects.length / 12);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageLength) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="flex items-center self-stretch justify-center">
        <div className="flex items-center gap-2 max-h-10">
          <div
            className="flex pt-0 pr-2 pb-0 pl-1 justify-center items-center rounded-md cursor-pointer"
            onClick={handlePreviousPage}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  "'FILL' 1, 'wght' 100, 'GRAD' 0, 'opsz' 14",
                fontSize: '1rem',
              }}
            >
              arrow_back_ios
            </span>
            <span className="text-textDisabled text-center text-base font-normal leading-[150%] tracking-normal">
              이전
            </span>
          </div>

          {Array(pageLength)
            .fill(0)
            .map((_, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`flex min-w-10 h-10 justify-center items-center rounded-md cursor-pointer ${
                    currentPage === index + 1
                      ? 'bg-black text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  <span
                    className={`text-center text-base font-bold leading-[150%] tracking-normal ${
                      currentPage === index + 1 ? 'text-white' : 'text-black'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
              );
            })}
          <div
            className="flex pt-0 pr-2 pb-0 pl-1 justify-center items-center rounded-md cursor-pointer"
            onClick={handleNextPage}
          >
            <span className="text-textDisabled text-center text-base font-normal leading-[150%] tracking-normal">
              다음
            </span>
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  "'FILL' 1, 'wght' 100, 'GRAD' 0, 'opsz' 14",
                fontSize: '1rem',
              }}
            >
              arrow_forward_ios
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
