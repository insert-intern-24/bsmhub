'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useProfileExistence } from '@/utils/hook/useProfile';
import { Dropdown, DropdownItem } from '@/app/components/dropdown/DropDown';
import { profileConfig } from '@/services/config/profileConfig';
import Image from 'next/image';

interface UserProfile {
  avatar_url?: string;
  full_name?: string;
}

const Account = () => {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { openModal, closeModal } = useModal();
  
  const { data: profileExists } = useProfileExistence();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
          const userMetadata = session.user.user_metadata;
          setUserProfile({
            avatar_url: userMetadata?.avatar_url || userMetadata?.picture,
            full_name: userMetadata?.full_name || userMetadata?.name
          });
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn && profileExists === false) {
      openModal(
        <InputOfModal
          title="프로필 설정"
          config={profileConfig}
          onSubmit={() => closeModal()}
        />
      );
    }
  }, [isLoggedIn, profileExists]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoggedIn) {
    return (
      <Dropdown 
        trigger={
            <Image
              src={userProfile?.avatar_url ?? "/avatar.png"}
              alt='프로필'
              width={20}
              height={20}
              className="rounded-full cursor-pointer hover:opacity-80"
            />
        }
        align="right"
      >
        <DropdownItem onSelect={handleLogout}>
          로그아웃
        </DropdownItem>
      </Dropdown>
    );
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-2 py-1 bg-black text-caption text-white rounded-full transition-colors"
    >
      로그인
    </button>
  );
};

export default Account;
