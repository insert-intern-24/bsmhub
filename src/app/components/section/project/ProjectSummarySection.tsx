import { Body, TitleEN } from '@/app/components/ui/text/text';

interface ProjectSummarySectionProps {
  title: string;
  description: string;
}

export const ProjectSummarySection = ({
  title,
  description,
}: ProjectSummarySectionProps) => (
  <section className="flex-col w-full gap-[0.375rem]">
    <TitleEN>{title}</TitleEN>
    <Body className="text-detail">{description}</Body>
  </section>
);
