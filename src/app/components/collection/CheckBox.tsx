'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import checked from '@public/images/symbol/checked.svg';
import unChecked from '@public/images/symbol/unchecked.svg';

export interface CheckBoxProps {
  label: string;
  name: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ label, name }) => {
  const [checkedState, setCheckedState] = useState(false);

  return (
    <div
      className="flex gap-4 items-center cursor-pointer"
      onClick={() => setCheckedState((prev) => !prev)}
    >
      <Image
        src={checkedState ? checked : unChecked}
        alt={checkedState ? '체크된 체크박스' : '체크되지 않은 체크박스'}
        width={(20 * 12) / 16}
        height={(20 * 12) / 16}
      />
      <span className="text-base">{label}</span>
      <input type="hidden" name={name} value={checkedState ? 'on' : ''} />
    </div>
  );
};

export default CheckBox;
