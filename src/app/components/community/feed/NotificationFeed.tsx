import React from 'react';
import CardHeader from '@components/community/feed/header/CardHeader';
import PostContent from './content/PostContent';
import PostReaction from './reaction/PostReaction';

interface NotificationFeedProps {
  profileName: string;
  projectStatus: string;
  time: Date;
  profileImage: string;
  projectName: string;
  projectDescription: string;
  contentImages: string[];
}

export default function NotificationFeed({
  profileName,
  projectStatus,
  time,
  profileImage,
  projectName,
  projectDescription,
  contentImages,
}: NotificationFeedProps) {
  return (
    <>
      <article className="flex w-full p-4 flex-col items-start gap-4 rounded-3xl bg-white">
        <CardHeader
          profileName={profileName}
          projectStatus={projectStatus}
          time={time.toString()}
        />
        <PostContent
          profileImage={profileImage}
          projectName={projectName}
          projectDescription={projectDescription}
          contentImages={contentImages}
        />
        <PostReaction />
      </article>
    </>
  );
}
