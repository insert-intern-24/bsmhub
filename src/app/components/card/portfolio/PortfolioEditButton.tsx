'use client';

import { IconPencil } from '@tabler/icons-react';
import InputOfModal from '../../modal/inputs/InputOfModal';
import { profileConfig } from '@/services/config/profileConfig';
import { useModal } from '../../modal';

export default function PortfolioEditButton() {
  const { openModal, closeModal } = useModal();
  return (
    <button
      className="rounded-3xl h-10 flex justify-center items-center gap-4 bg-black text-white"
      onClick={() =>
        openModal(
          <InputOfModal
            title="프로필 설정"
            config={profileConfig}
            onSubmit={() => closeModal()}
          />,
        )
      }
    >
      <IconPencil size={12}></IconPencil>
      Edit
    </button>
  );
}
