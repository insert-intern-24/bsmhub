import fs from 'fs';
import path from 'path';

import type { MetadataRoute } from 'next';

const siteConfig = {
  url: 'https://example.com',
};

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

      // Check if this directory has a page.tsx or page.jsx file
      const hasPage = ['page.tsx', 'page.jsx'].some((file) =>
        fs.existsSync(path.join(fullPath, file)),
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

// Get dynamic routes by calling `generateStaticParams` from dynamic pages
// async function getDynamicRoutes(
//   subpath: string,
//   dynamicSegment: string,
// ): Promise<string[]> {
//   try {
//     const { generateStaticParams } = await import(
//       `./${subpath}/[${dynamicSegment}]/page`
//     );
//     const params = await generateStaticParams();
//     return params.map(
//       (route: { [segment: string]: string }) =>
//         `/${subpath}/${route[dynamicSegment]}`,
//     );
//   } catch (error) {
//     console.error('Error loading dynamic routes:', error);
//     return []; // Return empty array on error
//   }
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allRoutes = (
    await Promise.all([
      getStaticRoutes(),
      //   Uncomment the following lines if you have dynamic routes
      //   getDynamicRoutes("blog", "slug"),
      //   getDynamicRoutes("issue", "issueDate"),
    ])
  ).flat();

  return allRoutes.map((route) => ({
    url: encodeURI(`${siteConfig.url}${route}`),
    lastModified: new Date().toISOString(),
    priority: route === '/' ? 1 : 0.8,
  }));
}
