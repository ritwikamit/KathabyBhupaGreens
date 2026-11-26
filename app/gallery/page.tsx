import type { Metadata } from 'next';
import { Camera, Film } from 'lucide-react';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeroBanner from '@/components/PageHeroBanner';
import ReelsShowcase from '@/components/ReelsShowcase';
import ScrollReveal from '@/components/ScrollReveal';
import { getGalleryPhotos, getReelItems } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'See short reels and real photos from Katha by Bhupa Greens in Darbhanga — our cozy seating, dining room, coffee bar, and freshly plated food.',
};

export default async function GalleryPage() {
  const [photos, reels] = await Promise.all([
    getGalleryPhotos(),
    getReelItems(),
  ]);

  // Show the three dining/kitchen reels in In Motion at the top of the Gallery page
  const galleryReels = ['Df1uToQN9JH', 'DcQEqXcxZzr', 'DWbA8HKEWL3']
    .map((code) => reels.find((r) => r.shortcode === code))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-7 sm:pt-10 space-y-16 sm:space-y-20">
      {/* Compact Page Hero Banner from pages hero/gallary.jpg */}
      <PageHeroBanner
        imageSrc="/katha-photos/pages-hero/gallery.webp"
        imageAlt="Inside Katha by Bhupa Greens showing wooden counter, menu boards, and Katha wall sign"
        icon={<Camera className="h-4 w-4 shrink-0" aria-hidden="true" />}
        eyebrow="Inside Katha"
        title="Gallery & Moments"
        description="Watch short reels from our dining room and browse real snapshots of our space, cozy corners, and favourite plates."
      />

      {/* In Motion Section Moved to TOP of Gallery (Df1uToQN9JH, DcQEqXcxZzr, DWbA8HKEWL3) */}
      <section className="space-y-8">
        <ScrollReveal className="max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[#774D78]">
            <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="section-eyebrow">In Motion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
            Short reels from Katha
          </h2>
          <p className="text-sm sm:text-base text-[#635364] leading-relaxed">
            A quick look at our desserts, warm tables, and dishes coming out of the kitchen.
          </p>
        </ScrollReveal>

        <ReelsShowcase reels={galleryReels.length > 0 ? galleryReels : reels} />
      </section>

      {/* Full Photo Gallery Below In Motion */}
      <section className="border-t border-[#774D78]/15 pt-14 space-y-8">
        <ScrollReveal className="max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[#774D78]">
            <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="section-eyebrow">Photo Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
            Around the cafe &amp; kitchen
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#635364]">
            Tap any photo to open it nicely in the center of your screen.
          </p>
        </ScrollReveal>

        <GalleryGrid photos={photos} />
      </section>
    </div>
  );
}
