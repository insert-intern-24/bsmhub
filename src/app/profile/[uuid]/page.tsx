// app/user/page.tsx
import React from 'react';
import ProfileTemplate from '../ProfileTemplate';

const UserPage = async ({ params }: { params: Promise<{ uuid: string }> }) => {
  return <ProfileTemplate uuid={(await params).uuid} />;
};

export default UserPage;
