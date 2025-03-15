import React from 'react';
import ProjectItem from '@components/ProjectItem';
import { StatusTag } from '@models/project'; // Import StatusTag enum
import { UserDataType } from '@models/user';

const ProjectItems = ({ projects }: Pick<UserDataType, 'projects'>) => {
  return (
    <>
      <div className="grid grid-cols-4 gap-5 w-full min-h-[56.9rem]">
        {projects.map((project) => (
          <ProjectItem
            key={project.project_id}
            tag={StatusTag[project.status]}
            category={project.category_id.category_name}
            title={project.project_name}
            description={project.description}
          />
        ))}
      </div>
    </>
  );
};

export default ProjectItems;
