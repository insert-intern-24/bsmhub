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
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
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

  const handleMakeProfile = async () => {
    if (!userProfile?.id) {
      console.error('User ID not available');
      return;
    }

    // 프로필 존재 여부 확인
    const profileExists = await checkProfileExistence(userProfile.id);

    // 프로필 편집 모달 컴포넌트
    const ProfileEditModal = () => {
      // 새로운 범용 Hook 사용 (사용자 정의 쿼리 + 데이터 매핑)
      const { initialValues, isLoading, saveData, error, mode, canSave } =
        useFormConfigData(
          profileConfig,
          { owner: userProfile.id }, // GraphQL variables
          {
            autoLoad: true, // 자동 로드
            mode: profileExists ? 'update' : 'create', // 명확한 모드 설정
          },
        );

      const handleProfileSubmit = async (formData: any) => {
        const result = await saveData(formData, {
          owner: userProfile.id,
          is_team: false,
        });

        if (result.success) {
          console.log('프로필이 성공적으로 저장되었습니다.');
          console.log('Save result:', result);

          // 저장된 프로필 이름을 응답에서 가져오기
          let profileName = null;
          if (result.data) {
            // Update의 경우 records에서 profile_name 가져오기
            if (
              mode === 'update' &&
              result.data.updateprofileCollection?.records?.[0]?.profile_name
            ) {
              profileName =
                result.data.updateprofileCollection.records[0].profile_name;
            }
            // Insert의 경우 records에서 profile_name 가져오기
            else if (
              mode === 'create' &&
              result.data.insertIntoprofileCollection?.records?.[0]
                ?.profile_name
            ) {
              profileName =
                result.data.insertIntoprofileCollection.records[0].profile_name;
            }
          }

          // 프로필 이름이 있으면 링크 업데이트, 없으면 기존 방식 사용
          if (profileName) {
            setProfileLink(`/portfolio/${profileName}`);
          } else {
            // 백업: 기존 방식으로 프로필 다시 가져오기
            const profile = await getProfileByStudentId(userProfile.id);
            if (profile) {
              setProfileLink(`/portfolio/${profile.profile_name}`);
            }
          }

          closeModal();
        } else {
          console.error('프로필 저장 실패:', result.message);

          // 에러 메시지를 사용자 친화적으로 변환
          let errorMessage =
            result.message || '알 수 없는 오류가 발생했습니다.';

          if (
            errorMessage.includes('duplicate key') ||
            errorMessage.includes('profile_name_key')
          ) {
            errorMessage =
              '이미 사용 중인 프로필 이름입니다. 다른 이름을 사용해주세요.';
          } else if (errorMessage.includes('unique constraint')) {
            errorMessage =
              '중복된 데이터가 존재합니다. 입력 내용을 확인해주세요.';
          }

          alert(`저장 중 오류가 발생했습니다:\n${errorMessage}`);
        }
      };

      if (isLoading) {
        return (
          <div className="p-8 text-center">프로필 정보를 불러오는 중...</div>
        );
      }

      if (error) {
        return (
          <div className="p-8 text-center text-red-500">오류: {error}</div>
        );
      }

      return (
        <InputOfModal
          title={mode === 'update' ? '프로필 수정' : '프로필 만들기'}
          config={profileConfig}
          initialValues={initialValues}
          onSubmit={canSave ? handleProfileSubmit : undefined}
        />
      );
    };

    openModal(<ProfileEditModal />);
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
      <DropdownItem onSelect={handleMakeProfile}>프로필 만들기</DropdownItem>
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
