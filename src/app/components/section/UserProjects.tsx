import ProjectItem from '@components/ProjectItem';

type TabNamesType = '전체' | '개인' | '협업';
const tabNames: TabNamesType[] = ['전체', '개인', '협업'];

const UserHome = () => {
	return (
		<div>
			<div className="flex gap-[0.6rem] mb-2">
				<select name="tab" id="tab" className="text-descriptionColor font-bold text-2xl mt-2">
					{tabNames.map((data: TabNamesType, index) => {
						return (
							<option key={index} value={data}>
								{data}
							</option>
						);
					})}
				</select>
			</div>
			<div className="flex gap-[0.7rem] flex-wrap">
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
				<ProjectItem
					tag="개발완료"
					category="Desktop Utility"
					title="SANDDOET-App"
					description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!"
				/>
			</div>
		</div>
	);
};

export default UserHome;
