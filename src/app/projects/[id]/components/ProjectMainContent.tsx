'use client';

import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react';
import Markdown from 'markdown-to-jsx';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import Image from 'next/image';
import { Body } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from './types';
import {
  isYoutubeUrl,
  normalizeYoutubeUrl,
} from '../services/utils/content-utils';

const iframeWrapperClass =
  'relative mb-[0.875rem] w-full overflow-hidden bg-black';

const imageWrapperClass =
  'relative mb-[0.875rem] w-full overflow-hidden bg-black';

const EMBED_ASPECT_RATIO = '16 / 9';

const YOUTUBE_URL_PATTERN =
  /(https?:\/\/(?:www\.)?(?:youtube\.com\/[^\s)]+|youtu\.be\/[^\s)]+))/gi;

type ParagraphProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> & {
  children: ReactNode;
  [key: string]: unknown;
};

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  [key: string]: unknown;
};

type Segment =
  | {
      kind: 'text';
      value: string;
    }
  | {
      kind: 'video';
      url: string;
    };

type YouTubeEmbedProps = {
  url: string;
  title?: string;
};

const YouTubeEmbed = ({ url, title }: YouTubeEmbedProps) => {
  const embedUrl = normalizeYoutubeUrl(url);

  return (
    <div className={iframeWrapperClass} style={{ aspectRatio: EMBED_ASPECT_RATIO }}>
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

type VideoHeroProps = {
  url?: string | null;
  title: string;
  fallbackImage: string;
};

const VideoHero = ({ url, title, fallbackImage }: VideoHeroProps) => {
  if (url && isYoutubeUrl(url)) {
    return <YouTubeEmbed url={url} title={title} />;
  }

  return (
    <div className={imageWrapperClass} style={{ aspectRatio: EMBED_ASPECT_RATIO }}>
      <Image src={fallbackImage} alt={title} fill className="object-cover" />
    </div>
  );
};

const splitTextIntoSegments = (text: string): Segment[] => {
  const segments: Segment[] = [];
  const regex = new RegExp(YOUTUBE_URL_PATTERN);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const preceding = text.slice(lastIndex, match.index);
    if (preceding) {
      segments.push({ kind: 'text', value: preceding });
    }

    segments.push({ kind: 'video', url: match[0] });
    lastIndex = regex.lastIndex;
  }

  const trailing = text.slice(lastIndex);
  if (trailing) {
    segments.push({ kind: 'text', value: trailing });
  }

  return segments.length > 0 ? segments : [{ kind: 'text', value: text }];
};

const Paragraph = ({ children, className, ...props }: ParagraphProps) => {
  if (typeof children === 'string') {
    const segments = splitTextIntoSegments(children);

    return (
      <>
        {segments.map((segment, index) => {
          if (segment.kind === 'text') {
            return (
              <div
                key={`paragraph-text-${index}`}
                className={`mb-[0.875rem] whitespace-pre-wrap${
                  className ? ` ${className}` : ''
                }`}
                {...props}
              >
                <Body>{segment.value}</Body>
              </div>
            );
          }

          return (
            <YouTubeEmbed key={`paragraph-video-${index}`} url={segment.url} />
          );
        })}
      </>
    );
  }

  return (
    <div
      className={`mb-[0.875rem] whitespace-pre-wrap${
        className ? ` ${className}` : ''
      }`}
      {...props}
    >
      <Body>{children}</Body>
    </div>
  );
};

const Anchor = ({ href, children, className, ...props }: AnchorProps) => {
  if (href && isYoutubeUrl(href)) {
    return (
      <YouTubeEmbed
        url={href}
        title={typeof children === 'string' ? children : undefined}
      />
    );
  }

  const { rel, target, ...rest } = props;

  return (
    <a
      href={href}
      className={`text-blue-primary underline underline-offset-4 text-[1rem] leading-[1.375rem] tracking-[0.0057em]${
        className ? ` ${className}` : ''
      }`}
      rel={rel ?? 'noopener noreferrer'}
      target={target ?? '_blank'}
      {...rest}
    >
      {children}
    </a>
  );
};

const markdownOptions: MarkdownToJSX.Options = {
  overrides: {
    p: { component: Paragraph },
    a: { component: Anchor },
  },
};

type ProjectMainContentProps = {
  project: ProjectDetailViewModel;
};

const ProjectMainContent = ({ project }: ProjectMainContentProps) => (
  <main className="flex-1 w-full px-[4.6875rem] mobile:px-0">
    <VideoHero
      url={project.youtubeUrl ?? undefined}
      title={project.title}
      fallbackImage={project.iconImage}
    />
    <Markdown options={markdownOptions}>{project.detailDescription}</Markdown>
  </main>
);

export default ProjectMainContent;
