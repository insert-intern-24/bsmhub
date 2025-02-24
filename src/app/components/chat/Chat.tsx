'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import hide from '@public/images/symbol/hide.svg';
import ChatProfile from './ChatProfile';

function Chat() {
  const [isHide, setIsHide] = useState(true);

  return (
    <div className="fixed bottom-0 right-[10rem] w-[23.5rem] bg-white rounded-t-2xl p-5 shadow-lg">
      <div className="flex flex-col justify-center items-center relative w-full gap-1">
        <motion.div
          animate={{ rotate: isHide ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute top-3 left-0 cursor-pointer"
          onClick={() => setIsHide(!isHide)}
        >
          <Image
            src={hide}
            alt="커피챗 닫기"
            width={(22 * 12) / 16}
            height={(22 * 12) / 16}
          />
        </motion.div>
        <h3 className="text-titleColor font-semibold text-[1.125rem] leading-5">
          커피챗
        </h3>
        <p className="text-[0.875rem] text-detailColor leading-3">Online</p>
      </div>
      <AnimatePresence>
        {!isHide && (
          <motion.div
            key="chatProfiles"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-6 space-y-4 overflow-y-auto max-h-[30rem] hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
            <ChatProfile />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chat;
