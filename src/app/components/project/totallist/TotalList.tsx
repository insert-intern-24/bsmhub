import React from 'react';
import Total from './total/Total';
import Pagination from './pagination/Pagination';
import { Projects, Profiles, Sort, Searchable } from '@/app/models/setSearch';
import ProjectItems from '../../ProjectItems';
import Item from '@components/profile/Item';

export default function TotalList({
  search,
  setSort,
  currentPage,
  setCurrentPage,
  type,
}: {
  search: Searchable[];
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  type: 'project' | 'team' | 'student';
}) {
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch w-full">
        <Total projects={search} setSort={setSort} />

        {type === 'project' ? (
          <ProjectItems
            projects={
              search.slice((currentPage - 1) * 12, currentPage * 12) as Projects
            }
          />
        ) : (
          <Item
            profile={
              search.slice((currentPage - 1) * 12, currentPage * 12) as Profiles
            }
          />
        )}

        <Pagination
          projects={search}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
