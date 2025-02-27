import { userDataType } from '@/app/models/user';
import ProjectItem from '@components/ProjectItem';

type TabNamesType = '전체' | '개인' | '협업';
const tabNames: TabNamesType[] = ['전체', '개인', '협업'];

const UserHome = ({ userData }: { userData: userDataType}) => {
  const StatusTag: Record<number, string> = {
    1: "개발중",
    2: "서비스 중",
    3: "개발완료",
    4: "기획중"
  }

  return (
    <div className="p-4">
      <div className="flex gap-[0.6rem] mb-2">
        <select
          name="tab"
          id="tab"
          className="text-descriptionColor font-bold text-2xl mt-2 w-full md:w-auto"
        >
          {tabNames.map((data: TabNamesType, index) => {
            return (
              <option key={index} value={data}>
                {data}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex gap-[1.25rem] flex-wrap">
        {userData?.projects.map(project => (
          <ProjectItem
            key={project.project_id}
            tag={StatusTag[project.status]}
            category={userData.categories.find(c => c.category_id === project.category_id)?.category_name || ''}
            title={project.project_name} 
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default UserHome;
