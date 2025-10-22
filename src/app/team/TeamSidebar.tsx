import ProfileItem from '../components/contents/ProfileItem';
import TeamLabel from '../components/contents/TeamLabel';
import { Body, Label, TitleEN } from '../components/system/text';
import { TeamData } from './types';

const TeamSidebar = ({ teamDetail }: { teamDetail: TeamData }) => {
  return (
    <aside
      className="pt-[4.5rem] w-[21.75rem] min-h-[40rem] 
        pr-[2.6rem] border-r-[1px] border-light-gray-outline
        flex-col gap-[1.6rem]
      "
    >
      <div>
        <TitleEN className="mobile:mb-2">{teamDetail?.profile_name}</TitleEN>
        <Body className="text-gray-base flex-col justify-end">
          {teamDetail?.description}
        </Body>
      </div>
      <hr className="border-light-gray-outline" />
      <div className="flex-col gap-2.5">
        <TeamLabel mode="project" value={12} />
        <TeamLabel mode="founding" value={2020} />
      </div>
      <hr className="border-light-gray-outline" />
      <div className="flex-col gap-1">
        <Label className="mb-1.5">링크</Label>
        <ProfileItem mode="link" value={null} url="https://team-found.tech" />
        <ProfileItem mode="link" value={null} url="https://team-found.tech" />
      </div>
      <hr className="border-light-gray-outline" />
    </aside>
  );
};

export default TeamSidebar;
