// app/user/page.tsx
import React from 'react';
import ProfileTemplate from '../ProfileTemplate';

const UserPage = async ({ params }: { params: { uuid: string }}) => {
  
  return (
    <ProfileTemplate uuid={(await params).uuid}/>
  );
};

export default UserPage;
