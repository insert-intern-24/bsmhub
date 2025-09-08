'use client';
import React from 'react';
import { IconPencil, IconCheck, IconSearch } from '@tabler/icons-react';
import { BaseInputProps } from '../types/inputTypes';
import Image from 'next/image';
import Calendar from '@public/icon/calendar.svg';

function Inputs({
  type = 'text',
  placeholder = 'Placeholder',
  value,
  onChange,
  name,
  required = false,
  id = '',
}: BaseInputProps) {
  const getInputType = () => {
    if (type === 'date') return 'date';
    if (type === 'search') return 'search';
    return 'text';
  };

  const renderIcon = () => {
    switch (type) {
      case 'lock':
        return <IconPencil size={20} className="text-gray-500" />;
      case 'edit':
        return <IconCheck size={20} className="text-gray-500" />;
      case 'search':
        return <IconSearch size={20} className="text-gray-500" />;
      case 'date':
        return (
          <Image
            src={Calendar}
            width={20}
            height={20}
            alt="Calendar"
            className="text-gray-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={getInputType()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        readOnly={type === 'lock'}
        className={`w-full h-[3.3125rem] py-1 ${
          ['lock', 'edit', 'search', 'date'].includes(type) ? 'pr-10' : 'px-2.5'
        } pl-2.5 rounded-md text-gray-base text-base font-normal leading-6 tracking-[0.0057rem] ${
          type !== 'lock' ? 'bg-light-gray-outline' : ''
        } ${type === 'date' ? 'date-input' : ''}`}
      />
      {renderIcon() && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {renderIcon()}
        </div>
      )}

      <style jsx>{`
        .date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 28px;
          height: 28px;
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
        .date-input::-webkit-datetime-edit {
          padding-right: 30px;
        }
      `}</style>
    </div>
  );
}

export default Inputs;
