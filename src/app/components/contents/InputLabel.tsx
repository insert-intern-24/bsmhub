import React from "react";

interface LabelProps {
  required?: boolean
}

const InputLabel = ({ required }: LabelProps) => {
  return (
    <label className='flex gap-1 max-w-fit'>
      <div>Label</div>
      {required && <div className='text-red-500'>*</div>}
    </label>
  )
}

export default InputLabel;