import ContestElement from '@components/shared/ContestElement';

const ContestElements = [
	{
		contestTitle: '상반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
	{
		contestTitle: '하반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
	{
		contestTitle: '상반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
	{
		contestTitle: '하반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
	{
		contestTitle: '상반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
	{
		contestTitle: '하반기 AI캠프 해커톤',
		contestStartDate: '2024.10.28(월)',
		contestEndDate: '2024.11.29(화)',
	},
];

function ContestPage() {
	return (
		<div className="flex flex-wrap gap-5">
			{ContestElements.map((contest, key) => (
				<ContestElement
					key={key}
					contestTitle={contest.contestTitle}
					contestStartDate={contest.contestStartDate}
					contestEndDate={contest.contestEndDate}
				/>
			))}
		</div>
	);
}

export default ContestPage;
