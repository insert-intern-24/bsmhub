import React from 'react';
import CommentHeader from './header/CommentHeader';
import CommentText from './content/CommentText';
import CommentReaction from './reaction/CommentReaction';

interface DefaultFeedProps {
  name: string;
  time: Date;
  profileImage: string;
  text: string;
}

export default function DefaultFeed({
  name,
  time,
  profileImage,
  text,
}: DefaultFeedProps) {
  return (
    <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
      <CommentHeader
        name={name}
        time={time.toString()}
        profileImage={profileImage}
      />
      <CommentText text={text} />
      <CommentReaction />
    </article>
  );
}
