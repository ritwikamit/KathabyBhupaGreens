import {
  AEO_FAQS,
  GALLERY_PHOTOS,
  JOURNAL_POSTS,
  MENU_CATEGORIES,
  MENU_ITEMS,
  REEL_ITEMS,
  SITE_CONFIG,
} from '@/lib/data/katha-data';
import type {
  FaqItem,
  GalleryPhoto,
  JournalPost,
  MenuCategory,
  MenuItem,
  ReelItem,
  SiteConfig,
  WPRestGalleryItem,
  WPRestMenuCategory,
  WPRestMenuItem,
  WPRestPost,
  WPRestReelItem,
} from '@/lib/types/wordpress';

const WP_API_URL = process.env.WORDPRESS_API_URL?.replace(/\/+$/, '') || '';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatWpDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

async function fetchFromWordPress<T>(
  endpoint: string,
  tags: string[],
  revalidateSeconds = 300
): Promise<T | null> {
  if (!WP_API_URL) return null;

  try {
    const response = await fetch(`${WP_API_URL}${endpoint}`, {
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: revalidateSeconds,
        tags,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function getSiteConfig(): SiteConfig {
  return SITE_CONFIG;
}

export function getAeoFaqs(): FaqItem[] {
  return AEO_FAQS;
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const wpCategories = await fetchFromWordPress<WPRestMenuCategory[]>(
    '/menu_category?per_page=50',
    ['menu', 'menu-categories']
  );

  if (!wpCategories || wpCategories.length === 0) {
    return [...MENU_CATEGORIES].sort((a, b) => a.order - b.order);
  }

  return wpCategories
    .map((cat, idx): MenuCategory => ({
      id: String(cat.id),
      slug: cat.slug,
      name: stripHtml(cat.name),
      shortSummary:
        cat.acf?.short_summary || stripHtml(cat.description).slice(0, 110),
      description: stripHtml(cat.description),
      heroImage: cat.acf?.hero_image || '/katha-photos/dining-hall.jpg',
      heroAlt:
        cat.acf?.hero_alt || `${stripHtml(cat.name)} at Katha by Bhupa Greens`,
      order: cat.acf?.display_order ?? idx + 1,
      availabilityNote: cat.acf?.availability_note,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getMenuCategoryBySlug(
  slug: string
): Promise<MenuCategory | null> {
  const categories = await getMenuCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getMenuItems(categorySlug?: string): Promise<MenuItem[]> {
  const query = categorySlug
    ? `/menu_item?per_page=100&category_slug=${encodeURIComponent(categorySlug)}`
    : '/menu_item?per_page=100';

  const tags = categorySlug
    ? ['menu', `menu-category-${categorySlug}`]
    : ['menu', 'menu-items'];

  const wpItems = await fetchFromWordPress<WPRestMenuItem[]>(query, tags);

  if (!wpItems || wpItems.length === 0) {
    const active = MENU_ITEMS.filter((item) => item.available);
    return categorySlug
      ? active.filter((item) => item.categorySlug === categorySlug)
      : active;
  }

  const normalized = wpItems
    .map((item): MenuItem => ({
      id: String(item.id),
      slug: item.slug,
      name: stripHtml(item.title.rendered),
      categorySlug: item.acf?.category_slug || 'indian-favourites',
      subcategory: item.acf?.subcategory || 'Kitchen Selection',
      description: item.acf?.description || '',
      dietary: item.acf?.dietary || 'unconfirmed',
      price: typeof item.acf?.price === 'number' ? item.acf.price : null,
      available: item.acf?.available !== false,
      featured: Boolean(item.acf?.featured),
      seasonal: Boolean(item.acf?.seasonal),
      image: item.acf?.image,
    }))
    .filter((item) => item.available);

  return categorySlug
    ? normalized.filter((item) => item.categorySlug === categorySlug)
    : normalized;
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  const wpPosts = await fetchFromWordPress<WPRestPost[]>(
    '/posts?_embed&per_page=20',
    ['journal', 'posts']
  );

  if (!wpPosts || wpPosts.length === 0) {
    return JOURNAL_POSTS;
  }

  return wpPosts.map((post): JournalPost => {
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    const authorName = post._embedded?.author?.[0]?.name || 'Katha Team';
    const plainContent = stripHtml(post.content.rendered);
    const paragraphs = plainContent
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    return {
      id: String(post.id),
      slug: post.slug,
      title: stripHtml(post.title.rendered),
      excerpt: stripHtml(post.excerpt.rendered),
      category: post.acf?.category_label || 'Restaurant Updates',
      author: authorName,
      publishedAt: formatWpDate(post.date),
      readTime: post.acf?.read_time || '3 min read',
      featuredImage: media?.source_url || '/katha-photos/hero-interior.webp',
      featuredAlt: media?.alt_text || stripHtml(post.title.rendered),
      intro: paragraphs[0] || stripHtml(post.excerpt.rendered),
      sections:
        paragraphs.length > 1
          ? [
              {
                heading: 'From Katha by Bhupa Greens',
                paragraphs: paragraphs.slice(1),
              },
            ]
          : [],
      relatedLink: {
        label: post.acf?.related_link_label || 'Browse the Katha Menu',
        href: post.acf?.related_link_href || '/menu',
      },
    };
  });
}

export async function getJournalPostBySlug(
  slug: string
): Promise<JournalPost | null> {
  const posts = await getJournalPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const wpGallery = await fetchFromWordPress<WPRestGalleryItem[]>(
    '/katha_gallery?_embed&per_page=40',
    ['gallery']
  );

  if (!wpGallery || wpGallery.length === 0) {
    return GALLERY_PHOTOS;
  }

  return wpGallery.map((item): GalleryPhoto => {
    const media = item._embedded?.['wp:featuredmedia']?.[0];
    return {
      id: String(item.id),
      title: stripHtml(item.title.rendered),
      caption: item.acf?.caption || '',
      group: item.acf?.group || 'Food and drinks',
      src: media?.source_url || '/katha-photos/hero-interior.webp',
      alt: media?.alt_text || stripHtml(item.title.rendered),
      aspect: item.acf?.aspect || 'standard',
    };
  });
}

export async function getReelItems(): Promise<ReelItem[]> {
  const wpReels = await fetchFromWordPress<WPRestReelItem[]>(
    '/katha_reel?_embed&per_page=10',
    ['reels']
  );

  if (!wpReels || wpReels.length === 0) {
    return REEL_ITEMS;
  }

  return wpReels.map((item, idx): ReelItem => {
    const media = item._embedded?.['wp:featuredmedia']?.[0];
    const shortcode = item.acf?.shortcode || REEL_ITEMS[idx % REEL_ITEMS.length].shortcode;
    return {
      id: String(item.id),
      shortcode,
      instagramUrl:
        item.acf?.instagram_url || `https://www.instagram.com/reel/${shortcode}/`,
      title: stripHtml(item.title.rendered),
      subtitle: item.acf?.subtitle || '',
      posterImage:
        media?.source_url || REEL_ITEMS[idx % REEL_ITEMS.length].posterImage,
      videoUrl: item.acf?.video_url || null,
    };
  });
}
