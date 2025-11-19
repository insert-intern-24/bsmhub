import React from 'react';
import { Caption } from '@/app/components/shared/system/text';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  return (
    <div className={`px-3 py-1 rounded-3xl bg-[#F1FFF0] text-[#086100] ${className}`}>
      <Caption>{status}</Caption>
    </div>
  );
};

export default StatusBadge;