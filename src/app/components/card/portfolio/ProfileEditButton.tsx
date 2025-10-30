'use client';

import { IconPencil } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import InputOfModal from '../../modal/inputs/InputOfModal';
import { profileConfig } from '@/services/config/profileConfig';
import { useModal } from '../../modal';
import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import { checkProfileExistence } from '@/services/client/profile/profileApi';
import type { MultiInputItem } from '@/app/components/modal/inputs/MultiInput';

interface ProfileEditButtonProps {
  ownerId: string;
  profileName?: string;
}

export default function ProfileEditButton({
  ownerId,
  profileName,
}: ProfileEditButtonProps) {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { openModal, closeModal } = useModal();

  // 현재 로그인된 사용자 확인
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user || null);
    });

    // 초기 사용자 상태 설정
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // 권한 확인: 현재 사용자가 프로필 소유자인지 확인
  const isOwner = currentUser?.id === ownerId;

  const handleProfileEdit = useCallback(async () => {
    if (!currentUser?.id || !isOwner) {
      console.error('User not authorized to edit this profile');
      return;
    }

    // 프로필 존재 여부 확인
    const profileExists = await checkProfileExistence(ownerId);

    // 프로필 편집 모달 컴포넌트
    const ProfileEditModal = () => {
      // useFormConfigData 훅을 사용하여 데이터 로딩 및 저장
      const { initialValues, isLoading, saveData, error, mode, canSave } =
        useFormConfigData(
          profileConfig,
          { owner: ownerId }, // GraphQL variables
          {
            autoLoad: true, // 자동 로드
            mode: profileExists ? 'update' : 'create', // 명확한 모드 설정
          },
        );

      const handleProfileSubmit = (
        formData: Record<
          string,
          MultiInputItem[][] | string[] | boolean | File | number[] | null
        >,
      ): void => {
        void (async () => {
          const result = await saveData(
            formData as unknown as Record<
              string,
              MultiInputItem[][] | string[] | boolean | File | null | string
            >,
            {
              owner: ownerId,
              is_team: false,
            },
          );

          if (result.success) {
            console.log('프로필이 성공적으로 저장되었습니다.');
            console.log('Save result:', result);
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
        })();
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
  }, [ownerId, currentUser?.id, isOwner, closeModal, openModal]);

  // profileName은 현재 사용하지 않지만, 향후 로깅이나 디버깅에 사용할 수 있음
  console.log('Editing profile:', profileName);

  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-4 bg-black text-white w-full"
      onClick={handleProfileEdit}
      disabled={!currentUser || !isOwner}
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
