import { InputWithLabel } from '@/app/components/Input';
const ProfileEditForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <InputWithLabel label="프로필 이름" placeholder="이름을 입력해주세요" />
        <InputWithLabel label="영문 이름" placeholder="이름을 입력해주세요" />
      </div>
      <InputWithLabel label="전화번호" placeholder="+82 10-0000-0000" />
      <InputWithLabel
        label="이메일"
        placeholder="example@example.com"
        type="email"
      />
    </div>
  );
};

export default ProfileEditForm;
