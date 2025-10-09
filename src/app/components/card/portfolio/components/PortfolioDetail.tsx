import ProfileItem from '@/app/components/contents/ProfileItem';
import SkillTag from '@/app/components/contents/SkillTag';
import { Label } from '@/app/components/system/text';

import { PortfolioDetailProps } from '@/app/portfolio/types/portfolio';
import { ItemProps } from '@/app/portfolio/types/portfolio';

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
            <div className="flex flex-wrap gap-2">
              {datas.map(({ value }) => (
                <SkillTag key={value} mode="white" value={value} />
              ))}
            </div>
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
