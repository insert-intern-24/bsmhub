'use client';

import React, { useState } from 'react';
import { Title, Body } from '@/app/components/ui/text/text';
import Checkbox from '@/app/components/ui/input/Checkbox';
import Button from '@/app/components/ui/button/Button';

interface DeleteConfirmModalProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  title = '정말 삭제하시겠습니까?',
  message = '이 작업은 되돌릴 수 없습니다. 삭제를 진행하려면 아래 체크박스를 선택해주세요.',
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="flex-col items-start w-[32rem] p-[2rem] gap-6 bg-white border-0 outline-none">
      <Title className="mb-3">{title}</Title>

      <Body className="mb-4 text-gray-700">
        {message}
      </Body>

      <div className="w-full mb-6">
        <Checkbox
          checked={isConfirmed}
          onChange={setIsConfirmed}
          label="위 내용을 확인했으며, 삭제에 동의합니다."
        />
      </div>

      <div className="flex gap-3 w-full">
        <div className="flex-1">
          <Button
            color="gray"
            text="취소"
            onClick={onCancel}
          />
        </div>
        <div className="flex-1">
          <Button
            color="black"
            text="삭제"
            onClick={() => {
              if (isConfirmed) {
                onConfirm();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
