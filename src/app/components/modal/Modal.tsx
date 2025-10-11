'use client';

import { useEffect } from 'react';
import { useModal } from './ModalContext';

export const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModal();

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">{modalContent}</div>
      </div>
    </div>
  );
};
