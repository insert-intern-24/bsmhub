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
import { useUserStore } from './chatStore';

function Chat() {
  // chatState: 0 - 접힌 상태, 1 - 대화 리스트 펼친 상태, 2 - 대화중인 상태
  const [chatState, setChatState] = useState(0);
  const [conversations, setConversations] = useState<
    Database['public']['Tables']['conversations']['Row'][]
  >([]);
  const [conversationProfiles, setConversationProfiles] = useState<
    Record<string, string>
  >({});
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const { username } = useUserStore();
  const [myProfileId, setMyProfileId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfileBySession();
        if (profileData?.profile_id) {
          setMyProfileId(profileData.profile_id);
          const convos = await getConversationsForProfile(
            profileData.profile_id,
          );
          setConversations(convos || []);

          const profilesMap: Record<string, string> = {};
          await Promise.all(
            convos.map(async (conversation) => {
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

  // 화살표 클릭 핸들러
  const handleArrowClick = () => {
    if (chatState === 2) {
      // 대화중 상태면 리스트로 돌아감
      setChatState(1);
      setSelectedConversationId(null);
    } else if (chatState === 1) {
      // 리스트 펼친 상태면 접힘
      setChatState(0);
    } else if (chatState === 0) {
      // 접힌 상태면 리스트 펼침
      setChatState(1);
    }
  };

  // 대화 프로필 클릭 핸들러 (대화창 열기)
  const handleChatProfileClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setChatState(2);
  };

  // chatState에 따른 화살표 회전 값
  // 0일때: 180도, 1일때: 0도, 2일때: 90도
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
        {/* 대화 리스트 */}
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
              // DB에 저장된 최근 메시지와 전송 시간을 그대로 사용
              const lastMsg = conversation.last_message || '메시지 없음';
              const sentTime = conversation.updated_at || '';
              // unread_user_ids에 내 profile_id가 포함되면 읽지 않은 메시지로 판단
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
        {/* 대화창 */}
        {chatState === 2 && (
          <motion.div
            key="conversation"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 max-h-[30rem]"
          >
            <Conversation conversationId={selectedConversationId || ''} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
