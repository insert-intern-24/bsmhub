import { getPortfolioParams } from '../portfolio/[profileName]/getPortfolioParams';
import type { MetadataRoute } from 'next';

const siteConfig = {
  url: process.env.SITE_URL || 'https://bsmhub.vercel.app',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['/', '/editor', '/portfolio'];

  const portfolioParams = await getPortfolioParams();
  const portfolioRoutes = portfolioParams.map((param) => ({
    url: `${siteConfig.url}/portfolio/${param.profileName}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...portfolioRoutes];
}