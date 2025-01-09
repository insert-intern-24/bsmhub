import React from 'react';
import CommentHeader from './header/CommentHeader';
import CommentText from './content/CommentText';
import CommentReaction from './reaction/CommentReaction';
import { serialize } from 'next-mdx-remote/serialize';

interface DefaultFeedProps {
  name: string;
  time: string;
  profileImage: string;
  text: string;
}

export default async function DefaultFeed({
  name,
  time,
  profileImage,
  text,
}: DefaultFeedProps) {
  const mdxSource = await serialize(text);
  return (
    <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
      <CommentHeader name={name} time={time} profileImage={profileImage} />
      <CommentText mdxSource={mdxSource} text={text} />
      <CommentReaction />
    </article>
  );
}
