import Team from '../Team';

interface TeamProps {
  params: Promise<{ teamName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TeamPage = async ({ params, searchParams }: TeamProps) => {
  const teamName = (await params).teamName;
  const searchParamsData = await searchParams;
  const path = (searchParamsData.path as 'home' | 'project') ?? 'home';

  return <Team teamName={decodeURIComponent(teamName)} path={path} />;
};

export default TeamPage;
