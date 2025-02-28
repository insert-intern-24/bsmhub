'use client';
import React from 'react';
import Image from 'next/image';
import getOrCreateConversation from '@/services/chat/getOrCreateConversation';

function Button({
  text,
  senderId,
  receiverId,
}: {
  text: string;
  senderId: string;
  receiverId: string;
}) {
  const handleClick = () => {
    getOrCreateConversation(senderId, receiverId);
  };

  return (
    <button
      className="w-[13.75rem] flex gap-1 items-center justify-center bg-black px-5 py-2 rounded-3xl"
      onClick={handleClick}
    >
      <Image
        src="/images/symbol/pick-plus.svg"
        alt={text}
        width={14}
        height={14}
      />
      <span className="font-bold text-white">{text}</span>
    </button>
  );
}

export default Button;
