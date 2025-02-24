import Background from '@/app/components/layout/Background';

const newProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Background>
        <div className="p-8 max-w-[800px]">
          <h1 className="text-2xl font-bold">새 프로필 만들기</h1>
          <br />
          {children}
        </div>
      </Background>
    </>
  );
};

export default newProfileLayout;
