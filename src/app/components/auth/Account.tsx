'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useProfileExistence } from '@/utils/hook/useProfile';
import { Dropdown, DropdownItem } from '@/app/components/dropdown/DropDown';
import { profileConfig } from '@/services/config/profileConfig';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

const Account = () => {
  const supabase = createClient();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { openModal, closeModal } = useModal();

  const { data: profileExists } = useProfileExistence();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserProfile(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userProfile && profileExists === false) {
      openModal(
        <InputOfModal
          title="프로필 설정"
          config={profileConfig}
          onSubmit={() => closeModal()}
        />,
      );
    }
  }, [userProfile, profileExists]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
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
