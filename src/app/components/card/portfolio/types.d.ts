// Shared types for portfolio components
export interface Project {
  title: string;
  description: string;
  logo: string;
  projectImage: string;
}

export interface Profile {
  name: string;
  role: string[];
  bio: string;
  status: string;
  profile_image: string;
}

export interface PortfolioCardProps {
  profile: Profile;
  projects: Project[];
  src?: string;
  isOfficial?: boolean;
  studentName?: string;
}
