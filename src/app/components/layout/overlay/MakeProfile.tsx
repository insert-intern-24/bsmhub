'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import getProfileBySession from '@/services/profile/getProfileBySession';
import OverlayBg from './OverlayBg';

const MakeProfileOverlay = () => {
  const pathname = usePathname();
  const [isHide, setHide] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const result = await getProfileBySession();
        if (!result) {
          setHide(false);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    checkProfile();
  }, []);

  if (pathname === '/community/new-profile') return null; // 이미 새 프로필 만들기 페이지에 있는 경우 제외

  return (
    !isHide && (
      <OverlayBg
        backgroundColor="#00000085"
        onBackgroundClick={() => setHide(true)}
      >
        <main className="bg-white rounded-3xl p-6">
          <h2 className="text-2xl font-bold">프로필 생성하기</h2>
          <p>
            아직 프로필이 없어요. 프로필을 생성하고 모든 기능을 사용해보세요.
          </p>
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
      </OverlayBg>
    )
  );
};

export default MakeProfileOverlay;
