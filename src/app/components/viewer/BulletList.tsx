import React from 'react';
import Link from 'next/link';
import { Body } from '@/app/components/ui/text/text';

export interface BulletListItem {
  text: string;
  href?: string;
}

interface BulletListProps {
  items: BulletListItem[];
}

const BulletList = ({ items }: BulletListProps) => {

  return (
    <ul className="list-bullet-square">
      {items.map((item, index) => {
        const className = `text-black ${item.href ? 'hover:underline cursor-pointer' : ''}`;
        const content = <Body className={className}>{item.text}</Body>;

        return (
          <li key={index}>
            {item.href ? <Link href={item.href} className="block">{content}</Link> : content}
          </li>
        );
      })}
    </ul>
  );
};

export default BulletList;

