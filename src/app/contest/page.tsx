import ContestItem from '@components/shared/ContestItem';

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
		<>
			<div className="flex flex-wrap gap-5">
				{ContestItems.map((contest, key) => (
					<ContestItem key={key} title={contest.title} startDate={contest.startDate} endDate={contest.endDate} />
				))}
			</div>
		</>
	);
}

export default ContestPage;
