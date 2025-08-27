import React from 'react';
import { IconPlus } from '@tabler/icons-react';

function AddButton() {
  return (
    <>
      <div className="flex p-6 items-start gap-6 self-stretch rounded-2xl bg-light-gray-outline">
        <div className="flex items-center gap-1 self-stretch">
          <IconPlus size={14} stroke={2} color="gray" />
          <span className="text-gray-base text-sm font-normal leading-5 tracking-wider">
            추가하기
          </span>
        </div>
      </div>
    </>
  );
}

export default AddButton;
