import React from 'react';
import Link from 'next/link';
import { IconLink } from '@tabler/icons-react';
import { ItemProps } from '@/app/portfolio/types/portfolio';

const ProfileItem = ({ mode, value, url, prize }: ItemProps) => {
  const Content = (
    <div className="max-w-fit text-gray-base flex-center gap-0.5 text-sm font-normal">
      {mode === 'link' && <IconLink width={10} height={10} />}
      {value ?? url}
      {` ${prize ?? ''}`}
    </div>
  );

  return url ? (
    <Link
      href={url}
      target="_blank"
      className="outline-none border-none inline-flex max-w-fit"
    >
      {Content}
    </Link>
  ) : (
    Content
  );
};

export default ProfileItem;
