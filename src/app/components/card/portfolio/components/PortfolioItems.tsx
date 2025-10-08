import ProfileItem from '@/app/components/contents/ProfileItem';
import SkillTag from '@/app/components/contents/SkillTag';
import { Label } from '@/app/components/system/text';

import { PortfolioItemsProps } from '@/types/portfolio';
import { ItemProps } from '@/types/portfolio';

const modeTextMap: Record<ItemProps['mode'] | 'skill', string> = {
  link: '링크',
  certificate: '자격증',
  competition: '수상이력',
  skill: '기술스택',
};

interface PortfolioItemDataProps {
  items: PortfolioItemsProps[];
}

const PortfolioItems = ({ items }: PortfolioItemDataProps) => {
  return (
    <div className="p-4 bg-light-gray-outline rounded-lg flex-col gap-10">
      {items.map(({ mode, datas }) => (
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
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PortfolioItems;
