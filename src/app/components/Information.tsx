import React from 'react';

function Information({ name, value }: { name: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-detailColor">{name}</span>
      <span>{value}</span>
    </div>
  );
}

export default Information;
