'use client';

import {
  AnchorHTMLAttributes,
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  isValidElement,
  useState,
  useEffect,
} from 'react';
import Markdown from 'markdown-to-jsx';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import { Body } from '@/app/components/system/text';
import type { ProjectDetailViewModel } from './types';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import 'lexical-rich-text-editor/lexical-rich-text-editor.css';

const normalizeYoutubeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace(
        '/',
        '',
      )}`;
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }

      const pathSegments = parsed.pathname.split('/').filter(Boolean);

      if (
        parsed.pathname.startsWith('/shorts/') ||
        parsed.pathname.startsWith('/live/')
      ) {
        const videoId = pathSegments[1] ?? pathSegments[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }

      if (parsed.pathname.startsWith('/v/')) {
        const videoId = pathSegments[1] ?? pathSegments[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
    }
  } catch (error) {
    console.error('Failed to normalize YouTube url', error);
    return url;
  }

  return url;
};

const isYoutubeUrl = (url: string) => {
  try {
    const { hostname } = new URL(url);
    const normalizedHost = hostname.replace(/^www\./, '');

    return ['youtube.com', 'm.youtube.com', 'youtu.be'].includes(
      normalizedHost,
    );
  } catch {
    return false;
  }
};

const iframeWrapperClass = 'relative mb-3.5 w-full overflow-hidden bg-black';

const EMBED_ASPECT_RATIO = '16 / 9';

const DEFAULT_YOUTUBE_URL_PATTERN = String.raw`(https?:\/\/(?:www\.)?(?:youtube\.com\/[^\s)]+|youtu\.be\/[^\s)]+))`;

const YOUTUBE_URL_PATTERN = DEFAULT_YOUTUBE_URL_PATTERN;

interface ParagraphProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  children: ReactNode;
  [key: string]: unknown;
}

interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  [key: string]: unknown;
}

type Segment =
  | {
      kind: 'text';
      value: string;
    }
  | {
      kind: 'video';
      url: string;
    };

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

const YouTubeEmbed = ({ url, title }: YouTubeEmbedProps) => {
  const embedUrl = normalizeYoutubeUrl(url);

  return (
    <div
      className={iframeWrapperClass}
      style={{ aspectRatio: EMBED_ASPECT_RATIO }}
    >
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

const splitTextIntoSegments = (text: string): Segment[] => {
  const segments: Segment[] = [];
  const regex = new RegExp(YOUTUBE_URL_PATTERN, 'gi');
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
  const combinedClassName = `mb-3.5 whitespace-pre-wrap${
    className ? ` ${className}` : ''
  }`;
  const childArray = Children.toArray(children);
  const renderedNodes: ReactNode[] = [];
  let inlineBuffer: ReactNode[] = [];
  let wrapperIndex = 0;

  const pushInlineBuffer = () => {
    if (inlineBuffer.length === 0) {
      return;
    }

    renderedNodes.push(
      <div
        key={`paragraph-inline-${wrapperIndex}`}
        className={combinedClassName}
        {...props}
      >
        <Body>
          {inlineBuffer.length === 1 ? inlineBuffer[0] : inlineBuffer}
        </Body>
      </div>,
    );

    wrapperIndex += 1;
    inlineBuffer = [];
  };

  const pushEmbed = (node: ReactNode) => {
    renderedNodes.push(
      <div
        key={`paragraph-embed-${wrapperIndex}`}
        className={combinedClassName}
        {...props}
      >
        {node}
      </div>,
    );

    wrapperIndex += 1;
  };

  childArray.forEach((child) => {
    if (typeof child === 'string') {
      const segments = splitTextIntoSegments(child);

      segments.forEach((segment) => {
        if (segment.kind === 'text') {
          inlineBuffer.push(segment.value);
          return;
        }

        pushInlineBuffer();
        pushEmbed(<YouTubeEmbed url={segment.url} />);
      });

      return;
    }

    if (isValidElement(child) && child.type === YouTubeEmbed) {
      pushInlineBuffer();
      pushEmbed(child);

      return;
    }

    if (isValidElement(child) && child.type === Anchor) {
      const { href, children: anchorChildren } = child.props as AnchorProps;

      if (href && isYoutubeUrl(href)) {
        pushInlineBuffer();
        pushEmbed(
          <YouTubeEmbed
            url={href}
            title={
              typeof anchorChildren === 'string' ? anchorChildren : undefined
            }
          />,
        );

        return;
      }
    }

    inlineBuffer.push(child);
  });

  pushInlineBuffer();

  return <>{renderedNodes}</>;
};

const Anchor = ({ href, children, className, ...props }: AnchorProps) => {
  const { rel, target, ...rest } = props;

  return (
    <a
      href={href}
      className={`text-blue-primary underline underline-offset-4 text-base leading-[1.375rem] tracking-[0.0057em]${
        className ? ` ${className}` : ''
      }`}
      rel={rel ?? 'noopener noreferrer nofollow'}
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

interface ProjectMainContentProps {
  project: ProjectDetailViewModel;
}

const ProjectMainContent = ({ project }: ProjectMainContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(project.detailDescription);
  const [RichTextEditorComponent, setRichTextEditorComponent] =
    useState<React.FC | null>(null);

  useEffect(() => {
    if (isEditing) {
      // 편집 모드일 때만 동적으로 라이브러리 임포트
      import('lexical-rich-text-editor')
        .then((module) =>
          setRichTextEditorComponent(() => module.RichTextEditor),
        )
        .catch((err) => console.error('Failed to load rich text editor:', err));
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // TODO: 저장 로직 구현 (예: API 호출로 내용 업데이트)
    console.log('저장된 내용:', editedContent);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedContent(project.detailDescription); // 원래 내용으로 복원
    setIsEditing(false);
  };

  return (
    <div className="relative w-full h-full max-w-full">
      <button
        className="absolute top-8 right-4"
        onClick={isEditing ? undefined : handleEditClick}
      >
        {isEditing ? (
          <div className="flex gap-2">
            <IconCheck
              className="text-green-500 cursor-pointer"
              size={12}
              onClick={handleSaveClick}
            />
            <IconX
              className="text-red-500 cursor-pointer"
              size={12}
              onClick={handleCancelClick}
            />
          </div>
        ) : (
          <IconPencil className="text-gray-footer" size={12} />
        )}
      </button>
      <main
        className={`flex-1 w-full ${
          isEditing ? 'p-3 pt-6' : 'px-[4.6875rem] pt-[4.5rem]'
        } mobile:px-0`}
      >
        {isEditing ? (
          <div suppressHydrationWarning>
            {RichTextEditorComponent && <RichTextEditorComponent />}
          </div>
        ) : (
          <Markdown options={markdownOptions}>
            {project.detailDescription}
          </Markdown>
        )}
      </main>
    </div>
  );
};

export default ProjectMainContent;
