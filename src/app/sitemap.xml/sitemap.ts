import fs from 'fs';
import path from 'path';

import type { MetadataRoute } from 'next';

// Get site URL from environment variables with fallback chain
function getSiteUrl(): string {
  const siteUrl =
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';

  // Validate site URL
  if (!siteUrl) {
    console.warn(
      '[Sitemap] Warning: SITE_URL or NEXT_PUBLIC_SITE_URL environment variable is not set. Using fallback "https://example.com"',
    );
    return 'https://example.com';
  }

  // Check if protocol is missing and add https://
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    console.warn(
      `[Sitemap] Warning: SITE_URL "${siteUrl}" is missing protocol. Adding "https://"`,
    );
    return `https://${siteUrl}`;
  }

  // Warn if using example.com or localhost in production
  if (
    (siteUrl.includes('example.com') || siteUrl.includes('localhost')) &&
    process.env.NODE_ENV === 'production'
  ) {
    console.error(
      `[Sitemap] Error: Invalid SITE_URL "${siteUrl}" detected in production environment. Please set SITE_URL to the correct production domain.`,
    );
  }

  return siteUrl;
}

const siteConfig = {
  url: getSiteUrl(),
};

const exclusiveRoutes = ['/auth*'];

// Check if a route should be excluded based on exclusiveRoutes patterns
function shouldExcludeRoute(route: string): boolean {
  return exclusiveRoutes.some((pattern) => {
    if (pattern.includes('*')) {
      // Convert wildcard pattern to regex
      const regexPattern = pattern
        .replace(/\\/g, '\\\\')
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(route);
    }
    return route === pattern;
  });
}

function normalizeRouteSubpath(subpath: string): string {
  return subpath
    .split('/')
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
    .filter((segment) => !segment.startsWith('['))
    .join('/');
}

// Recursively collect all pages with `page.tsx` or `page.jsx`
export async function getStaticRoutes(
  dir = 'src/app', // Updated default directory to match the actual structure
  parentPath = '',
): Promise<string[]> {
  const currentDir = path.join(process.cwd(), dir);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  let routes: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      // Check if this is a route group (wrapped in parentheses)
      const isRouteGroup =
        entry.name.startsWith('(') && entry.name.endsWith(')');

      // For route groups, don't include the group name in the path
      const routePath = isRouteGroup
        ? parentPath
        : path.join(parentPath, entry.name);

      // Collect possible page file paths
      const possiblePageFiles = ['page.tsx', 'page.jsx'].map((file) =>
        path.join(fullPath, file),
      );
      // Check if any of the possible page files exist
      const hasPage = possiblePageFiles.some((filePath) =>
        fs.existsSync(filePath),
      );

      if (hasPage) {
        routes.push(`/${routePath}`);
      }

      // Continue scanning nested folders recursively
      const nestedRoutes = await getStaticRoutes(
        path.join(dir, entry.name),
        routePath,
      );

      // Excludes routes with dynamic segments (e.g., [slug])
      const nestedStaticRoutes = nestedRoutes.filter(
        (route) => !route.match(/\[.+\]/),
      );

      routes = routes.concat(nestedStaticRoutes);
    }
  }

  return parentPath === '' ? ['/', ...routes] : routes;
}

interface DynamicRouteConfig {
  subpath: string;
  loader: () => Promise<string[]>;
}

// Get dynamic routes by calling `generateStaticParams` from dynamic pages
async function getDynamicRoutes(config: DynamicRouteConfig): Promise<string[]> {
  try {
    const params = await config.loader();
    const normalizedSubpath = normalizeRouteSubpath(config.subpath);

    return params.map((route) => {
      const segments = [normalizedSubpath, route].filter(Boolean);
      return `/${segments.join('/')}`;
    });
  } catch (error) {
    console.error('Error loading dynamic routes:', error);
    return []; // Return empty array on error
  }
}

export async function getAllRoutes(): Promise<string[]> {
  const dynamicRouteConfigs: DynamicRouteConfig[] = [
    {
      subpath: '(box-layout)/portfolio',
      loader: async () =>
        (
          await import(
            '@/app/(box-layout)/portfolio/[profileName]/staticParamsGenerator'
          )
        ).default(),
    },
    {
      subpath: '(box-layout)/team',
      loader: async () =>
        (
          await import(
            '@/app/(box-layout)/team/[teamName]/staticParamsGenerator'
          )
        ).default(),
    },
  ];

  const [staticRoutes, dynamicRoutes] = await Promise.all([
    getStaticRoutes(),
    Promise.all(dynamicRouteConfigs.map((config) => getDynamicRoutes(config))),
  ]);

  return [...staticRoutes, ...dynamicRoutes.flat()].filter(
    (route) => !shouldExcludeRoute(route),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allRoutes = await getAllRoutes();

  return allRoutes.map((route) => ({
    url: encodeURI(`${siteConfig.url}${route}`),
    lastModified: new Date().toISOString(),
    priority: route === '/' ? 1 : 0.8,
  }));
}
