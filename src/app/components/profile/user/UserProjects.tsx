import { UserDataType } from '@models/user';
import ProjectItem from '@components/ProjectItem';
import { StatusTag } from '@models/project';

type TabNamesType = '전체' | '개인' | '협업';
const tabNames: TabNamesType[] = ['전체', '개인', '협업'];

const UserProjects = ({ userData }: { userData: UserDataType }) => {
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
        {userData?.projects.map((project) => (
          <ProjectItem
            key={project.project_id}
            tag={StatusTag[project.status]}
            category={project.category_id.category_name}
            title={project.project_name}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default UserProjects;
