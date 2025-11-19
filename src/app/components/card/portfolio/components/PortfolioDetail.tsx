import ProfileItem from '@/app/components/feature/portfolio/ProfileItem';
import { Label } from '@/app/components/ui/text/text';
import SkillTagProvider from '@/app/components/ui/tag/SkillTagProvider';

import {
  PortfolioDetailProps as PortfolioDetailType,
  ItemProps,
} from '@/app/(box-layout)/portfolio/types';

const modeTextMap: Record<ItemProps['mode'] | 'skill', string> = {
  link: '링크',
  certificate: '자격증',
  competition: '수상이력',
  skill: '기술스택',
};

interface PortfolioDetailProps {
  details: PortfolioDetailType[];
}

const PortfolioDetail = ({ details }: PortfolioDetailProps) => {
  return (
    <div className="p-4 bg-light-gray-outline rounded-lg flex-col gap-10">
      {details.map(({ mode, datas }) => {
        const hasData = datas.length > 0;
        const skillIds =
          mode === 'skill'
            ? datas
                .map((data) => ('skillId' in data ? data.skillId : undefined))
                .filter((id): id is number => id !== undefined)
            : [];

        return (
        <div key={mode}>
          <Label>{modeTextMap[mode]}</Label>
          {mode === 'skill' ? (
              skillIds.length > 0 ? (
            <SkillTagProvider
              readOnly
              white
                  initialTags={skillIds}
            />
          ) : (
                <Label className="text-detail !block">등록된 정보가 없습니다.</Label>
              )
            ) : hasData ? (
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
            ) : (
              <Label className="text-detail !block">등록된 정보가 없습니다.</Label>
          )}
        </div>
        );
      })}
    </div>
  );
};

export default PortfolioDetail;
