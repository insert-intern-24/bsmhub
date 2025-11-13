'use client';

import { createClient } from '@/services/supabase/client';
import { useEffect } from 'react';
import {Dropdown, DropdownItem} from '../dropdown/Dropdown';
import { useCreateProject } from '@/utils/hook/useCreateProject';
import { useCreateProfile } from '@/utils/hook/useCreateProfile';
import { useCurrentUser } from '@/utils/hook/useCurrentUser';
import { useProfileLink } from '@/utils/hook/useProfileLink';
import { useGoogleLogin } from '@/utils/hook/useGoogleLogin';
import { checkProfileExistence } from '@/services/profile/getProfileApi.client';
import Image from 'next/image';
import Link from 'next/link';

const Account = () => {
  const supabase = createClient();
  const currentUser = useCurrentUser();
  const profileLink = useProfileLink();
  const handleMakeProfile = useCreateProfile();
  const handleMakeProject = useCreateProject();
  const handleGoogleLogin = useGoogleLogin();

  useEffect(() => {
    if (!currentUser?.id) return;
    checkProfileExistence(currentUser.id).then((exists) => {
      if (!exists) {
        handleMakeProfile();
      }
    });
  }, [currentUser?.id, handleMakeProfile]);

  return currentUser ? (
    <Dropdown
      trigger={
        <Image
          src={currentUser?.user_metadata?.avatar_url ?? '/avatar.png'}
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
      <DropdownItem onSelect={handleMakeProject}>프로젝트 만들기</DropdownItem>
      <DropdownItem onSelect={() => supabase.auth.signOut()}>
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
