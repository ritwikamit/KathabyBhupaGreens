import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  Clock,
  Coffee,
  Compass,
  Feather,
  Film,
  Heart,
  MapPin,
  Moon,
  Phone,
  Star,
  StarHalf,
  Sun,
  Sunrise,
  UtensilsCrossed,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import EditorialImage from '@/components/EditorialImage';
import InteractiveMenuShowcase from '@/components/InteractiveMenuShowcase';
import KathaGlobeMapSection from '@/components/KathaGlobeMapSection';
import OpenMenuBookButton from '@/components/OpenMenuBookButton';
import ReelsShowcase, { HeroReelBox } from '@/components/ReelsShowcase';
import ScrollReveal from '@/components/ScrollReveal';
import StructuredData from '@/components/StructuredData';
import { LANDING_SNAPSHOTS } from '@/lib/data/katha-data';
import {
  getJournalPosts,
  getMenuCategories,
  getReelItems,
  getSiteConfig,
} from '@/lib/wordpress';

export default async function HomePage() {
  const site = getSiteConfig();
  const [categories, posts, reels] = await Promise.all([
    getMenuCategories(),
    getJournalPosts(),
    getReelItems(),
  ]);

  const featuredPosts = posts.slice(0, 3);
  const heroReel =
    reels.find((r) => r.shortcode === 'DSrSAQRgrSs') ?? reels[0];
  const diningReel = reels.find((r) => r.shortcode === 'Df1uToQN9JH');
  const dayInsideReel = reels.find((r) => r.shortcode === 'DcQEqXcxZzr');

  return (
    <div className="space-y-14 sm:space-y-24 lg:space-y-28">
      <StructuredData categories={categories} />

      {/* 1. Framed Hero with All-Side Spacing, Darkly Faded Interior Background, Open Typography, Google 4.5 Rating & Bordered Reel */}
      <section className="mx-auto max-w-[1380px] px-3 sm:px-6 lg:px-10 pt-3 sm:pt-7">
        <div className="relative isolate w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#774D78]/20 shadow-2xl shadow-[#2A1C2B]/15">
          {/* Hero Background Photo with Dark Atmospheric Fade */}
          <div className="absolute inset-0 z-0">
            <EditorialImage
              src="/katha-photos/hero-interior.webp"
              alt="Inside Katha by Bhupa Greens showing cozy coral seating, wooden tables, and framed portraits"
              priority
              sizes="(max-width: 1380px) 100vw, 1380px"
              containerClassName="relative w-full h-full"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#1F1520]/84 via-[#1F1520]/62 to-[#1F1520]/40"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#1F1520]/60 via-transparent to-[#1F1520]/25"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-10 lg:px-12 py-8 sm:py-12 lg:py-14 min-h-[auto] sm:min-h-[calc(100svh-140px)] flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
              {/* Left: Open Warm Copy Directly Over Darkly Faded Background */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-white">
                <div className="flex items-center gap-2 text-[#F1E3C4]">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="section-eyebrow text-[#F1E3C4]">
                    Bhupa Greens Campus · Darbhanga
                  </span>
                </div>

                <h1 className="font-serif text-[2.15rem] sm:text-5xl lg:text-[4rem] font-medium leading-[1.06] tracking-tight text-white">
                  Every meal has a story.
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-[#FBF7EE]/90 max-w-lg">
                  Pull up a chair inside Bhupa Greens for honest, freshly cooked food — from Indian curries, handi biryani, and crisp dosas to cafe snacks, brewed chai, coffee, and chilled drinks.
                </p>

                {/* Verified Google Review Trust Summary (4.5 Rating · 170+ Reviews) */}
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 border-l-2 border-[#F1E3C4]/80 pl-4 py-0.5 text-sm text-[#FBF7EE] transition-opacity hover:opacity-95"
                >
                  <span className="inline-flex items-center gap-0.5 text-[#F5C451]" aria-label="4.5 out of 5 stars on Google">
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    <StarHalf className="h-4 w-4 fill-current" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-white tabular-nums">4.5</span>
                  <span className="text-[#F1E3C4]/90">Google Rating</span>
                  <span aria-hidden="true" className="text-[#AF8EB1]">·</span>
                  <span className="text-[#FBF7EE]/90 tabular-nums">170+ Reviews</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#F1E3C4] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>

                {/* Two Dedicated Enquiry Buttons (Phone Number Never Exposed) */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                  <a
                    href={site.phoneHref}
                    className="interactive-btn inline-flex min-h-[44px] items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-[#774D78] px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#5D3A5E] shadow-lg shadow-[#1F1520]/30"
                  >
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    Book Table
                  </a>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn inline-flex min-h-[44px] items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-white/95 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#2A1C2B] whitespace-nowrap shrink-0 hover:bg-white shadow-lg shadow-[#1F1520]/25"
                  >
                    <FaWhatsapp className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#25D366]" aria-hidden="true" />
                    WhatsApp
                  </a>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn col-span-2 inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border border-white/15 sm:border-transparent px-3 py-2 text-xs sm:text-sm font-medium text-[#F1E3C4] hover:text-white whitespace-nowrap"
                  >
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    Directions on Google Maps
                  </a>
                </div>

                {/* Opening Hours Strip */}
                <div className="border-t border-white/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F1E3C4]/90">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#B7D0CC]" aria-hidden="true" />
                    <span className="font-medium text-white">Open Every Day</span>
                    <span aria-hidden="true" className="text-white/50">·</span>
                    <span className="tabular-nums">{site.hours}</span>
                  </div>
                  <span className="text-[#FBF7EE]/75">
                    NH27 / NH57 · Shahpur, Darbhanga
                  </span>
                </div>
              </div>

              {/* Right: Enlarged Bordered Foreground Video Box (DSrSAQRgrSs) */}
              {heroReel && (
                <div className="lg:col-span-6 flex justify-center lg:justify-end">
                  <HeroReelBox reel={heroReel} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Icon Quick Overview Ribbon */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 -mt-4 sm:-mt-10">
        <ScrollReveal>
          <div className="border-y border-[#774D78]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#774D78]/15">
            <div className="py-5 sm:px-5 first:sm:pl-0 flex items-start gap-3.5">
              <UtensilsCrossed className="h-4 w-4 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#2A1C2B]">Something for Everyone</p>
                <p className="text-xs text-[#635364]">Indian meals, biryani, dosa, snacks &amp; sweets</p>
              </div>
            </div>

            <div className="py-5 sm:px-5 flex items-start gap-3.5">
              <BookOpen className="h-4 w-4 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#2A1C2B]">Cozy Reading Corners</p>
                <p className="text-xs text-[#635364]">Bookshelves and unhurried family tables</p>
              </div>
            </div>

            <div className="py-5 sm:px-5 flex items-start gap-3.5">
              <Coffee className="h-4 w-4 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#2A1C2B]">Fresh Chai &amp; Coolers</p>
                <p className="text-xs text-[#635364]">Masala chai, filter coffee &amp; chilled drinks</p>
              </div>
            </div>

            <div className="py-5 sm:px-5 last:sm:pr-0 flex items-start gap-3.5">
              <MapPin className="h-4 w-4 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#2A1C2B]">Inside Bhupa Greens</p>
                <p className="text-xs text-[#635364]">Peaceful stop right off NH27 in Darbhanga</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. Exclusive Dedicated Menu Showcase Box */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 space-y-6 sm:space-y-8">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <UtensilsCrossed className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">What We Serve</span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
              Pick what you feel like eating
            </h2>
          </div>

          <OpenMenuBookButton
            className="interactive-btn font-menu inline-flex items-center gap-2 rounded-lg bg-[#774D78]/10 px-4 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Open menu book
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </OpenMenuBookButton>
        </ScrollReveal>

        <InteractiveMenuShowcase categories={categories} />
      </section>

      {/* 3. Moments from the Dining Room (Df1uToQN9JH Only — Compact Box & Aligned Highlights) */}
      {diningReel && (
        <section className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="border-t border-[#774D78]/15 pt-12 sm:pt-16 space-y-8 sm:space-y-10">
            <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-[#774D78]">
                  <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="section-eyebrow">In Motion</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
                  Moments from our dining room
                </h2>
                <p className="text-base leading-relaxed text-[#635364]">
                  Watch a quick glimpse of our warm crisp Bihar thekua served over chilled vanilla ice cream — freshly plated inside Katha.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/gallery"
                  className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5D3A5E]"
                >
                  Watch more clips
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/20 bg-white/80 px-4 py-2.5 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78]"
                >
                  @katha.bhupagreens
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Compact Left Video Box */}
              <div className="lg:col-span-4 flex justify-center">
                <ReelsShowcase reels={[diningReel]} compactSingle />
              </div>

              {/* Aligned Companion Sweet & Beverage Highlights */}
              <ScrollReveal delay={0.1} className="lg:col-span-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                  <div className="glass-panel-soft rounded-xl p-6 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#774D78]">
                        <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Homegrown Sweets</span>
                      </div>
                      <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                        Thekua &amp; Makhana Kheer
                      </h3>
                      <p className="text-sm leading-relaxed text-[#635364]">
                        Familiar Darbhanga flavours served warm and simple so everyone at the table can share a spoon.
                      </p>
                    </div>
                  </div>

                  <div className="glass-sage rounded-xl p-6 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#774D78]">
                        <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Best Paired With</span>
                      </div>
                      <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                        Filter Coffee or Masala Chai
                      </h3>
                      <p className="text-sm leading-relaxed text-[#635364]">
                        Slow down after your meal with a steaming cup of brewed chai or frothy brass-tumbler coffee.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-[#635364] leading-relaxed">
                    Sweet endings, warm desserts, and refreshing evening pours made fresh in our kitchen every day.
                  </p>
                  <Link
                    href="/menu/desserts"
                    className="interactive-btn font-menu inline-flex items-center justify-center gap-2 rounded-lg border border-[#774D78]/25 bg-white/90 px-5 py-2.5 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    See Desserts Menu
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* 3B. Dedicated Separate Section: "A Day Inside Katha" (DcQEqXcxZzr — Compact Box & Balanced Alignment) */}
      {dayInsideReel && (
        <section className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="border-t border-[#774D78]/15 pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Story Copy, Rhythm Highlights & CTAs */}
            <ScrollReveal className="lg:col-span-8 space-y-6 order-2 lg:order-1">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-[#774D78]">
                  <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="section-eyebrow">Everyday Rhythm</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
                  A Day Inside Katha
                </h2>
                <p className="text-base leading-relaxed text-[#635364]">
                  From quiet morning chai and crisp hot dosas to relaxed afternoon catch-ups and warm family dinners — step into everyday life inside our Bhupa Greens dining room.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                <div className="glass-sage rounded-xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#774D78]">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open 9:00 AM to 11:00 PM</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                    Unhurried Meals All Day
                  </h3>
                  <p className="text-sm leading-relaxed text-[#635364]">
                    Drop in for a quick highway coffee stop or linger with family over comforting curries and handi biryani.
                  </p>
                </div>

                <div className="glass-panel-soft rounded-xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#774D78]">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Cozy Atmosphere</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                    Books, Warm Lights &amp; Lawn Air
                  </h3>
                  <p className="text-sm leading-relaxed text-[#635364]">
                    Pick up a book from our shelf, settle into soft seating, and enjoy the calm greenery right outside our doors.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/our-story"
                  className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5D3A5E]"
                >
                  Read our story
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/gallery"
                  className="interactive-btn inline-flex items-center gap-2 rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-2.5 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78]"
                >
                  Explore gallery
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Matching Compact Video Box */}
            <div className="lg:col-span-4 flex justify-center order-1 lg:order-2">
              <ReelsShowcase reels={[dayInsideReel]} compactSingle />
            </div>
          </div>
        </section>
      )}

      {/* 4. Compact Real Snapshots From Our Tables (Curated morePhotos — Compact Cards So Quality Stays Sharp, Zero Beverages Folder) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 space-y-6 sm:space-y-8">
        <ScrollReveal className="border-t border-[#774D78]/15 pt-12 sm:pt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Fresh From Our Tables</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
              Real plates &amp; happy moments
            </h2>
            <p className="text-sm sm:text-base text-[#635364]">
              A quick peek at everyday dishes, warm chai trays, and friends hanging out at Katha.
            </p>
          </div>

          <Link
            href="/gallery"
            className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg bg-[#774D78]/10 px-4 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            Open full gallery
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
          {LANDING_SNAPSHOTS.map((snap) => (
            <Link
              key={snap.id}
              href="/gallery"
              className="interactive-media group flex flex-col h-full w-full glass-panel rounded-xl overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F1E3C4]/40 shrink-0">
                <EditorialImage
                  src={snap.src}
                  alt={snap.alt}
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 200px"
                  containerClassName="relative w-full h-full"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-3 border-t border-[#774D78]/10 space-y-0.5 flex-1 flex flex-col justify-start">
                <p className="font-serif text-sm font-semibold text-[#2A1C2B] leading-snug line-clamp-1">
                  {snap.title}
                </p>
                <p className="text-[11px] text-[#635364] line-clamp-2 leading-snug">
                  {snap.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Real Spaces & Day Rhythm (Zero AI Photos) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 space-y-8 sm:space-y-10">
        <ScrollReveal className="border-t border-[#774D78]/15 pt-12 sm:pt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Our Space</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
              From morning chai to family dinner
            </h2>
          </div>

          <Link
            href="/our-story"
            className="interactive-btn font-menu inline-flex items-center gap-2 rounded-lg bg-[#774D78]/10 px-4 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            Read our story
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        {/* Real High-Res Space Pair — Exact Uncropped Proportions + Hover Enlarge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          <figure className="lg:col-span-7 space-y-3">
            <div className="interactive-media relative aspect-square max-h-[480px] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
              <EditorialImage
                src="/katha-photos/dining-hall.webp"
                alt="Main dining room inside Katha by Bhupa Greens with long wooden tables and warm chandeliers"
                sizes="(max-width: 1024px) 100vw, 58vw"
                containerClassName="relative w-full h-full"
                className="object-contain"
              />
            </div>
            <figcaption className="text-xs text-[#635364] px-0.5">
              Spacious family tables and warm chandeliers in our main dining room
            </figcaption>
          </figure>

          <figure className="lg:col-span-5 space-y-3 max-w-md mx-auto w-full lg:max-w-none">
            <div className="interactive-media relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
              <EditorialImage
                src="/katha-photos/bookshelf-corner.webp"
                alt="Bookshelf corner inside Katha filled with books beside quiet cafe tables"
                sizes="(max-width: 1024px) 100vw, 42vw"
                containerClassName="relative w-full h-full"
                className="object-contain"
              />
            </div>
            <figcaption className="text-xs text-[#635364] px-0.5">
              Pick a book from the shelf while waiting for your chai or coffee
            </figcaption>
          </figure>
        </div>

        {/* Day Rhythm Strip */}
        <ScrollReveal>
          <div className="glass-sage rounded-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#774D78]/14">
            <div className="p-6 flex items-start gap-4">
              <Sunrise className="h-5 w-5 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#635364]">Morning</p>
                <h3 className="font-serif text-xl font-medium text-[#2A1C2B]">
                  Chai, Filter Coffee &amp; Dosa
                </h3>
                <p className="text-xs leading-relaxed text-[#635364]">
                  Hot crisp dosas, fresh ginger chai, and calm stops along the highway.
                </p>
              </div>
            </div>

            <div className="p-6 flex items-start gap-4">
              <Sun className="h-5 w-5 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#635364]">Afternoon</p>
                <h3 className="font-serif text-xl font-medium text-[#2A1C2B]">
                  Cool Drinks &amp; Easy Snacks
                </h3>
                <p className="text-xs leading-relaxed text-[#635364]">
                  Chilled refreshers, cheesy toasted sandwiches, and crispy bites to share.
                </p>
              </div>
            </div>

            <div className="p-6 flex items-start gap-4">
              <Moon className="h-5 w-5 text-[#774D78] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#635364]">Evening</p>
                <h3 className="font-serif text-xl font-medium text-[#2A1C2B]">
                  Biryani Handis &amp; Family Dinners
                </h3>
                <p className="text-xs leading-relaxed text-[#635364]">
                  Comforting Indian curries, smoky tandoor plates, and warm sweets.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. Campus Arrival & Location Spread */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 space-y-6 sm:space-y-8">
        <div className="border-t border-[#774D78]/15 pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ScrollReveal className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-[#774D78]">
              <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Finding Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
              Inside Bhupa Greens, Darbhanga
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#635364]">
              We are right along the NH27 / NH57 route in Shahpur. Drive through the Bhupa Greens gate and follow the lit palm walkway straight to our entrance.
            </p>

            <div className="space-y-3 border-t border-[#774D78]/15 pt-5 text-sm">
              <p className="text-xs text-[#635364]">
                Want to see what guests say before visiting? Check our reviews and directions on Google Maps.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#2A1C2B] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#774D78]"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Open Google Maps
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <Link
                  href="/find-us"
                  className="interactive-btn inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#2A1C2B] hover:text-[#774D78]"
                >
                  Hours &amp; enquiry form
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Real Arrival Photo Pair — Portrait Boxes + Hover Enlarge */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <figure className="space-y-2.5">
              <div className="interactive-media relative aspect-[5/7] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
                <EditorialImage
                  src="/katha-photos/exterior-evening.webp"
                  alt="Evening exterior entrance of Katha by Bhupa Greens with warm lights"
                  sizes="(max-width: 768px) 100vw, 28vw"
                  containerClassName="relative w-full h-full"
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-[#635364]">
                Our terracotta entrance glowing after sunset
              </figcaption>
            </figure>

            <figure className="space-y-2.5">
              <div className="interactive-media relative aspect-[5/7] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
                <EditorialImage
                  src="/katha-photos/campus-walkway.webp"
                  alt="Lit palm-lined pathway leading toward Katha inside the Bhupa Greens campus"
                  sizes="(max-width: 768px) 100vw, 28vw"
                  containerClassName="relative w-full h-full"
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-[#635364]">
                Palm-lined walkway inside Bhupa Greens
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 6B. Interactive 3D Hexed-Polygon Globe -> Circular Google Maps Transition */}
      <KathaGlobeMapSection site={site} variant="home" />

      {/* 7. The Katha Journal */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 space-y-8 sm:space-y-10">
        <ScrollReveal className="border-t border-[#774D78]/15 pt-12 sm:pt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <Feather className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">The Katha Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
              Notes from our kitchen
            </h2>
          </div>

          <Link
            href="/journal"
            className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg bg-[#774D78]/10 px-4 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            All stories
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {featuredPosts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full space-y-4">
              <Link
                href={`/journal/${post.slug}`}
                className="interactive-media relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#774D78]/16 block bg-[#F1E3C4]/45 shrink-0"
              >
                <EditorialImage
                  src={post.featuredImage}
                  alt={post.featuredAlt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  containerClassName="relative w-full h-full"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </Link>

              <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#635364]">
                    <span className="font-medium text-[#774D78]">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium leading-snug text-[#2A1C2B] group-hover:text-[#774D78] transition-colors">
                    <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-[#635364] leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/journal/${post.slug}`}
                  className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-[#2A1C2B] group-hover:text-[#774D78] transition-colors"
                >
                  Read story
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Friendly Planning Strip (Book Table on Call + WhatsApp Enquiry — No Phone Exposed) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8">
        <ScrollReveal>
          <div className="glass-panel rounded-2xl p-5 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2 max-w-xl">
              <span className="section-eyebrow text-[#774D78] block">
                Plan Your Visit
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
                Coming over with family or friends?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#635364]">
                Call or message us on WhatsApp to reserve a table or check timings — especially on busy wedding or campus event days.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={site.phoneHref}
                className="interactive-btn inline-flex items-center justify-center gap-2 rounded-lg bg-[#774D78] px-5 py-3 text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#5D3A5E]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Book Table on Call
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-btn inline-flex items-center justify-center gap-2 rounded-lg border border-[#774D78]/25 bg-white/85 px-5 py-3 text-sm font-medium text-[#2A1C2B] whitespace-nowrap shrink-0 hover:border-[#774D78] hover:text-[#774D78]"
              >
                <FaWhatsapp className="h-[18px] w-[18px] text-[#25D366]" aria-hidden="true" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
