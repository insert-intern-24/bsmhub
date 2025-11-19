import React from 'react';
import { IconLink } from '@tabler/icons-react';
import { ItemProps } from '@/app/components/portfolio/types';

const ProfileItem = ({ mode, value, url, prize }: ItemProps) => {
  const Content = (
    <div className="max-w-fit text-gray-base flex-center gap-0.5 text-sm font-normal">
      {mode === 'link' && <IconLink width={10} height={10} />}
      {value ?? url}
      {` ${prize ?? ''}`}
    </div>
  );

  return url ? (
    <a
      href={url}
      target="_blank"
      className="outline-none border-none inline-flex max-w-fit"
      rel="noopener noreferrer nofollow"
    >
      {Content}
    </a>
  ) : (
    Content
  );
};

export default ProfileItem;

