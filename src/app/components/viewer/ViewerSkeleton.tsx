// 스켈레톤 아이템 상수 (매 렌더링마다 새 배열 생성 방지)
const FILTER_ITEMS_1 = [1, 2, 3];
const FILTER_ITEMS_2 = [1, 2];
const PORTFOLIO_ITEMS = [1, 2, 3, 4];

export default function ViewerSkeleton() {
  return (
    <div className="pt-12 flex mobile:flex-col flex-row gap-4 min-h-dvh w-full">
      {/* 필터 사이드바 스켈레톤 */}
      <aside className="flex-col gap-3 min-w-[25rem]">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="flex-col gap-3 p-2">
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="flex-col gap-1">
            {FILTER_ITEMS_1.map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-5 bg-gray-200 rounded w-16 mt-4 animate-pulse" />
          <div className="flex-col gap-1">
            {FILTER_ITEMS_2.map((i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 스켈레톤 */}
      <div className="flex-col gap-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mobile:gap-20 w-full">
          {PORTFOLIO_ITEMS.map((i) => (
            <div
              key={i}
              className="flex-col gap-[24px] w-full border border-[#F3F3F3] rounded p-8 bg-white"
            >
              {/* 프로필 이미지 및 정보 스켈레톤 */}
              <div className="flex-center gap-[20px] w-full">
                <div className="h-[213px] w-[166px] bg-gray-200 rounded animate-pulse shrink-0" />
                <div className="flex-col h-[213px] justify-between shrink-0 flex-1">
                  <div className="flex-col gap-[7px] w-full">
                    <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
                    <div className="h-16 bg-gray-200 rounded w-full animate-pulse" />
                  </div>
                  <div className="flex-col gap-[3px]">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* 상세 정보 섹션 스켈레톤 */}
              <div className="flex-col gap-10 w-full">
                <div className="flex-col gap-2">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                </div>
                <div className="flex-col gap-2">
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

