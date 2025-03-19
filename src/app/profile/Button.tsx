'use client';
import React from 'react';
import Image from 'next/image';
import getOrCreateConversation from '@/services/chat/getOrCreateConversation';
import { useChatStore } from '@components/chat/chatStore';

interface ButtonProps {
  text: string;
  senderId: string;
  receiverId: string;
}

function Button({ text, senderId, receiverId }: ButtonProps) {
  const { setActiveConversationId, setChatState } = useChatStore();

  const handleClick = async () => {
    // getOrCreateConversation 실행: 대화 생성 또는 기존 대화 반환
    const conversation = await getOrCreateConversation(senderId, receiverId);
    if (conversation && conversation.conversation_id) {
      // 활성 대화 ID를 전역 상태에 업데이트
      setActiveConversationId(conversation.conversation_id);
      // 모든 함수 실행 후 chatState를 2 (대화창 상태)로 설정
      setChatState(2);
    }
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
