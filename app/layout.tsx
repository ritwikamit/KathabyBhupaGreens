import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond, Dancing_Script } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageTransition from '@/components/PageTransition';
import InitialLoader from '@/components/InitialLoader';
import ScrollToTopProgress from '@/components/ScrollToTopProgress';
import CookieConsentModal from '@/components/CookieConsentModal';
import GoogleMapsQuotaGuard from '@/components/GoogleMapsQuotaGuard';
import { MenuBookModalProvider } from '@/components/MenuBookModalContext';
import { getMenuCategories, getMenuItems } from '@/lib/wordpress';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
});

const cinzelMenu = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-menu',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL || 'https://kathabybhupagreens.com',
  ),
  title: {
    default: 'Katha by Bhupa Greens | Restaurant in Darbhanga',
    template: '%s | Katha by Bhupa Greens',
  },
  description:
    'Visit Katha by Bhupa Greens, located inside the Bhupa Greens campus in Darbhanga. Browse the menu, view the dining space, read the journal, find directions, and contact the restaurant.',
  keywords: [
    'Katha by Bhupa Greens',
    'Restaurant in Darbhanga',
    'Best restaurant in Darbhanga',
    'Bhupa Greens Darbhanga',
    'Family dining Darbhanga',
    'Cafe in Darbhanga',
    'Indian food Darbhanga',
    'Biryani in Darbhanga',
    'South Indian in Darbhanga',
  ],
  authors: [{ name: 'Katha by Bhupa Greens' }],
  creator: 'Katha by Bhupa Greens',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Katha by Bhupa Greens | Restaurant in Darbhanga',
    description:
      'Visit Katha by Bhupa Greens, located inside the Bhupa Greens campus in Darbhanga. Browse the menu, find directions, and contact the restaurant.',
    url: 'https://kathabybhupagreens.com',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Katha by Bhupa Greens',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Katha by Bhupa Greens - Restaurant & Dining in Darbhanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katha by Bhupa Greens | Restaurant in Darbhanga',
    description:
      'Visit Katha by Bhupa Greens, located inside the Bhupa Greens campus in Darbhanga. Browse the menu, find directions, and contact the restaurant.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, items] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dancingScript.variable} ${cinzelMenu.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#FBF7EE] text-[#2A1C2B] selection:bg-[#AF8EB1]/30 selection:text-[#2A1C2B]"
      >
        <InitialLoader />
        <GoogleMapsQuotaGuard />

        {/* Subtle ambient palette veils (#AF8EB1, #B7D0CC, #F1E3C4) behind glass surfaces */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-36 right-[-6%] h-[32rem] w-[32rem] rounded-full bg-[#AF8EB1]/22 blur-3xl" />
          <div className="absolute top-[34%] -left-24 h-[30rem] w-[30rem] rounded-full bg-[#B7D0CC]/32 blur-3xl" />
          <div className="absolute bottom-[-8%] right-[12%] h-[28rem] w-[28rem] rounded-full bg-[#F1E3C4]/65 blur-3xl" />
        </div>

        <MenuBookModalProvider categories={categories} items={items}>
          <SiteHeader />
          <PageTransition>
            <main className="flex-1">{children}</main>
          </PageTransition>
          <SiteFooter />
          <ScrollToTopProgress />
          <CookieConsentModal />
        </MenuBookModalProvider>
      </body>
    </html>
  );
}
