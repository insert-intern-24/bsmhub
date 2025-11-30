import React from 'react';
import { Body } from '@/app/components/ui/text/text';

export interface BulletListItem {
  text: string;
}

interface BulletListProps {
  items: BulletListItem[];
}

const BulletList = ({ items }: BulletListProps) => {
  return (
    <ul className="list-bullet-square">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={index}>
            <Body
              className={`text-[#2c2e35] text-[13.357px] leading-[16.697px] tracking-[-0.2609px] ${
                !isLast ? 'mb-0' : ''
              }`}
            >
              {item.text}
            </Body>
          </li>
        );
      })}
    </ul>
  );
};

export default BulletList;

