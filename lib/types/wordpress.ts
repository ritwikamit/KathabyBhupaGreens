export type DietaryIndicator = 'veg' | 'non-veg' | 'unconfirmed';

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  locationSummary: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  hours: string;
  hoursNote: string;
  mapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  parentVenueUrl: string;
  logos: {
    katha: string;
    agency: string;
  };
  agency: {
    name: string;
    creditText: string;
    url: string;
  };
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  shortSummary: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  order: number;
  availabilityNote?: string;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  dietary: DietaryIndicator;
  /** Managed in WordPress CMS. Leave null until owner confirms current prices. */
  price: number | null;
  available: boolean;
  featured?: boolean;
  seasonal?: boolean;
  /** Optional authentic dish/drink card image from WordPress or Pictures/ */
  image?: string;
}

export type JournalCategory =
  | 'Menu Notes'
  | 'Food & Ingredients'
  | 'Seasonal Picks'
  | 'Restaurant Updates'
  | 'Visit Katha';

export interface JournalSection {
  heading: string;
  paragraphs: string[];
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  author: string;
  publishedAt: string;
  readTime: string;
  featuredImage: string;
  featuredAlt: string;
  intro: string;
  sections: JournalSection[];
  relatedLink: {
    label: string;
    href: string;
  };
}

export type GalleryGroup =
  | 'Food and drinks'
  | 'Restaurant interiors'
  | 'Table settings'
  | 'Group and family dining'
  | 'Seasonal highlights';

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  group: GalleryGroup;
  src: string;
  alt: string;
  aspect: 'landscape' | 'portrait' | 'standard' | 'square' | 'tall';
  /** Marks smaller source photos so cards and lightbox stay compact and sharp */
  lowRes?: boolean;
}

export interface ReelItem {
  id: string;
  shortcode: string;
  instagramUrl: string;
  title: string;
  subtitle: string;
  posterImage: string;
  /** Optional direct MP4 URL managed via WordPress Media or public/reels/ */
  videoUrl?: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * WordPress REST API v2 raw response shapes for headless CMS integration.
 * Custom post types (menu_item, menu_category, katha_gallery, katha_reel)
 * expose ACF or custom meta fields via `show_in_rest: true`.
 */
export interface WPRestRenderedField {
  rendered: string;
}

export interface WPRestEmbeddedMedia {
  source_url?: string;
  alt_text?: string;
}

export interface WPRestPost {
  id: number;
  slug: string;
  date: string;
  title: WPRestRenderedField;
  excerpt: WPRestRenderedField;
  content: WPRestRenderedField;
  acf?: {
    category_label?: JournalCategory;
    read_time?: string;
    related_link_label?: string;
    related_link_href?: string;
  };
  _embedded?: {
    author?: Array<{ name?: string }>;
    'wp:featuredmedia'?: WPRestEmbeddedMedia[];
  };
}

export interface WPRestMenuCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  acf?: {
    short_summary?: string;
    hero_image?: string;
    hero_alt?: string;
    display_order?: number;
    availability_note?: string;
  };
}

export interface WPRestMenuItem {
  id: number;
  slug: string;
  title: WPRestRenderedField;
  acf?: {
    category_slug?: string;
    subcategory?: string;
    description?: string;
    dietary?: DietaryIndicator;
    price?: number | null;
    available?: boolean;
    featured?: boolean;
    seasonal?: boolean;
    image?: string;
  };
}

export interface WPRestGalleryItem {
  id: number;
  title: WPRestRenderedField;
  acf?: {
    caption?: string;
    group?: GalleryGroup;
    aspect?: 'landscape' | 'portrait' | 'standard' | 'square';
  };
  _embedded?: {
    'wp:featuredmedia'?: WPRestEmbeddedMedia[];
  };
}

export interface WPRestReelItem {
  id: number;
  title: WPRestRenderedField;
  acf?: {
    shortcode?: string;
    instagram_url?: string;
    subtitle?: string;
    video_url?: string | null;
  };
  _embedded?: {
    'wp:featuredmedia'?: WPRestEmbeddedMedia[];
  };
}
