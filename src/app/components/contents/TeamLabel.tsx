import React from "react";

interface TeamLabelProps {
  mode: 'project' | 'founding'
  value?: number | null
}

const TeamLabel = ({ mode, value }: TeamLabelProps) => {

  return (
    <div className='flex justify-between items-center p-1'> 
      <div className='text-placeholder-gray'>
        {mode === 'project' ? '프로젝트 수 ' : '창립년도'}
      </div>
      <div>
        {value}{mode === 'project' ? '개' : '년'}
      </div>
    </div>
  )
}

export default TeamLabel;