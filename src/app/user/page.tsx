// app/user/page.tsx
import Background from '@components/shared/Background';
import React from 'react';
import Image from 'next/image';

const UserPage = () => {
	return (
    <>
      <div>
        <Image src="images/profile/default.svg" alt="default-profile" width={90} height={90}/>
      </div>
      <Background/>
    </>
  );
};

export default UserPage;
