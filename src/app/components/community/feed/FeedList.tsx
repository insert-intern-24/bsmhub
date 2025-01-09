import React from 'react';
import NotificationFeed from './NotificationFeed';
import DefaultFeed from './DefaultFeed';
import { createClient } from '@/utils/supabase/server';

export default async function FeedList() {
  const supabase = await createClient();
  let { data: community_post, error } = await supabase
    .from('community_post')
    .select('*');

  if (error) {
    console.error(error);
    return <div>Error loading posts</div>;
  }

  return (
    <>
      {community_post?.map((post) => (
        <DefaultFeed
          key={post.id}
          name={post.user_id}
          time={post.created_at}
          profileImage={''}
          text={post.context}
        />
      ))}
    </>
  );
}
