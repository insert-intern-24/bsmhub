import ProfileItem from '@/app/components/contents/ProfileItem';
import { Label } from '@/app/components/system/text';
import SkillTagProvider from '@/app/components/modal/inputs/SkillTagProvider';

import {
  PortfolioDetailProps,
  ItemProps,
} from '@/app/(box-layout)/portfolio/types';

const modeTextMap: Record<ItemProps['mode'] | 'skill', string> = {
  link: '링크',
  certificate: '자격증',
  competition: '수상이력',
  skill: '기술스택',
};

interface PortfolioDetailDataProps {
  details: PortfolioDetailProps[];
}

const PortfolioDetail = ({ details }: PortfolioDetailDataProps) => {
  return (
    <div className="p-4 bg-light-gray-outline rounded-lg flex-col gap-10">
      {details.map(({ mode, datas }) => (
        <div key={mode}>
          <Label>{modeTextMap[mode]}</Label>
          {mode === 'skill' ? (
            <SkillTagProvider
              readOnly
              white
              initialTags={datas
                .map((data) => ('skillId' in data ? data.skillId : undefined))
                .filter((id): id is number => id !== undefined)}
            />
          ) : (
            <div className="flex-col">
              {datas.map((data, index) => (
                <ProfileItem
                  key={index}
                  mode={mode}
                  value={data.value ?? null}
                  url={'url' in data ? data.url : undefined}
                  prize={'prize' in data ? data.prize : undefined}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PortfolioDetail;
