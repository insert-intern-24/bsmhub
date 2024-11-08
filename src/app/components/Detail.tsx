import React from 'react';

interface DetailProps {
  symbol?: "prize" | "link" | "license";
  value: string;
  certified?: boolean;
}

const symbolName = {
  license: "id_card",
  link: "link",
  prize: "emoji_events"
};

const Detail: React.FC<DetailProps> = ({ symbol, value, certified }) => {

  return (
    <div className="flex text-detailColor gap-1 w-full">
      {!!symbol && <i className="material-symbols-outlined text-xs">{symbolName[symbol]}</i>}
      <p className="text-base">{value}</p>
      {certified && <i className="material-symbols-outlined text-[#0D6AD4]">verified</i>}
    </div>
  );
};

export default Detail;
