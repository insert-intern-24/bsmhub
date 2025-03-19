'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  initialMessages?: ChatMessage[];
}

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

const Conversation: React.FC<ConversationProps> = ({
  conversationId,
  initialMessages = [],
}) => {
  const { setUsername } = useUserStore();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [myProfileId, setMyProfileId] = useState<string>('');
  const [offset, setOffset] = useState<number>(initialMessages.length);
  const limit = 20;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 프로필 정보 로드
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

  // 마운트 시 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  // 읽음 처리
  useEffect(() => {
    if (conversationId && myProfileId) {
      markConversationAsRead(conversationId, myProfileId);
    }
  }, [conversationId, myProfileId, messages]);

  // 초기 메시지 로드 (프리패칭된 값이 있으면 사용)
  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (offset === 0) {
        const initial = await getChatMessages(conversationId, 0, limit);
        setMessages(initial);
        setOffset(initial.length);
        if (initial.length < limit) {
          setHasMore(false);
        }
      }
    };

    fetchInitialMessages();
  }, [conversationId, offset, limit]);

  // 무한 스크롤: 이전 메시지 로드 (prepend)
  const loadMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const container = containerRef.current;
    if (!container) return;
    // 현재 스크롤 위치 기록
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;
    const olderMessages = await getChatMessages(conversationId, offset, limit);
    if (olderMessages.length < limit) {
      setHasMore(false);
    }
    setMessages((prev) => [...olderMessages, ...prev]);
    setOffset((prev) => prev + olderMessages.length);
    setIsLoading(false);
    // 새로 추가된 높이만큼 scrollTop 보정하여 기존 스크롤 위치 유지
    setTimeout(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
      }
    }, 0);
  }, [conversationId, offset, limit, isLoading, hasMore]);

  // 무한 스크롤 이벤트 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore) return;
    const handleScroll = () => {
      if (container.scrollTop < 50 && hasMore && !isLoading) {
        loadMessages();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, loadMessages]);

  // 실시간 구독: 새 메시지 append (새 메시지 전송 시 스크롤 아래 이동)
  useEffect(() => {
    const subscription = subscribeChatMessages(
      conversationId,
      (newMsg: ChatMessage) => {
        setMessages((prev) => {
          if (prev.find((msg) => msg.message_id === newMsg.message_id)) {
            return prev;
          }
          setShouldScrollToBottom(true);
          return [...prev, newMsg];
        });
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  // 새 메시지 append 시 스크롤 맨 아래로 이동
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  // textarea auto-resize: 최소 30px, 최대 60px
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
    setShouldScrollToBottom(true);
    setMessage('');
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
      textAreaRef.current.style.height = '30px';
    }
    const newMsg: ChatMessage | null = await sendChatMessage(
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
    <div className="min-h-[20rem] max-h-[20rem] flex flex-col px-4">
      {/* 메시지 영역 */}
      <div
        ref={containerRef}
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
            setMessage(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요"
          className="flex-1 bg-[#F5F5F7] rounded-full px-4 py-2 resize-none overflow-hidden"
          style={{ height: '30px' }}
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
};

export default Conversation;
