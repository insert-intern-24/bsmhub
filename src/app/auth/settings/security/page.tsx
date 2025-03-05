import { InputWithLabel } from '@/app/components/Input';
const AccountSecurityPage = () => {
  return (
    <div className="p-6 border-[1px] border-strokeColor">
      <h3>보안 연락처</h3>
      <div className="flex items-center justify-between mt-4 gap-2 w-full">
        <InputWithLabel placeholder="010-0000-0000" label="전화번호" />
        <InputWithLabel placeholder="example@example.com" label="이메일" />
      </div>
    </div>
  );
};

export default AccountSecurityPage;
