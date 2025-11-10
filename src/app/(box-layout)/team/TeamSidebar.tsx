import Image from 'next/image';
import ProfileItem from '@/app/components/contents/ProfileItem';
import TeamLabel from '@/app/components/contents/TeamLabel';
import { Body, Label, TitleEN } from '@/app/components/system/text';
import { TeamData } from './types';
import { convertFromDatabaseImageURL } from '@/utils/supabase/imageHostConverter';
import { getFoundedYear } from '@/utils/date';
import getMyAccount from '@/services/server/auth/getMyAccount';
import TeamProfileEditButton from '@/app/components/card/portfolio/TeamProfileEditButton';

interface TeamSidebarProps {
  teamDetail: TeamData;
  projectCount: number;
}

const TeamSidebar = async ({ teamDetail, projectCount }: TeamSidebarProps) => {
  const currentSession = await getMyAccount();
  return (
    <aside
      className="pt-[4.5rem] w-[21.75rem] min-w-[21.75rem] min-h-[50rem] 
        flex-col gap-[1.6rem] responsive-teamSidebar"
    >
      <div className="flex-col gap-[0.375rem]">
        <TitleEN className="mobile:mb-2">{teamDetail?.profile_name}</TitleEN>
        <Body className="text-detail flex-col justify-end">
          {teamDetail?.description}
        </Body>
        {currentSession?.id == teamDetail?.owner && (
          <TeamProfileEditButton
            profileId={teamDetail?.profile_id || ''}
            profileName={teamDetail?.profile_name}
          />
        )}
      </div>
      <hr className="border-light-gray-outline" />
      <div className="flex-col gap-2.5">
        <TeamLabel mode="project" value={projectCount} />
        <TeamLabel
          mode="founding"
          value={getFoundedYear(teamDetail?.created_at)}
        />
      </div>
      <hr className="border-light-gray-outline" />
      <div className="flex-col gap-1">
        <Label className="mb-1.5">링크</Label>
        {teamDetail?.profile_link.map((link) => (
          <ProfileItem
            key={link.link}
            mode="link"
            url={link.link}
            value={link.alt}
          />
        ))}
      </div>
      <hr className="border-light-gray-outline" />
      <div className="flex-col gap-1">
        <Label className="mb-1.5">팀원</Label>
        <div className="flex flex-wrap gap-2">
          {teamDetail?.team_member.map((member) => (
            <Image
              key={member.profile.profile_id}
              src={convertFromDatabaseImageURL(member.profile.profile_image)}
              alt="팀원 프로필 사진"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default TeamSidebar;
