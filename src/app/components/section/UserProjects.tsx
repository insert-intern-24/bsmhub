import React,{useState} from 'react';
import ProjectItem from '@components/ProjectItem';

const TabNames = ["전체","개인","협업"];

const UserHome = () => {
  const [tabName, setTabName] = useState<"전체"|"개인"|"협업">("전체");

	return (
		<div>
      <div className='flex gap-[0.6rem] mb-2'>
        {
          TabNames.map((data,index)=>{
            return <button key={index} className={`text-${tabName === data ? "titleColor" : "descriptionColor"} font-bold text-2xl mt-2`} onClick={()=>setTabName(data)}>{data}</button>
          })
        }
      </div>
			<div className="flex gap-[0.7rem] flex-wrap">
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
				<ProjectItem tag="개발완료" category="Desktop Utility" title="SANDDOET-App" description="산뜻 - AI 추천 RSS로 정보 습득이 쉬워지는 순간!" />
			</div>
		</div>
	);
};

export default UserHome;
