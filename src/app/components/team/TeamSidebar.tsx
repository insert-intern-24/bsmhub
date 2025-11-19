import ProfileItem from '@/app/components/shared/contents/ProfileItem';
import TeamLabel from '@/app/components/shared/contents/TeamLabel';
import { Body, Label, TitleEN } from '@/app/components/shared/system/text';
import { TeamData } from './types';
import { getFoundedYear } from '@/utils/date';
import getAccount from '@/services/auth/getAccount.server';
import TeamProfileEditButton from '@/app/components/shared/TeamProfileEditButton';
import AvatarImage from '@/app/components/shared/AvatarImage';
import Divider from '@/app/components/shared/Divider';

interface TeamSidebarProps {
  teamDetail: TeamData;
  projectCount: number;
}

const TeamSidebar = async ({ teamDetail, projectCount }: TeamSidebarProps) => {
  const currentSession = await getAccount();
  const isOwner = currentSession?.id === teamDetail?.owner;

  return (
    <div className="w-[21.75rem] min-w-[21.75rem] responsive-teamSidebar">
      {/* Title과 Description - 스크롤됨 */}
      <div className="pt-[4.5rem]">
        <div className="flex-col gap-[0.375rem]">
          <TitleEN className="mobile:mb-2">{teamDetail?.profile_name}</TitleEN>
          <Body className="text-detail flex-col justify-end">
            {teamDetail?.description}
          </Body>
        </div>
      </div>

      {/* Edit 버튼부터 sticky 적용 */}
      <aside className="sticky top-24 mobile:static mt-[1.6rem]">
        <div className="flex-col gap-[1.6rem]">
          {/* Edit 버튼 */}
          {isOwner && (
            <div>
              <TeamProfileEditButton profileId={teamDetail?.profile_id || ''} />
            </div>
          )}

          <Divider />
          <div className="flex-col gap-2.5">
            <TeamLabel mode="project" value={projectCount} />
            <TeamLabel
              mode="founding"
              value={getFoundedYear(teamDetail?.created_at)}
            />
          </div>
          <Divider />
          <div className="flex-col gap-1">
            <Label className="mb-1.5">링크</Label>
            {teamDetail?.profile_link.map((link) => (
              <ProfileItem
                key={link.link}
                mode="link"
                url={link.link}
                value={link.title}
              />
            ))}
          </div>
          <Divider />
          <div className="flex-col gap-1">
            <Label className="mb-1.5">팀원</Label>
            <div className="flex flex-wrap gap-2">
              {teamDetail?.team_member.map((member) => (
                <AvatarImage
                  key={member.profile.profile_id}
                  src={member.profile.profile_image}
                  size={{ width: 32, height: 32 }}
                  shape="circle"
                  name={member.profile.profile_name}
                  canRedirect
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TeamSidebar;

