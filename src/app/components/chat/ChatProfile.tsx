import React from 'react';
import Image from 'next/image';
import profile from '@public/images/profile/default.svg';
import { formatDistanceToNowStrict } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatProfileProps {
  username: string;
  lastMessage: string;
  at: string;
  isUnread?: boolean;
}

function ChatProfile({
  username,
  lastMessage,
  at,
  isUnread = false,
}: ChatProfileProps) {
  function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: ko });
  }

  return (
    <div className="flex items-center gap-3 p-2">
      <Image
        src={profile}
        width={(60 * 12) / 16}
        height={(60 * 12) / 16}
        alt="프로필 사진"
        className="rounded-full"
      />
      <div>
        <p
          className={`text-[1rem] text-titleColor leading-5 ${
            isUnread ? 'font-bold' : 'font-semibold'
          }`}
        >
          {username}
        </p>
        <p
          className={`text-[0.875rem] text-detailColor ${
            isUnread ? 'font-bold' : 'font-normal'
          }`}
        >
          {lastMessage} · {getRelativeTime(at)}
        </p>
      </div>
    </div>
  );
}

export default ChatProfile;
