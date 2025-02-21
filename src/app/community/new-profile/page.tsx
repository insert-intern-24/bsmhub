import Background from '@/app/components/layout/Background';
import ProfileEditForm from '@/app/components/community/profile/ProfileEditForm';

const newProfilePage = () => {
  return (
    <>
      <Background>
        <div className="p-8 max-w-[800px]">
          <h1 className="text-2xl font-bold">새 프로필 만들기</h1>
          <br />
          <ProfileEditForm />
        </div>
      </Background>
    </>
  );
};

export default newProfilePage;
