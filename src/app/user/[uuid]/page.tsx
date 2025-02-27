// app/user/page.tsx
import React from 'react';
import UserTemplate from '../ProfileTemplate';

const UserPage = async ({ params }: { params: { uuid: string }}) => {
  
  return (
    <UserTemplate uuid={(await params).uuid}/>
  );
};

export default UserPage;
