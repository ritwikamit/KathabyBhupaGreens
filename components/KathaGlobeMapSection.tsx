import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, MapPin } from 'lucide-react';
import KathaGlobeMap from '@/components/KathaGlobeMap';
import ScrollReveal from '@/components/ScrollReveal';
import type { SiteConfig } from '@/lib/types/wordpress';

interface KathaGlobeMapSectionProps {
  site: SiteConfig;
  variant?: 'home' | 'find-us';
}

export default function KathaGlobeMapSection({
  site,
  variant = 'home',
}: KathaGlobeMapSectionProps) {
  const initialApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    '';

  const isFindUs = variant === 'find-us';

  return (
    <section
      className={
        isFindUs ? 'space-y-6' : 'mx-auto max-w-6xl px-3 sm:px-8 space-y-8'
      }
    >
      <div className="relative isolate overflow-hidden rounded-2xl border border-[#AF8EB1]/25 bg-[#19101A] p-5 sm:p-10 lg:p-12 shadow-2xl shadow-[#120A13]/35 ring-1 ring-inset ring-white/[0.04] text-[#FBF7EE]">
        {/* Subtle Warm Nocturnal Glow on Left Copy Side (Keeps Right Portal Edge Seamless) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#774D78]/20 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: High-Contrast Editorial Copy & Directions CTA */}
          <ScrollReveal className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-[#F1E3C4]">
              <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow text-[#F1E3C4]">
                {isFindUs ? 'Interactive Map' : 'Explore Our Location'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
              {isFindUs
                ? 'Zoom right into Bhupa Greens'
                : 'From the globe straight to our table'}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#FBF7EE]/85">
              Find Katha Restaurant tucked inside the Bhupa Greens campus along NH27 / NH57 in Shahpur, Darbhanga. Zoom in on the globe to glide directly into live Google Maps, or zoom back out to see our place on the map.
            </p>

            <div className="space-y-2.5 border-t border-white/15 pt-4 text-sm">
              <div className="flex items-start gap-2.5 text-[#FBF7EE]">
                <MapPin
                  className="h-4 w-4 text-[#F1E3C4] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{site.address}</span>
              </div>
              <p className="text-xs text-[#D8C8D9]/90 pl-6 tabular-nums">
                {site.coordinates.lat}° N, {site.coordinates.lng}° E · Open{' '}
                {site.hours}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] border border-[#AF8EB1]/35 px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#8E5E8F]"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Open in Google Maps
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              {!isFindUs && (
                <Link
                  href="/find-us"
                  className="interactive-btn inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-[#FBF7EE] hover:bg-white/20 hover:text-white whitespace-nowrap"
                >
                  Hours &amp; enquiry form
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </ScrollReveal>

          {/* Right: Circular Soft-Faded Globe <-> Google Maps Portal inside Dark Box */}
          <div className="lg:col-span-7 flex justify-center">
            <KathaGlobeMap initialApiKey={initialApiKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
