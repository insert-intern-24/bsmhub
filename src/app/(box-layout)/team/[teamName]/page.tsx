import Team from '../Team';

interface TeamProps {
  params: Promise<{ teamName: string }>;
}

const TeamPage = async ({ params }: TeamProps) => {
  const teamName = (await params).teamName;

  return <Team teamName={decodeURIComponent(teamName)} />;
};

export default TeamPage;
