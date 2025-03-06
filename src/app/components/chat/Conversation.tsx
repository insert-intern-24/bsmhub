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
    return format(date, 'H:mm', { locale: ko });
  } else if (date.getFullYear() === today.getFullYear()) {
    return format(date, 'M월 d일', { locale: ko });
  } else {
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  }
}

function Conversation({ conversationId }: ConversationProps) {
  const { setUsername } = useUserStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myProfileId, setMyProfileId] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  // 대화 읽음 처리: conversationId, myProfileId, messages가 변경될 때마다 실행
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

  // 메시지 업데이트 시 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // textarea auto-resize: 최소 30px, 최대 60px 적용
  useEffect(() => {
    const MIN_HEIGHT = 30;
    const MAX_HEIGHT = 60;
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${MIN_HEIGHT}px`;
      const newHeight = textAreaRef.current.scrollHeight;
      let finalHeight = newHeight;
      if (newHeight < MIN_HEIGHT) {
        finalHeight = MIN_HEIGHT;
        textAreaRef.current.style.overflowY = 'hidden';
      } else if (newHeight > MAX_HEIGHT) {
        finalHeight = MAX_HEIGHT;
        textAreaRef.current.style.overflowY = 'auto';
      } else {
        textAreaRef.current.style.overflowY = 'hidden';
      }
      textAreaRef.current.style.height = `${finalHeight}px`;
    }
  }, [message]);

  const handleSend = async () => {
    const currentMessage = message.trim();
    if (!currentMessage || isComposing) return;
    if (!myProfileId) {
      console.error('Sender profile ID is missing.');
      return;
    }
    // 전송 전에 입력창과 textarea 높이 초기화
    setMessage('');
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
      textAreaRef.current.style.height = '30px';
    }
    const newMsg = await sendChatMessage(
      conversationId,
      myProfileId,
      currentMessage,
    );
    if (newMsg) {
      setMessages((prev) => {
        if (prev.find((msg) => msg.message_id === newMsg.message_id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
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
    <div className="max-h-[20rem] flex flex-col px-4">
      {/* 메시지 영역 */}
      <div
        className="flex-1 overflow-y-auto space-y-[0.1rem] pb-2"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {renderedMessages}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex gap-3 items-start">
        <Image
          src={more}
          alt="더보기"
          width={(10 * 12) / 16}
          height={(10 * 12) / 16}
          className="mt-2"
        />
        <textarea
          ref={textAreaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            // compositionEnd 시에도 최종 값 반영
            setMessage((e.target as HTMLTextAreaElement).value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요"
          className="flex-1 bg-[#F5F5F7] rounded-full px-4 py-2 resize-none overflow-hidden"
          style={{ height: '30px' }} // 초기 높이 30px
        />
        <button onClick={handleSend} className="mt-2">
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
