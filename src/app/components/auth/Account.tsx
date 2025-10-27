'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { Dropdown, DropdownItem } from '@/app/components/dropdown/DropDown';
import { profileConfig } from '@/services/config/profileConfig';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import {
  checkProfileExistence,
  getProfileByStudentId,
} from '@/services/client/profile/profileApi';
import Link from 'next/link';

const Account = () => {
  const supabase = createClient();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { openModal, closeModal } = useModal();
  const [profileLink, setProfileLink] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserProfile(session?.user || null);
      // 첫 로그인 시 프로필 존재 여부 확인
      if (event === 'SIGNED_IN') {
        if (!session?.user?.id) return;
        checkProfileExistence(session.user.id).then((exists) => {
          if (exists) return;
          handleMakeProfile();
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const popup = window.open(
      `${window.location.origin}/auth/login`,
      '_blank',
      'popup,scrollbars=yes,resizable=yes,width=500,height=800',
    );

    popup?.focus();

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'success') {
        popup?.close();
        window.removeEventListener('message', handleMessage);
      }
    };
    window.addEventListener('message', handleMessage);
  };

  const handleMakeProfile = () => {
    openModal(
      <InputOfModal
        title="프로필 설정"
        config={profileConfig}
        onSubmit={() => closeModal()}
      />,
    );
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 setState 호출을 방지하기 위한 플래그
    let mounted = true;

    const fetchProfileLink = async () => {
      if (!userProfile?.id || !mounted) return;
      const profile = await getProfileByStudentId(userProfile.id);

      if (!mounted) return;
      if (profile) {
        setProfileLink(`/portfolio/${profile.profile_name}`);
      } else {
        setProfileLink(null);
      }
    };
    fetchProfileLink();

    return () => {
      mounted = false;
    };
  }, [userProfile?.id]);

  return userProfile ? (
    <Dropdown
      trigger={
        <Image
          src={userProfile?.user_metadata?.avatar_url ?? '/avatar.png'}
          alt="프로필"
          width={20}
          height={20}
          className="rounded-full cursor-pointer hover:opacity-80"
        />
      }
      align="right"
    >
      {profileLink ? (
        <Link href={profileLink}>
          <DropdownItem>내 프로필</DropdownItem>
        </Link>
      ) : (
        <DropdownItem onSelect={handleMakeProfile}>프로필 만들기</DropdownItem>
      )}
      <DropdownItem
        onSelect={() => {
          supabase.auth.signOut();
        }}
      >
        로그아웃
      </DropdownItem>
    </Dropdown>
  ) : (
    <button
      onClick={handleGoogleLogin}
      className="px-2 py-1 bg-black text-caption text-white rounded-full transition-colors"
    >
      로그인
    </button>
  );
};

export default Account;
