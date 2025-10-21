'use client';

import React, { useState, useMemo } from 'react';
import ProjectCard from '@/app/components/card/project/ProjectCard';
import CategoryTag from '@/app/components/contents/CategoryTag';
import { CardProps } from '@/app/components/card/project/ProjectCard';

interface ProjectListProps {
  projects: CardProps[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    projects.forEach((project) => {
      if (project.category) {
        uniqueCategories.add(project.category);
      }
    });

    return ['전체', ...Array.from(uniqueCategories)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return selectedCategory === '전체'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div className="flex-col gap-6">
      {/* 카테고리 토글 버튼들 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <CategoryTag
            key={category}
            category={category}
            isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {/* 프로젝트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            projectImage={project.projectImage}
            authors={project.authors}
          />
        ))}
      </div>
    </div>
  );
}
