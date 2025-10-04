export type ProjectMarkdownPayload = {
  detailDescription?: string;
  technologies?: string[];
  youtubeUrl?: string;
  githubUrl?: string;
  iconImage?: string;
};

export const parseMarkdownPayload = (
  payload: string | null,
): {
  detailDescription: string;
  technologies: string[];
  youtubeUrl?: string;
  githubUrl?: string;
  iconImage?: string;
} => {
  if (!payload) {
    return { detailDescription: '설명 정보가 없습니다.', technologies: [] };
  }

  try {
    const parsed = JSON.parse(payload) as ProjectMarkdownPayload;
    return {
      detailDescription: parsed.detailDescription ?? payload,
      technologies: parsed.technologies ?? [],
      youtubeUrl: parsed.youtubeUrl,
      githubUrl: parsed.githubUrl,
      iconImage: parsed.iconImage,
    };
  } catch {
    return { detailDescription: payload, technologies: [] };
  }
};

export const normalizeYoutubeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`;
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

      if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/live/')) {
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

export const isYoutubeUrl = (url: string) => {
  try {
    const { hostname } = new URL(url);
    const normalizedHost = hostname.replace(/^www\./, '');

    return ['youtube.com', 'm.youtube.com', 'youtu.be'].includes(normalizedHost);
  } catch {
    return false;
  }
};
