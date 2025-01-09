import React from 'react';
import NotificationFeed from './NotificationFeed';
import DefaultFeed from './DefaultFeed';

export default function FeedList() {
  return (
    <>
      <NotificationFeed
        profileName={''}
        projectStatus={''}
        time={undefined}
        profileImage={''}
        projectName={''}
        projectDescription={''}
        contentImages={[]}
      />
      <DefaultFeed name={''} time={undefined} profileImage={''} text={''} />
    </>
  );
}
