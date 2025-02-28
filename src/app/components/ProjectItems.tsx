import React from 'react'
import ProjectItem from '@components/ProjectItem';
import { StatusTag } from '@models/project'; // Import StatusTag enum
import { UserDataType } from '@models/user';

const ProjectItems = ({ projects, categories }: Pick<UserDataType, 'projects' | 'categories'>) => {
  return (
    <>
      {projects.map((project) => (
        <ProjectItem
          key={project.project_id}
          tag={StatusTag[project.status]}
          category={
            categories.find(
              (c) => c.category_id === project.category_id,
            )?.category_name || ''
          }
          title={project.project_name}
          description={project.description}
        />
      ))}
    </>
  )
}

export default ProjectItems