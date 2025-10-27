'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { Dropdown, DropdownItem } from '@/app/components/dropdown/DropDown';
import { profileConfig } from '@/services/config/profileConfig';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { checkProfileExistence } from '@/services/client/profile/profileApi';

const Account = () => {
  const supabase = createClient();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserProfile(session?.user || null);
      // 첫 로그인 시 프로필 존재 여부 확인
      if (event === 'SIGNED_IN') {
        checkProfileExistence(session!.user.id).then((exists) => {
          if (exists) return;
          openModal(
            <InputOfModal
              title="프로필 설정"
              config={profileConfig}
              onSubmit={() => closeModal()}
            />,
          );
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

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === 'success') {
        popup?.close();
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
      <DropdownItem onSelect={handleLogout}>로그아웃</DropdownItem>
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
