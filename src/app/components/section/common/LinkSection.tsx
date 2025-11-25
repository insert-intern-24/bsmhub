import { Label } from '@/app/components/ui/text/text';
import { IconLink } from '@tabler/icons-react';
import { FormConfig } from '@/app/components/ui/input/types/inputTypes';
import { isExternalLink, normalizeExternalUrl } from '@/utils/link/isExternalLink';

interface LinkSectionProps {
  links: Array<{ url: string; title: string | null }>;
  config: FormConfig;
  fieldName: string;
  /**
   * 필터링할 링크 제목 (예: '/play'는 플레이 버튼으로 표시되므로 제외)
   */
  excludeTitle?: string;
  /**
   * 모든 링크를 외부 링크로 강제 처리 (새 탭에서 열기)
   */
  forceExternal?: boolean;
}

export const LinkSection = ({
  links,
  config,
  fieldName,
  excludeTitle,
  forceExternal = false,
}: LinkSectionProps) => {
  const filteredLinks = excludeTitle
    ? links.filter((link) => link.title !== excludeTitle)
    : links;

  return (
    <section className="flex-col gap-[0.375rem]">
      <Label>링크</Label>
      {filteredLinks.length > 0 ? (
        <div className="flex-col gap-2">
          {filteredLinks.map((link, index) => {
            const isExternal = forceExternal || isExternalLink(link.url, config, fieldName);
            const href = isExternal ? normalizeExternalUrl(link.url) : link.url;

            return (
              <a
                key={index}
                href={href}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
                  : {})}
                className="text-detail cursor-pointer hover:underline flex items-center gap-0.5"
              >
                <IconLink width={10} height={10} className="flex-shrink-0" />
                <Label className="text-detail">{link.title || link.url}</Label>
              </a>
            );
          })}
        </div>
      ) : (
        <Label className="text-detail !block">등록된 정보가 없습니다.</Label>
      )}
    </section>
  );
};

