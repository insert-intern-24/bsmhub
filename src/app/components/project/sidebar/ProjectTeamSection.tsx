import { Label, Label2 } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from '@/services/project/types';
import Link from 'next/link';
import ProfileImage from '@/app/components/card/portfolio/components/ProfileImage';

interface TeamMemberItemProps {
  member: ProjectDetailViewModel['team'][number];
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => {
  return (
    <article className="flex-row items-center gap-[0.375rem]">
      <Link href={`/portfolio/${member.name}`} className="cursor-pointer">
        <ProfileImage
          src={member.profileImage}
          name={member.name}
          size={{ width: 40, height: 40 }}
          shape="circle"
        />
      </Link>
    <div className="flex-col">
      <Link
        href={`/portfolio/${member.name}`}
        className="cursor-pointer hover:underline"
      >
        <Label2 className="font-semibold">{member.name}</Label2>
      </Link>
      <Label className="text-gray-base">{member.role}</Label>
      </div>
    </article>
  );
};

interface ProjectTeamSectionProps {
  members: ProjectDetailViewModel['team'];
}

export const ProjectTeamSection = ({ 
  members
}: ProjectTeamSectionProps) => {
  return (
    <section className="project-team-section relative flex-col gap-[0.375rem]">
      <Label>기여</Label>
      <div className="relative">
        <div className="project-team-content flex-col gap-2">
          {members.length > 0 ? (
            members.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Label className="text-detail">참여자 정보가 없습니다.</Label>
          )}
        </div>
      </div>
    </section>
  );
};
