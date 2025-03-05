import { headers } from 'next/headers';
import { SideNav } from '@/app/components/auth/settings/SideNav';

const AccountSettingLayout = async ({ children }: React.PropsWithChildren) => {
  const headerList = await headers();
  console.log(new URL(headerList.get('x-url') as string).pathname);
  return (
    <div className="bg-white w-full min-h-[100vh]">
      <div className="w-full border-b-[1px] border-strokeColor">
        <h1 className="font-semibold text-xl p-4">계정 설정</h1>
      </div>
      <div className="flex">
        <SideNav />
        <div className="py-4 px-6 w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default AccountSettingLayout;
