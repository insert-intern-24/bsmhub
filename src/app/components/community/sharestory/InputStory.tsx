'use client';
import React from 'react';
import Image from 'next/image';
import write from '@public/images/icon/write.svg';
import { createClient } from '@/utils/supabase/client';

export default function InputStory() {
  const supabase = createClient();

  const fetchSessionAndPermissions = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data: profile_permission, error } = await supabase
      .from('profile_permission')
      .select('*, profile_id!inner(*)')
      .eq('student_id', session?.user?.id as string)
      .eq('profile_id.isTeam', false);

    if (error) {
      console.error('Error fetching profile_permission:', error);
      return null;
    }

    console.log('Fetched profile_permission:', profile_permission); // 디버깅용 로그 추가

    return profile_permission;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const story = formData.get('story') as string;
    console.log(story);

    const profile_permission = await fetchSessionAndPermissions();

    if (profile_permission && profile_permission.length > 0) {
      const profile_id = profile_permission[0].profile_id?.profile_id;
      if (profile_id) {
        await supabase
          .schema('community')
          .from('community_posts')
          .insert([{ context: story, profile_id: profile_id }]);
      } else {
        console.error('profile_id is null', profile_permission);
      }
    } else {
      console.error('No profile_id found in profile_permission');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex px-[0.625rem] py-[0.875rem] items-center gap-2 flex-1 rounded-lg bg-customGray w-full">
        <Image src={write} alt="write" width={18} height={18} />
        <input
          type="text"
          name="story"
          placeholder="공유할 이야기가 있으신가요?"
          className="flex-1 bg-customGray text-descriptionColor font-pretendard text-base font-normal leading-none outline-none"
        />
      </div>
    </form>
  );
}
