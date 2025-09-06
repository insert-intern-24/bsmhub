import React from 'react';
import { IconPlus } from '@tabler/icons-react';

const ProjectAddCard = () => {
  return (
    <div className="w-[21rem] h-[13.4375rem] rounded-[0.25rem] bg-light-gray-outline flex items-center justify-center">
      <div className="flex-col flex-center gap-2">
        <IconPlus size={(76 * 12) / 16} color="#EAEAEC" />
      </div>
    </div>
  );
};

export default ProjectAddCard;
