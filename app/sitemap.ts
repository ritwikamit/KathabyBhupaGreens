import type { MetadataRoute } from 'next';
import { getJournalPosts, getMenuCategories } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.APP_URL?.replace(/\/+$/, '') || 'https://kathabybhupagreens.com';

  const [categories, posts] = await Promise.all([
    getMenuCategories(),
    getJournalPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/our-story',
    '/menu',
    '/gallery',
    '/journal',
    '/blog',
    '/faq',
    '/find-us',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/menu' || path === '/journal' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/menu' ? 0.9 : 0.7,
  }));

  const menuRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/menu/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const journalRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...menuRoutes, ...journalRoutes];
}
