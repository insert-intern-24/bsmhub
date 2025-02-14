import type { Content, Detail as DetailType } from '@models/collection.d.ts';

interface DetailProps extends Content {
  edit?: boolean;
  symbol?: DetailType["symbol"]
}

const symbolName = {
  license: "id_card",
  link: "link",
  prize: "emoji_events",
};

function Detail({symbol=null, value, certified=false, address=null }: DetailProps) {
  return (
    <div className={`w-full flex text-detailColor justify-between select-none`}>
      <div className="flex items-center gap-1">
        {/* symbol이 있을 경우 아이콘을 렌더링 */}
        {!!symbol && (
          <i className="material-symbols-outlined text-xs">
            {symbolName[symbol as keyof typeof symbolName]}
          </i>
        )}

        {/* 텍스트 넣는 곳이 여기에요~~ */}
        {symbol === "link" && address ? (
          <a href={address}>{value}</a>
        ) : (
          <span className="text-14px">{value}</span>
        )}

        {/* symbol이 'license'이고 certified가 true일 경우 인증 아이콘 표시 */}
        {symbol === "license" && certified && (
          <i className="material-symbols-outlined text-[#0D6AD4]">verified</i>
        )}
      </div>
    </div>
  );
}

export default Detail;
