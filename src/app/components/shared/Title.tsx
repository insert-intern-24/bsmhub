import React from 'react';

interface TitleProps {
  value: string;
}

const Title: React.FC<TitleProps> = ({ value }) => {
  return (
    <h6 className='text-2xl text-titleColor w-full'>{value}</h6>
  );
};

export default Title;