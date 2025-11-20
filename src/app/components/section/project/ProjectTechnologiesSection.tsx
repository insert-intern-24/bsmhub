import { Label } from '@/app/components/ui/text/text';
import SkillTagProvider from '@/app/components/ui/tag/SkillTagProvider';

interface ProjectTechnologiesSectionProps {
  technologies: number[];
}

export const ProjectTechnologiesSection = ({
  technologies,
}: ProjectTechnologiesSectionProps) => (
  <section className="flex-col gap-[0.375rem]">
    <Label>기술스택</Label>
    {technologies.length > 0 ? (
      <SkillTagProvider readOnly initialTags={technologies} />
    ) : (
      <Label className="text-detail !block">등록된 정보가 없습니다.</Label>
    )}
  </section>
);
