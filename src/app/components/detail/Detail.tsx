interface DetailProps {
  value: string;
  edit?: boolean;
  address?: string;
  certified?: boolean;
}

interface DetailLicenseProps extends DetailProps {
  symbol: "license";
  certified: boolean;
}

interface DetailPrizeProps extends DetailProps {
  symbol: "prize";
}

interface DetailLinkProps extends DetailProps {
  symbol: "link";
  address: string;
}

interface DetailNullProps extends DetailProps {
  symbol: null;
}

type WholeDetailProps = DetailLicenseProps | DetailPrizeProps | DetailLinkProps | DetailNullProps;

const symbolName = {
  license: "id_card",
  link: "link",
  prize: "emoji_events",
};

function Detail({ symbol, value, certified, address }: WholeDetailProps) {
  return (
    <div className={`w-full flex text-detailColor justify-between select-none`}>
      <div className="flex items-center gap-1">
        {/* symbol이 있을 경우 아이콘을 렌더링 */}
        {!!symbol && (
          <i className="material-symbols-outlined text-xs">
            {symbolName[symbol]}
          </i>
        )}

        {/* 텍스트 넣는 곳이 여기에요~~ */}
        {symbol == "link" ? (
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
