import Image from 'next/image';

interface ContestItemProps {
	title: string;
	startDate: string;
	endDate: string;
}

function ContestItem({ title, startDate, endDate }: ContestItemProps) {
	return (
		<div className="w-[21.0625rem] h-fit border-solid border-[#E8E8EF] border-[1px] rounded-[5px]">
			<Image src="/images/contest/Project.png" alt="contest1" width={340} height={200} />
			<div className="w-full h-20 flex flex-col justify-center mx-3">
				<div className="text-titleColor text-[1rem] font-semibold leading-5">{title}</div>
				<div className="text-detailColor text-[0.75rem] leading-4">
					{startDate} ~ {endDate}
				</div>
			</div>
		</div>
	);
}

export default ContestItem;
