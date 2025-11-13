'use client';

import { useFormConfigData } from '@/utils/hook/useFormConfigData';
import InputOfModal from '@/app/components/modal/inputs/InputOfModal';
import { teamProfileConfig } from '@/services/config/teamProfileConfig';
import { createClient } from '@/services/supabase/client';
import { useEffect, useState } from 'react';

const TeamProfilePage = () => {
  const supabase = createClient();
  const [owner, setOwner] = useState<string>('');

  useEffect(() => {
    const fetchOwner = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setOwner(user.id);
      }
    };
    fetchOwner();
  }, [supabase]);

  const { initialValues, isLoading, saveData, error, canSave } =
    useFormConfigData(
      teamProfileConfig,
      { owner }, // GraphQL variables
      {
        autoLoad: true, // 자동 로드
        mode: 'create', // 테스트용으로 create 모드
      },
    );

  console.log('initialValues:', initialValues);

  const handleSave = (
    formData: Record<
      string,
      import('@/app/components/modal/inputs/MultiInput').MultiInputItem[][] |
        string[] |
        boolean |
        File |
        number[] |
        null |
        string
    >,
  ): void => {
    void (async () => {
      try {
        const result = await saveData(
          formData as unknown as Record<
            string,
            import('@/app/components/modal/inputs/MultiInput').MultiInputItem[][] |
              string[] |
              boolean |
              File |
              null |
              string
          >,
          {
          owner,
          is_team: true,
          },
        );
        if (result.success) {
          alert('저장되었습니다!');
        } else {
          alert('저장 실패');
        }
      } catch (err) {
        console.error('저장 실패:', err);
        alert('저장 실패');
      }
    })();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">팀 프로필 테스트</h1>
      <InputOfModal
        title="팀 프로필 만들기"
        config={teamProfileConfig}
        initialValues={initialValues}
        onSubmit={canSave ? handleSave : undefined}
      />
    </div>
  );
};

export default TeamProfilePage;
