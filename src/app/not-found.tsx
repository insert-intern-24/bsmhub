import React from 'react';
import Link from 'next/link';
import { Title, Body } from '@/app/components/shared/system/text';

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white">
      <Title>404 - 페이지를 찾을 수 없습니다</Title>
      <Body className="mb-4">요청하신 페이지가 존재하지 않습니다</Body>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-primary text-white rounded-full hover:bg-blue-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
