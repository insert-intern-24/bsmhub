'use client';
import React from 'react';
import Image from 'next/image';
import search from '@public/images/icon/search.svg';
import { createClient } from '@/utils/supabase/client';

export default function Input() {
  const supabase = createClient();

  const formatSearchKeyword = (keyword: string) => {
    return keyword.trim().split(/\s+/).join(' & ');
  };

  return (
    <>
      <div className="flex px-3 py-2 items-center gap-[0.625rem] flex-1 rounded-[0.6875rem] bg-customGray">
        <Image src={search} alt="search" width={18} height={18} />
        <input
          type="text"
          placeholder="검색"
          className="flex-1 bg-customGray text-descriptionColor font-pretendard text-base font-normal leading-none outline-none"
          onChange={async (event) => {
            const searchKeyword = formatSearchKeyword(event.target.value);
            if (searchKeyword) {
              if (supabase) {
                try {
                  const { data, error } = await supabase
                    .schema('community')
                    .from('community_posts')
                    .select()
                    .textSearch('context', searchKeyword);

                  if (error) {
                    console.error('Error fetching search results:', error);
                    return;
                  }

                  console.log('Fetched search results:', data); // 디버깅용 로그 추가
                } catch (error) {
                  console.error('Error performing search:', error);
                }
              } else {
                console.error('Supabase is not initialized');
              }
            }
          }}
        />
      </div>
    </>
  );
}
