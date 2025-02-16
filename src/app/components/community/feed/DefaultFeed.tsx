import React from 'react';
import CommentHeader from './header/CommentHeader';
import CommentText from './content/CommentText';
import CommentReaction from './reaction/CommentReaction';
import { serialize } from 'next-mdx-remote/serialize';
import { createClient } from '@/utils/supabase/server';

interface DefaultFeedProps {
  profile_id: string;
  time: string;
  text: string;
}

export default async function DefaultFeed({
  profile_id,
  time,
  text,
}: DefaultFeedProps) {
  const supabase = await createClient();
  const [communityProfile] = await Promise.all([
    supabase
      .schema('community')
      .from('profile')
      .select('*')
      .eq('profile_id', profile_id),
  ]);
  console.log(communityProfile);
  const mdxSource = await serialize(text);
  return (
    <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
      <CommentHeader
        name={communityProfile.data && communityProfile.data[0]?.profile_name}
        time={time}
        profileImage={
          communityProfile.data && communityProfile.data[0]?.profile
        }
      />
      <CommentText mdxSource={mdxSource} text={text} />
      <CommentReaction />
    </article>
  );
}
