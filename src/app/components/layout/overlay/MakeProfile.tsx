'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useMemo, useState } from 'react';

const MakeProfileOverlay = () => {
  const pathname = usePathname();
  const [isHide, setHide] = useState(true);
  useMemo(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .schema('community')
        .from('profile_permission')
        .select('*, profile_id!inner(*)')
        .eq('student_id', session?.user?.id)
        .eq('profile_id.isTeam', false);
      return profile;
    })().then((result) => {
      if (result?.length == 0) {
        setHide(false);
      }
    });
  }, []);
  if (pathname === '/community/new-profile') return null; // 이미 새 프로필 만들기 페이지에 있는 경우 제외

  return !isHide ? (
    <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center bg-[#00000085] text-titleColor">
      <main className="bg-white rounded-3xl p-6">
        <h2 className="text-2xl font-bold">프로필 생성하기</h2>
        <p>아직 프로필이 없어요. 프로필을 생성하고 모든 기능을 사용해보세요.</p>
        <Link
          className="bg-black text-white flex flex-col justify-center items-center rounded-xl p-6 mt-4 aspect-[5/3] text-xl gap-2"
          href={`/community/new-profile`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48",
              fontSize: '2rem',
            }}
          >
            account_circle
          </span>
          프로필 생성
        </Link>
      </main>
    </div>
  ) : null;
};

export default MakeProfileOverlay;
