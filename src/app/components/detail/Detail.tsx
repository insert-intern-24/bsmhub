'use client';
import React, { useState } from 'react';

interface DetailProps {
	value: string;
	edit?: boolean;
	address?: string;
	certified?: boolean;
}

interface DetailLicenseProps extends DetailProps {
	symbol: 'license';
	certified: boolean;
}

interface DetailPrizeProps extends DetailProps {
	symbol: 'prize';
}

interface DetailLinkProps extends DetailProps {
	symbol: 'link';
	address: string;
}

type WholeDetailProps = DetailLicenseProps | DetailPrizeProps | DetailLinkProps;

const symbolName = {
	license: 'id_card',
	link: 'link',
	prize: 'emoji_events',
};

function Detail({ symbol, value, certified, edit, address }: WholeDetailProps) {
	const [isVisible, setIsVisible] = useState(true);
	const toggleVisibility = () => {
		setIsVisible((prevState) => !prevState);
	};

	return (
		<div className={`w-full flex ${isVisible ? 'text-detailColor' : 'text-strokeColor'} justify-between select-none`}>
			<div className="flex items-center gap-1">
				{/* symbol이 있을 경우 아이콘을 렌더링 */}
				{!!symbol && <i className="material-symbols-outlined text-xs">{symbolName[symbol]}</i>}

				{/* 텍스트 넣는 곳이 여기에요~~ */}
				{symbol == 'link' ? <a href={address}>{value}</a> : <span className="text-14px">{value}</span>}

				{/* symbol이 'license'이고 certified가 true일 경우 인증 아이콘 표시 */}
				{symbol === 'license' && certified && <i className="material-symbols-outlined text-[#0D6AD4]">verified</i>}
			</div>

			{/* edit이 true일 때만 편집 아이콘과 삭제 아이콘 표시 */}
			{edit && (
				<div className="flex items-center gap-1">
					<i onClick={toggleVisibility} className="material-symbols-outlined cursor-pointer">
						{isVisible ? 'visibility' : 'visibility_off'}
					</i>

					<i className="material-symbols-outlined cursor-pointer">delete</i>
				</div>
			)}
		</div>
	);
}

export default Detail;
