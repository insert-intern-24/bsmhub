'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';
import Inputs from '../components/modal/inputs/SingleInput';
import InfinitePagination from './[project_name]/components/pagination/Pagination';
import Tabs from './[project_name]/components/tabs/ProjectTab';
import Card, { CardProps } from '../components/card/project/ProjectCard';

interface ProjectClientProps {
  initialProjects: CardProps[];
}

export default function ProjectClient({ initialProjects }: ProjectClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return initialProjects;

    return initialProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ownerName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [initialProjects, searchTerm]);

  // 페이지네이션 함수
  const fetchProjects = async ({ pageParam }: { pageParam: number }) => {
    const limit = 8;
    const startIndex = (pageParam - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredProjects.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredProjects.length / limit),
      currentPage: pageParam,
      hasNextPage: pageParam < Math.ceil(filteredProjects.length / limit),
    };
  };

  return (
    <div className="flex min-w-[20.625rem] py-9 px-11 items-start flex-1 shrink-0 self-stretch bg-white">
      <div className="flex flex-col items-start gap-6 flex-1 shrink-0">
        <Inputs
          type="text"
          icon="search"
          placeholder="Search"
          onChange={handleSearchChange}
        />
        <Tabs />

        <InfinitePagination<CardProps>
          queryKey={['projects', searchTerm]}
          queryFn={fetchProjects}
          enabled={true}
          renderItem={(project) => (
            <Card
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              projectImage={project.projectImage}
              ownerName={project.ownerName}
              isTeam={project.isTeam}
              category={project.category}
              authors={project.authors}
            />
          )}
        />
      </div>
    </div>
  );
}
