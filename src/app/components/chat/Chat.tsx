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

function Chat() {
  // 로컬 상태: 대화 목록, 상대 프로필 정보, 내 프로필 ID
  const [conversations, setConversations] = useState<
    Database['public']['Tables']['conversations']['Row'][]
  >([]);
  const [conversationProfiles, setConversationProfiles] = useState<
    Record<string, string>
  >({});
  const [myProfileId, setMyProfileId] = useState('');

  // 전역 상태: chatState와 activeConversationId (Zustand)
  const {
    chatState,
    activeConversationId,
    setChatState,
    setActiveConversationId,
  } = useChatStore();
  const { username } = useUserStore();

  // 초기 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfileBySession();
        if (profileData?.profile_id) {
          setMyProfileId(profileData.profile_id);
          // 내 프로필이 포함된 대화 목록 가져오기
          const convos = await getConversationsForProfile(
            profileData.profile_id,
          );
          // last_message와 updated_at 값이 없는 대화는 제외
          const filteredConvos = convos.filter(
            (c) => c.last_message && c.updated_at,
          );
          setConversations(filteredConvos);

          // 각 대화의 상대방 프로필 정보 가져오기
          const profilesMap: Record<string, string> = {};
          await Promise.all(
            filteredConvos.map(async (conversation) => {
              const participantId = conversation.participant_ids.filter(
                (id) => id !== profileData.profile_id,
              )[0];
              const participantProfile = await getProfileById(participantId);
              profilesMap[conversation.conversation_id] =
                participantProfile?.profile_name || '알 수 없음';
            }),
          );
          setConversationProfiles(profilesMap);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchData();
  }, []);

  // conversations 테이블 업데이트 실시간 구독 (리얼타임)
  useEffect(() => {
    const subscription = subscribeConversations((updatedConversation) => {
      setConversations((prev) => {
        const index = prev.findIndex(
          (conv) =>
            conv.conversation_id === updatedConversation.conversation_id,
        );
        if (index !== -1) {
          // 기존 대화를 업데이트
          const newConvos = [...prev];
          newConvos[index] = updatedConversation;
          return newConvos;
        } else {
          // 새로운 대화가 있다면 추가할 수도 있음.
          return prev;
        }
      });
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 헤더의 화살표 클릭 핸들러 (전역 상태 업데이트)
  const handleArrowClick = () => {
    if (chatState === 2) {
      // 대화창 상태 → 리스트로 돌아가기
      setChatState(1);
      setActiveConversationId(null);
    } else if (chatState === 1) {
      // 리스트 펼침 → 접힘
      setChatState(0);
    } else if (chatState === 0) {
      // 접힘 → 리스트 펼침
      setChatState(1);
    }
  };

  // 대화 프로필 클릭 시: 활성 대화 ID와 chatState를 전역 상태로 업데이트
  const handleChatProfileClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setChatState(2);
  };

  // chatState에 따른 화살표 회전: 0 → 180°, 1 → 0°, 2 → 90°
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
        {/* 대화 리스트 영역 */}
        {chatState === 1 && (
          <motion.div
            key="chatProfiles"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 space-y-4 overflow-y-auto max-h-[30rem] hide-scrollbar"
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
        {/* 대화창 영역 */}
        {chatState === 2 && (
          <motion.div
            key="conversation"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 max-h-[30rem]"
          >
            <Conversation conversationId={activeConversationId || ''} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
