'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import hide from '@public/images/symbol/hide.svg';
import ChatProfile from './ChatProfile';
import Conversation from './Conversation';
import getConversationsForProfile from '@/services/chat/getConversationsForProfile';
import getProfileBySession from '@/services/profile/getProfileBySession';
import getProfileById from '@/services/profile/getProfileById';
import profile from '@public/images/profile/default.svg';
import { Database } from '@/utils/supabase/database.types';
import { useUserStore, useChatStore } from './chatStore';
import { subscribeConversations } from '@/services/chat/subscribeConversations';
import { getChatMessages } from '@/services/chat/getChatMessages';

const Chat: React.FC = () => {
  // 로컬 상태: 대화 목록, 상대 프로필 정보, 내 프로필 ID, 프리패칭 메시지
  const [conversations, setConversations] = useState<
    Database['public']['Tables']['conversations']['Row'][]
  >([]);
  const [conversationProfiles, setConversationProfiles] = useState<
    Record<string, string>
  >({});
  const [myProfileId, setMyProfileId] = useState<string>('');
  const [prefetchedMessages, setPrefetchedMessages] = useState<
    Record<string, Database['public']['Tables']['chat_messages']['Row'][]>
  >({});

  // 전역 상태
  const {
    chatState,
    activeConversationId,
    setChatState,
    setActiveConversationId,
  } = useChatStore();
  const { username } = useUserStore();

  // 초기 데이터 및 프리패칭
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfileBySession();
        if (profileData?.profile_id) {
          setMyProfileId(profileData.profile_id);
          const convos = await getConversationsForProfile(
            profileData.profile_id,
          );
          // last_message와 updated_at 값이 있는 대화만 사용
          const filteredConvos = convos.filter(
            (c) => c.last_message && c.updated_at,
          );
          setConversations(filteredConvos);

          // 상대 프로필 정보 로드
          const profilesMap: Record<string, string> = {};
          await Promise.all(
            filteredConvos.map(async (conversation) => {
              const participantId = conversation.participant_ids.find(
                (id) => id !== profileData.profile_id,
              );
              if (participantId) {
                const participantProfile = await getProfileById(participantId);
                profilesMap[conversation.conversation_id] =
                  participantProfile?.profile_name || '알 수 없음';
              }
            }),
          );
          setConversationProfiles(profilesMap);

          // 각 대화의 최신 메시지(최근 20개)를 미리 프리패칭
          const messagesMap: Record<
            string,
            Database['public']['Tables']['chat_messages']['Row'][]
          > = {};
          await Promise.all(
            filteredConvos.map(async (conversation) => {
              const msgs = await getChatMessages(
                conversation.conversation_id,
                0,
                20,
              );
              messagesMap[conversation.conversation_id] = msgs;
            }),
          );
          setPrefetchedMessages(messagesMap);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchData();
  }, []);

  // 실시간 구독: conversations 테이블 업데이트 (INSERT, UPDATE)
  useEffect(() => {
    const subscription = subscribeConversations((updatedConversation) => {
      setConversations((prev) => {
        const index = prev.findIndex(
          (conv) =>
            conv.conversation_id === updatedConversation.conversation_id,
        );
        if (index !== -1) {
          const newConvos = [...prev];
          newConvos[index] = updatedConversation;
          return newConvos;
        } else {
          // 새로운 대화도 추가
          return [updatedConversation, ...prev];
        }
      });
    });
    // Return the unsubscribe function directly
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleArrowClick = () => {
    if (chatState === 2) {
      setChatState(1);
      setActiveConversationId(null);
    } else if (chatState === 1) {
      setChatState(0);
    } else if (chatState === 0) {
      setChatState(1);
    }
  };

  const handleChatProfileClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setChatState(2);
  };

  const arrowRotation = chatState === 0 ? 180 : chatState === 1 ? 0 : 90;

  return (
    <div className="fixed bottom-0 right-[10rem] w-[23.5rem] bg-white rounded-t-2xl p-5 shadow-lg">
      {/* 헤더 영역 */}
      <div className="flex flex-col justify-center items-center relative w-full gap-1">
        <motion.div
          animate={{ rotate: arrowRotation }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute top-3 left-0 cursor-pointer"
          onClick={handleArrowClick}
        >
          <Image
            src={hide}
            alt="토글"
            width={(22 * 12) / 16}
            height={(22 * 12) / 16}
          />
        </motion.div>
        {chatState === 2 ? (
          <div className="w-full flex pl-8 items-center gap-3">
            <Image
              src={profile}
              width={(40 * 12) / 16}
              height={(40 * 12) / 16}
              alt="프로필 사진"
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-titleColor font-bold text-lg leading-5">
                {username}
              </h3>
              <p className="text-[0.875rem] text-detailColor leading-3">
                Messenger
              </p>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-titleColor font-bold text-lg leading-5">
              커피챗
            </h3>
            <p className="text-[0.875rem] text-detailColor leading-3">Online</p>
          </>
        )}
      </div>
      <AnimatePresence>
        {chatState === 1 && (
          <motion.div
            key="chatProfiles"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 space-y-4 overflow-y-auto max-h-[20rem] hide-scrollbar min-h-[20rem]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {conversations.map((conversation) => {
              const lastMsg = conversation.last_message || '메시지 없음';
              const sentTime = conversation.updated_at || '';
              const isUnread =
                conversation.unread_user_ids.includes(myProfileId);
              return (
                <div
                  key={conversation.conversation_id}
                  onClick={() =>
                    handleChatProfileClick(conversation.conversation_id)
                  }
                >
                  <ChatProfile
                    username={
                      conversationProfiles[conversation.conversation_id] ||
                      '알 수 없음'
                    }
                    lastMessage={lastMsg}
                    at={sentTime}
                    isUnread={isUnread}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
        {chatState === 2 && (
          <motion.div
            key="conversation"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 max-h-[30rem]"
          >
            {/* 미리 프리패칭된 메시지를 initialMessages prop으로 전달 */}
            <Conversation
              conversationId={activeConversationId || ''}
              initialMessages={
                prefetchedMessages[activeConversationId || ''] || []
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
