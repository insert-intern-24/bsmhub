import React from 'react';

interface DescriptionProps {
  value: string;
}

const Description: React.FC<DescriptionProps> = ({ value }) => {
  return (
    <p className='text-base text-descriptionColor w-full'>{value}</p>
  );
};

export default Description;