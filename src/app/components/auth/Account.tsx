'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useModal } from '@/app/components/modal';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { useProfileExistence } from '@/utils/hook/useProfile';
import { useDropdown } from '@/utils/hook/useDropdown';
import { profileConfig } from '@/services/config/profileConfig';
import Image from 'next/image';

function Account() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{ avatar_url?: string; full_name?: string } | null>(null);
  const { openModal, closeModal } = useModal();
  const { isOpen: isDropdownOpen, toggle: toggleDropdown, close: closeDropdown, dropdownRef } = useDropdown();
  
  const { data: profileExists, isLoading: isProfileLoading } = useProfileExistence();

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
          setHasShownModal(false);
          setUserProfile(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isProfileLoading && profileExists === false && !hasShownModal) {
      setHasShownModal(true);
      openModal(
        <InputOfModal
          title="프로필 설정"
          config={profileConfig}
          onSubmit={() => closeModal()}
        />
      );
    }
  }, [isLoggedIn, isProfileLoading, profileExists, hasShownModal, openModal, closeModal]);

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
    closeDropdown();
  };

  if (isLoggedIn) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          {userProfile?.avatar_url && (
            <Image
              src={userProfile.avatar_url}
              alt={userProfile.full_name || '프로필'}
              width={20}
              height={20}
              className="rounded-full select-none cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleDropdown}
            />
          )}
        </div>
        
        {isDropdownOpen && (
          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
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
}

export default Account;
