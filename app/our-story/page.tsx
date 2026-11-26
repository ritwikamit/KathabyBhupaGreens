import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Phone,
  PhoneCall,
  Utensils,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import EditorialImage from '@/components/EditorialImage';
import OpenMenuBookButton from '@/components/OpenMenuBookButton';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Learn about Katha by Bhupa Greens, our family dining room and cafe inside the Bhupa Greens campus in Darbhanga, Bihar.',
};

export default function OurStoryPage() {
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 sm:pt-14 space-y-20">
      {/* Opening Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <ScrollReveal className="lg:col-span-6 flex flex-col justify-between space-y-8 py-2">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[#774D78]">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
              Welcome to Katha by Bhupa Greens
            </h1>
            <p className="text-base leading-relaxed text-[#635364]">
              Tucked inside the calm Bhupa Greens campus in Darbhanga, Katha is a warm, easygoing place to sit down for a full meal, catch up with friends over chai or coffee, or take a relaxing break while driving along NH27 and NH57.
            </p>
            <p className="text-base leading-relaxed text-[#635364]">
              Our kitchen cooks Indian classics, tandoor starters, fragrant biryani, crisp South Indian dosas, Korean-style bites, sandwiches, fresh drinks, and homemade sweets — so everyone at the table finds something they love.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              href={site.phoneHref}
              className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#5D3A5E]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Book Table on Call
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-btn inline-flex items-center gap-2 rounded-lg border border-[#774D78]/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-[#2A1C2B] whitespace-nowrap shrink-0 hover:border-[#774D78] hover:text-[#774D78]"
            >
              <FaWhatsapp className="h-[18px] w-[18px] text-[#25D366]" aria-hidden="true" />
              WhatsApp Enquiry
            </a>
            <OpenMenuBookButton
              className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#2A1C2B] hover:text-[#774D78]"
            >
              Browse Menu
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </OpenMenuBookButton>
          </div>
        </ScrollReveal>

        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="interactive-media relative aspect-square w-full max-w-[460px] overflow-hidden rounded-xl border border-[#774D78]/18 bg-[#F1E3C4]/35">
            <EditorialImage
              src="/katha-photos/counter-bistro.jpg"
              alt="Counter and coffee bar inside Katha by Bhupa Greens looking out to the campus garden"
              priority
              sizes="(max-width: 1024px) 100vw, 460px"
              containerClassName="relative w-full h-full"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Three Simple Pillars */}
      <ScrollReveal>
        <section className="border-y border-[#774D78]/15 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#774D78]/15">
          <div className="py-8 md:pr-8 space-y-3">
            <div className="flex items-center gap-2.5 text-[#774D78]">
              <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">01. The Place</span>
            </div>
            <h2 className="text-2xl font-medium text-[#2A1C2B]">
              Part of Bhupa Greens
            </h2>
            <p className="text-sm leading-relaxed text-[#635364]">
              Surrounded by greenery inside Bhupa Greens in Shahpur, Katha is an easy, peaceful stop for Darbhanga families and highway travellers alike.
            </p>
          </div>

          <div className="py-8 md:px-8 space-y-3">
            <div className="flex items-center gap-2.5 text-[#774D78]">
              <Utensils className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">02. The Food</span>
            </div>
            <h2 className="text-2xl font-medium text-[#2A1C2B]">
              Made for sharing
            </h2>
            <p className="text-sm leading-relaxed text-[#635364]">
              From full family dinners with dal, paneer, and biryani to quick afternoon breaks over masala chai, filter coffee, and hot dosas.
            </p>
          </div>

          <div className="py-8 md:pl-8 space-y-3">
            <div className="flex items-center gap-2.5 text-[#774D78]">
              <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">03. Warm Service</span>
            </div>
            <h2 className="text-2xl font-medium text-[#2A1C2B]">
              Always happy to help
            </h2>
            <p className="text-sm leading-relaxed text-[#635364]">
              Planning a birthday dinner or stopping by on a wedding day? Just call or WhatsApp our desk and we will help you sort out your table.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Real Bookshelf & Main Dining Room Pair (Zero AI Photos) */}
      <section className="space-y-8">
        <ScrollReveal className="max-w-xl space-y-2">
          <p className="section-eyebrow text-[#774D78]">
            Books &amp; Good Food
          </p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#2A1C2B]">
            A cozy corner to slow down
          </h2>
          <p className="text-sm sm:text-base text-[#635364]">
            Katha means story. Inside, our shelves of books, framed portraits, and warm wooden tables invite you to linger over good food and easy conversation.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          <figure className="lg:col-span-5 space-y-3 max-w-md mx-auto w-full lg:max-w-none">
            <div className="interactive-media relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
              <EditorialImage
                src="/katha-photos/bookshelf-corner.jpg"
                alt="Curated bookshelf corner inside Katha filled with books"
                sizes="(max-width: 1024px) 100vw, 42vw"
                containerClassName="relative w-full h-full"
                className="object-contain"
              />
            </div>
            <figcaption className="space-y-1">
              <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                The Reading Shelf
              </h3>
              <p className="text-sm text-[#635364] leading-relaxed">
                Pick a book off the shelf beside our quiet tables while waiting for your chai or filter coffee.
              </p>
            </figcaption>
          </figure>

          <figure className="lg:col-span-7 space-y-3">
            <div className="interactive-media relative aspect-square max-h-[480px] w-full overflow-hidden rounded-xl border border-[#774D78]/16 bg-[#F1E3C4]/35">
              <EditorialImage
                src="/katha-photos/dining-hall.jpg"
                alt="Main dining room inside Katha by Bhupa Greens with long wooden tables and warm chandeliers"
                sizes="(max-width: 1024px) 100vw, 58vw"
                containerClassName="relative w-full h-full"
                className="object-contain"
              />
            </div>
            <figcaption className="space-y-1">
              <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                Room for the Whole Family
              </h3>
              <p className="text-sm text-[#635364] leading-relaxed">
                Bright daytime light, soft evening chandeliers, and comfortable seating for quiet lunches or big family dinners.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Parent Venue Note */}
      <ScrollReveal>
        <section className="glass-sage rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
              Visiting Bhupa Greens for an event?
            </h2>
            <p className="text-sm leading-relaxed text-[#2A1C2B]/80">
              For restaurant tables, just tap Book Table on Call or WhatsApp Enquiry. For weddings or lawn bookings at Bhupa Greens, visit their main website.
            </p>
          </div>
          <a
            href={site.parentVenueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-btn inline-flex items-center gap-2 rounded-lg border border-[#774D78]/22 bg-white px-5 py-2.5 text-sm font-medium text-[#2A1C2B] whitespace-nowrap shrink-0 hover:border-[#774D78] hover:text-[#774D78]"
          >
            Visit Bhupa Greens
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </ScrollReveal>
    </div>
  );
}
