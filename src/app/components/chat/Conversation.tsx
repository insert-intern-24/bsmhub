'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { format, differenceInMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getPartnerProfile } from '@/services/chat/getPartnerProfile';
import { useUserStore } from './chatStore';
import send from '@public/images/symbol/send.svg';
import more from '@public/images/symbol/more.svg';
import { sendChatMessage } from '@/services/chat/sendChatMessage';
import getProfileBySession from '@/services/profile/getProfileBySession';
import subscribeChatMessages, {
  ChatMessage,
} from '@/services/chat/subscribeChatMessages';
import { getChatMessages } from '@/services/chat/getChatMessages';
import { markConversationAsRead } from '@/services/chat/markConversationAsRead';

interface ConversationProps {
  conversationId: string;
}

// 메시지 타임스탬프 포맷 함수
function getFormattedTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    // 오늘이면 시간만 (예: "9:40")
    return format(date, 'H:mm', { locale: ko });
  } else if (date.getFullYear() === today.getFullYear()) {
    // 올해이면 "M월 d일" (예: "3월 1일")
    return format(date, 'M월 d일', { locale: ko });
  } else {
    // 1년 이상 전이면 "yyyy년 M월 d일"
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  }
}

function Conversation({ conversationId }: ConversationProps) {
  const { setUsername } = useUserStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myProfileId, setMyProfileId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 파트너와 내 프로필 정보를 한 번에 가져오기
  useEffect(() => {
    async function fetchProfiles() {
      const [partnerProfile, myProfileData] = await Promise.all([
        getPartnerProfile(conversationId),
        getProfileBySession(),
      ]);
      setUsername(partnerProfile?.profile_name || '알 수 없음');
      if (myProfileData?.profile_id) {
        setMyProfileId(myProfileData.profile_id);
      }
    }
    fetchProfiles();
  }, [conversationId, setUsername]);

  // 대화 읽음 처리: conversationId, myProfileId, messages가 바뀔 때마다 실행
  useEffect(() => {
    if (conversationId && myProfileId) {
      markConversationAsRead(conversationId, myProfileId);
    }
  }, [conversationId, myProfileId, messages]);

  // 기존 메시지 로드와 실시간 구독
  useEffect(() => {
    async function fetchHistory() {
      const historyMessages = await getChatMessages(conversationId);
      setMessages(historyMessages);
    }
    fetchHistory();

    const subscription = subscribeChatMessages(
      conversationId,
      (newMsg: ChatMessage) => {
        setMessages((prev) => {
          // 중복 체크
          if (prev.find((msg) => msg.message_id === newMsg.message_id)) {
            return prev;
          }
          return [...prev, newMsg];
        });
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  // 스크롤: 메시지가 업데이트될 때마다 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!myProfileId) {
      console.error('Sender profile ID is missing.');
      return;
    }
    const newMsg = await sendChatMessage(conversationId, myProfileId, message);
    if (newMsg) {
      setMessages((prev) => {
        if (prev.find((msg) => msg.message_id === newMsg.message_id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
      setMessage('');
    }
  };

  // 인접 메시지 간의 시간 차이가 20분 이상이면 타임스탬프 표시
  const renderedMessages: JSX.Element[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (
      i === 0 ||
      differenceInMinutes(
        new Date(msg.created_at || ''),
        new Date(messages[i - 1].created_at || ''),
      ) >= 20
    ) {
      renderedMessages.push(
        <div
          key={`time-${msg.message_id}`}
          className="text-center my-2 text-gray-500 text-sm"
        >
          {getFormattedTimestamp(msg.created_at || '')}
        </div>,
      );
    }
    const isMine = msg.sender_profile_id === myProfileId;
    renderedMessages.push(
      <div
        key={msg.message_id}
        className={`w-full flex ${isMine ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`px-3 py-2 rounded-3xl max-w-[80%] w-fit ${
            isMine ? 'bg-black text-white' : 'bg-[#F5F5F7] text-black'
          }`}
        >
          <p className="text-[1rem]">{msg.content}</p>
        </div>
      </div>,
    );
  }

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-[0.1rem]">
        {renderedMessages}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex gap-3 items-center">
        <Image
          src={more}
          alt="더보기"
          width={(10 * 12) / 16}
          height={(10 * 12) / 16}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 h-10 bg-[#F5F5F7] rounded-full px-4"
        />
        <button onClick={handleSend}>
          <Image
            src={send}
            alt="전송"
            width={(24 * 12) / 16}
            height={(24 * 12) / 16}
          />
        </button>
      </div>
    </div>
  );
}

export default Conversation;
