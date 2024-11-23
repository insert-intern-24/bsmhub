import Image from 'next/image';

interface ContestElementProps {
	contestTitle: string;
	contestStartDate: string;
	contestEndDate: string;
}

function ContestElement({ contestTitle, contestStartDate, contestEndDate }: ContestElementProps) {
	return (
		<div className="w-[21.25rem] h-fit border-solid border-[#E8E8EF] border-[1px] rounded-[5px]">
			<Image src="/images/contest/Project.png" alt="contest1" width={340} height={200} />
			<div className="w-full h-20 flex flex-col justify-center mx-3">
				<div className="text-black text-[1rem] font-semibold leading-5">{contestTitle}</div>
				<div className="text-detailColor text-[0.75rem] leading-4">
					{contestStartDate} ~ {contestEndDate}
				</div>
			</div>
		</div>
	);
}

export default ContestElement;
