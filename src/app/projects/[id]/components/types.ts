import projectsData from '@/data/dummy-projects.json';

export type Project = (typeof projectsData)[number];
export type TeamMember = Project['team'][number];
