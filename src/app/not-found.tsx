import React from 'react';
import Link from 'next/link';
import { Title, Body } from '@/app/components/system/text';

export default function NotFound() {
  return (
    <div className="flex-center-all h-screen">
      <Title className="mb-4">404 - 페이지를 찾을 수 없습니다</Title>
      <Body className="mb-8">요청하신 페이지가 존재하지 않습니다</Body>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-primary text-white rounded-full"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
