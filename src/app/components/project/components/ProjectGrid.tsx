'use client';

import { CardProps } from '@/app/components/card/project/ProjectCard';
import Card from '@/app/components/card/project/ProjectCard';
import type { TeamProjectType } from '@/app/(box-layout)/team/types';
import { convertFromDatabaseImageURL } from '@/services/supabase/imageHostConverter';

interface ProjectGridProps {
  projects: CardProps[] | TeamProjectType[];
  className?: string;
  isTeamProject?: boolean;
}

const ProjectGrid = ({
  projects,
  className,
  isTeamProject = false,
}: ProjectGridProps) => {
  const transformedProjects: CardProps[] = projects.map((project) => {
    if (isTeamProject) {
      // TeamProjectType 변환
      const teamProject = project as TeamProjectType;
      return {
        id: teamProject.project_id,
        title: teamProject.project_name,
        description: teamProject.description,
        projectImage: convertFromDatabaseImageURL(
          teamProject.project_thumbnail,
        ),
        ownerName: teamProject.profile.profile_name,
        ownerProfileImage: teamProject.profile.profile_image
          ? convertFromDatabaseImageURL(teamProject.profile.profile_image)
          : undefined,
        isTeam: teamProject.profile.is_team,
        authors: teamProject.project_contributors.map((contributor) => ({
          name: contributor.profile.profile_name,
          profileImage: convertFromDatabaseImageURL(
            contributor.profile.profile_image,
          ),
        })),
      };
    } else {
      // CardProps 형식 그대로 사용
      return project as CardProps;
    }
  });

  return (
    <div className={`grid gap-6 grid-cols-auto-fit-card ${className}`}>
      {transformedProjects.map((data) => (
        <Card
          key={data.id}
          id={data.id}
          title={data.title}
          description={data.description}
          projectImage={data.projectImage}
          ownerName={data.ownerName}
          isTeam={data.isTeam}
          authors={data.authors}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
