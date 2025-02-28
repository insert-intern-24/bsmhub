'use client';
import React, { useEffect, useState } from 'react';
import { getPartnerProfile } from '@/services/chat/getPartnerProfile';
import { useUserStore } from './chatStore';
import send from '@public/images/symbol/send.svg';
import Image from 'next/image';
import more from '@public/images/symbol/more.svg';
import { sendChatMessage } from '@/services/chat/sendChatMessage';
import getProfileBySession from '@/services/profile/getProfileBySession';
import subscribeChatMessages, {
  ChatMessage,
} from '@/services/chat/subscribeChatMessages';
import { getChatMessages } from '@/services/chat/getChatMessages';

interface ConversationProps {
  conversationId: string;
}

function Conversation({ conversationId }: ConversationProps) {
  const { setUsername } = useUserStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myProfileId, setMyProfileId] = useState('');

  // 상대방 프로필 가져오기
  useEffect(() => {
    async function fetchProfile() {
      const profile = await getPartnerProfile(conversationId);
      setUsername(profile?.profile_name || '알 수 없음');
    }
    fetchProfile();
  }, [conversationId, setUsername]);

  // 내 프로필 ID 가져오기
  useEffect(() => {
    async function fetchMyProfile() {
      const profileData = await getProfileBySession();
      if (profileData?.profile_id) {
        setMyProfileId(profileData.profile_id);
      }
    }
    fetchMyProfile();
  }, []);

  // 기존 메시지 가져오기 + 실시간 구독
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

  // 메시지 전송 핸들러
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

  return (
    <div className="h-full p-4 flex flex-col">
      {/* 메시지 목록: flex-1과 min-h-0을 적용하여 오직 이 영역만 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => {
          const isMine = msg.sender_profile_id === myProfileId;
          return (
            <div
              key={msg.message_id}
              className={`p-2 rounded max-w-[80%] ${
                isMine
                  ? 'bg-black text-white self-end'
                  : 'bg-[#F5F5F7] text-black self-start'
              }`}
            >
              <p>{msg.content}</p>
              <small>{msg.created_at}</small>
            </div>
          );
        })}
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
