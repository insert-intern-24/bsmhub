'use client';
import { InputWithLabel } from '@/app/components/Input';
import { FormEventHandler } from 'react';

import createNewProfile from '@/services/profile/createNewProfile';
import getProfileById from '@/services/profile/getProfileById';
import getUserIdBySession from '@/services/user/getUserIdBySession';

const ProfileEditForm = ({
  profile_id = '',
  isTeam = false,
}: {
  profile_id?: string;
  isTeam?: boolean;
}) => {
  const ProfileFormSubmitHandler: FormEventHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (profile_id == '') {
      const userID = await getUserIdBySession();
      if (userID) {
        const result = await createNewProfile({
          profile_name: formData.get('profile_name') as string,
          isTeam: isTeam,
          email: formData.get('email') as string,
          owner: userID,
        });
        if (result === 0) {
          alert('프로필 생성 성공');
        }
      } else console.error('로그인 상태 아님');
    } else {
      const profile = await getProfileById(profile_id);
      console.log(profile);
    }
  };
  return (
    <form className="flex flex-col gap-6" onSubmit={ProfileFormSubmitHandler}>
      <InputWithLabel
        label="프로필 이름"
        placeholder="이름을 입력해주세요"
        name="profile_name"
      />
      <InputWithLabel
        label="이메일"
        placeholder="example@example.com"
        type="email"
        name="email"
      />
      {profile_id != '' ? <></> : <></>}
      <button type="submit">제출</button>
    </form>
  );
};

export default ProfileEditForm;
