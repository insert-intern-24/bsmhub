import Image from 'next/image';
import { Body, Label, Label2 } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from '../types';
import { FALLBACK_PROFILE } from './styles';
import Link from 'next/link';

interface TeamMemberItemProps {
  member: ProjectDetailViewModel['team'][number];
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => (
  <article className="flex-row items-center gap-[0.375rem]">
    <Link href={`/portfolio/${member.name}`} className="cursor-pointer">
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image
          src={member.profileImage || FALLBACK_PROFILE}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
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

interface ProjectTeamSectionProps {
  members: ProjectDetailViewModel['team'];
  isExpanded: boolean;
  shouldFold: boolean;
  onExpand: () => void;
}

export const ProjectTeamSection = ({ 
  members, 
  isExpanded, 
  shouldFold, 
  onExpand 
}: ProjectTeamSectionProps) => {
  return (
    <section className="project-team-section relative flex-col gap-[0.375rem]">
      <Label>기여</Label>
      <div className="relative">
        <div 
          className={`project-team-content flex-col gap-[0.5rem] ${
            shouldFold && !isExpanded ? 'foldable' : 'expanded'
          }`}
        >
          {members.length > 0 ? (
            members.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Label className="text-detail">참여자 정보가 없습니다.</Label>
          )}
        </div>
        {shouldFold && !isExpanded && (
          <button
            type="button"
            className="project-team-expand-button"
            onClick={onExpand}
          >
            <Body className="text-gray-base">더보기</Body>
          </button>
        )}
      </div>
    </section>
  );
};
