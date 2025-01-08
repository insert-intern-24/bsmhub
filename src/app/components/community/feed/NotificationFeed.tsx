import React from 'react';
import CardHeader from '@components/community/feed/header/CardHeader';
import PostContent from './content/PostContent';
import PostReaction from './reaction/PostReaction';

export default function NotificationFeed() {
  return (
    <>
      <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
        <CardHeader />
        <PostContent />
        <PostReaction />
      </article>
    </>
  );
}
