import { Label } from '@/app/components/ui/text/text';

interface ProjectLinkSectionProps {
  links: Array<{ url: string; title: string | null }>;
}

export const ProjectLinkSection = ({
  links,
}: ProjectLinkSectionProps) => {
  const filteredLinks = links.filter((link) => link.title !== '/play');

  return (
    <section className="flex-col gap-[0.375rem]">
      <Label>링크</Label>
      {filteredLinks.length > 0 ? (
        <div className="flex-col gap-2">
          {filteredLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-detail cursor-pointer hover:underline"
            >
              <Label className="text-detail">{link.title || link.url}</Label>
            </a>
          ))}
        </div>
      ) : (
        <Label className="text-detail !block">등록된 정보가 없습니다.</Label>
      )}
    </section>
  );
};
