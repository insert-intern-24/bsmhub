import ContestItem from '@components/layout/ContestItem';

const ContestItems = [
	{
		title: '상반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
	{
		title: '하반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
	{
		title: '상반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
	{
		title: '하반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
	{
		title: '상반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
	{
		title: '하반기 AI캠프 해커톤',
		startDate: '2024.10.28(월)',
		endDate: '2024.11.29(화)',
	},
];

function ContestPage() {
	return (
		<div className="max-w-inner mx-auto">
			<div className="flex flex-wrap gap-[0.7rem]">
				{ContestItems.map((contest, key) => (
					<ContestItem key={key} title={contest.title} startDate={contest.startDate} endDate={contest.endDate} />
				))}
			</div>
		</div>
	);
}

export default ContestPage;
