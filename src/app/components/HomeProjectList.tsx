'use client';

import React, { useState, useMemo } from 'react';
import CategoryTag from '@/app/components/contents/CategoryTag';
import { CardProps } from '@/app/components/card/project/ProjectCard';
import ProjectGrid from '@/app/components/project/components/ProjectGrid';
import { shuffleArray } from '@/utils/shuffle';

interface HomeProjectListProps {
  projects: CardProps[];
}

export default function HomeProjectList({ projects }: HomeProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>(
    'All',
  );
  const shuffledProjects = useMemo(() => shuffleArray(projects), [projects]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    projects.forEach((project) => {
      if (project.category) {
        uniqueCategories.add(project.category);
      }
    });

    return ['All', ...Array.from(uniqueCategories)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return selectedCategory === 'All'
      ? shuffledProjects
      : shuffledProjects.filter(
          (project) => project.category === selectedCategory,
        );
  }, [shuffledProjects, selectedCategory]);

  return (
    <div className="flex-col gap-[0.90625rem] w-full">
      {/* 카테고리 토글 버튼들 */}
      <div className="flex justify-center">
        <div className="flex-wrap gap-0 w-fit">
          {categories.map((category) => (
            <CategoryTag
              key={category}
              category={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* 프로젝트 그리드 */}
      <ProjectGrid projects={filteredProjects} />
    </div>
  );
}
