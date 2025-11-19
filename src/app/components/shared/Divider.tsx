import React from 'react';

interface DividerProps {
  className?: string;
}

const Divider = ({ className = '' }: DividerProps) => {
  return <hr className={`border-light-gray-outline ${className}`} />;
};

export default Divider;

