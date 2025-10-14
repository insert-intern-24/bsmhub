import fs from 'fs';
import path from 'path';

import type { MetadataRoute } from 'next';

const siteConfig = {
  url: process.env.SITE_URL || 'https://example.com',
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
      const routePath = path.join(parentPath, entry.name);

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

export interface StaticParam {
  [key: string]: string;
}

// Get dynamic routes by calling `generateStaticParams` from dynamic pages
async function getDynamicRoutes(
  subpath: string,
  dynamicSegment: string,
): Promise<string[]> {
  const filePath = path.join(process.cwd(), 'src/app', subpath);
  try {
    const staticParamsGenerator = (
      await import(
        path.join(filePath, `[${dynamicSegment}]`, 'staticParamsGenerator')
      )
    ).default;
    const params = (await staticParamsGenerator()) as string[];
    return params.map((route) => `/${subpath}/${route}`);
  } catch (error) {
    console.error('Error loading dynamic routes:', error);
    return []; // Return empty array on error
  }
}

export async function getAllRoutes(): Promise<string[]> {
  return Promise.all([
    getStaticRoutes(),
    getDynamicRoutes('portfolio', 'profileName'),
    getDynamicRoutes('project', 'project_name'),
  ])
    .then((results) => results.flat())
    .then((allRoutes) =>
      allRoutes.filter((route) => !shouldExcludeRoute(route)),
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
