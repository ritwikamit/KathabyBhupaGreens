import { SITE_CONFIG } from '@/lib/data/katha-data';
import type { FaqItem, MenuCategory } from '@/lib/types/wordpress';

interface RestaurantJsonLdProps {
  categories?: MenuCategory[];
  faqs?: FaqItem[];
}

/**
 * Emits verified Restaurant (and optional Menu/FAQ) JSON-LD matching visible page content.
 * Strictly omits unverified or self-serving LocalBusiness aggregateRating per SEO.md and Google guidelines.
 */
export default function StructuredData({
  categories,
  faqs,
}: RestaurantJsonLdProps) {
  const baseUrl =
    process.env.APP_URL?.replace(/\/+$/, '') || 'https://kathabybhupagreens.com';

  const restaurantSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_CONFIG.name,
    url: baseUrl,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: [
      `${baseUrl}/og-image.jpg`,
      `${baseUrl}/katha-photos/hero-interior.webp`,
    ],
    logo: `${baseUrl}/icon.png`,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Inside Bhupa Greens Campus, NH27 / NH57, Shahpur',
      addressLocality: 'Darbhanga',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.coordinates.lat,
      longitude: SITE_CONFIG.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '23:00',
      },
    ],
    servesCuisine: ['Indian', 'South Indian', 'Biryani', 'Korean', 'Cafe'],
    hasMenu: `${baseUrl}/menu`,
    sameAs: [
      SITE_CONFIG.instagramUrl,
      SITE_CONFIG.facebookUrl,
      SITE_CONFIG.mapsUrl,
    ],
  };

  if (categories && categories.length > 0) {
    restaurantSchema.hasMenu = {
      '@type': 'Menu',
      name: 'The Katha Menu',
      url: `${baseUrl}/menu`,
      hasMenuSection: categories.map((cat) => ({
        '@type': 'MenuSection',
        name: cat.name,
        description: cat.description,
        url: `${baseUrl}/menu/${cat.slug}`,
      })),
    };
  }

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
