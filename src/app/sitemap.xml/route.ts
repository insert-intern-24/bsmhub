// src/app/api/sitemap-index/route.ts
import sitemap from './sitemap';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Don't generate sitemap for staging environments
    if (process.env.ENVIRONMENT === 'staging') {
      return new Response('Sitemap not available in staging environment', {
        status: 404,
      });
    }

    const sitemapData = await sitemap();
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapData
      .map(
        (entry) =>
          `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastModified}</lastmod>\n    <priority>${entry.priority}</priority>\n  </url>`,
      )
      .join('\n')}\n</urlset>`;

    return new Response(xmlData, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
