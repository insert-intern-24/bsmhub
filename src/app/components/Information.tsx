import React from 'react';

function Information({ name, value }: { name: string; value: string | number | undefined | null}) {
  return (
    <div className="flex justify-between">
      <span className="text-detailColor">{value !== undefined ? name:null}</span>
      <span>{value ?? null}</span>
    </div>
  );
}

export default Information;
