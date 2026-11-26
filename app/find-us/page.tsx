import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Compass,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';
import KathaGlobeMapSection from '@/components/KathaGlobeMapSection';
import PageHeroBanner from '@/components/PageHeroBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Find Katha by Bhupa Greens',
  description:
    'Find Katha inside the Bhupa Greens campus in Darbhanga. Get directions, check opening hours, book a table on call, or message us on WhatsApp.',
};

export default function FindUsPage() {
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-7 sm:pt-10 space-y-16 sm:space-y-20">
      {/* Compact Page Hero Banner from pages hero/findus.jpg */}
      <PageHeroBanner
        imageSrc="/katha-photos/pages-hero/findus.jpg"
        imageAlt="Katha bistro counter opening out toward the sunlit green lawns of Bhupa Greens"
        icon={<Compass className="h-4 w-4 shrink-0" aria-hidden="true" />}
        eyebrow="Location & Contact"
        title="Find Katha by Bhupa Greens"
        description="We are inside the Bhupa Greens campus in Shahpur, Darbhanga. Follow our Google Maps pin right to our door, or reach out before you visit."
      />

      {/* Interactive 3D Hexed-Polygon Globe with Seamless Circular Google Maps Transition */}
      <KathaGlobeMapSection site={site} variant="find-us" />

      {/* Main Split: Details & Directions on Left, Enquiry Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          {/* Contact Details Panel (No Exposed Phone Digits) */}
          <ScrollReveal className="glass-panel rounded-xl p-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
              Visit &amp; timings
            </h2>

            <dl className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin
                  className="h-4 w-4 text-[#774D78] mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <dt className="font-medium text-[#2A1C2B]">Address</dt>
                  <dd className="text-[#635364] leading-relaxed">
                    {site.address}
                  </dd>
                  <dd className="text-xs text-[#635364] tabular-nums">
                    Map pin: {site.coordinates.lat}, {site.coordinates.lng}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail
                  className="h-4 w-4 text-[#774D78] mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <dt className="font-medium text-[#2A1C2B]">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[#2A1C2B] hover:text-[#774D78] transition-colors break-all"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock
                  className="h-4 w-4 text-[#774D78] mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <dt className="font-medium text-[#2A1C2B]">Opening hours</dt>
                  <dd className="text-[#2A1C2B] tabular-nums">{site.hours}</dd>
                  <dd className="text-xs text-[#635364] leading-relaxed">
                    {site.hoursNote}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Direct Table Booking & Directions Actions (Phone Number Hidden) */}
            <div className="pt-4 border-t border-[#774D78]/12 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={site.phoneHref}
                  className="interactive-btn inline-flex items-center justify-center gap-2 rounded-lg bg-[#774D78] px-4 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] whitespace-nowrap"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Book Table on Call
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-btn inline-flex items-center justify-center gap-2 rounded-lg border border-[#774D78]/25 bg-white/90 px-4 py-3 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] whitespace-nowrap"
                >
                  <FaWhatsapp className="h-[18px] w-[18px] text-[#25D366]" aria-hidden="true" />
                  WhatsApp Enquiry
                </a>
              </div>

              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-btn inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#774D78]/20 bg-[#F1E3C4]/45 px-5 py-2.5 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78]"
              >
                <Compass className="h-4 w-4 text-[#774D78]" aria-hidden="true" />
                Open Google Maps
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Contact Form */}
        <ScrollReveal delay={0.1} className="lg:col-span-7">
          <ContactForm />
        </ScrollReveal>
      </div>

      {/* Dedicated FAQ Page Callout */}
      <ScrollReveal>
        <section className="glass-panel rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Quick Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
              Have a quick question before coming over?
            </h2>
            <p className="text-sm text-[#635364] leading-relaxed">
              Check our FAQ page for simple answers about directions, opening hours, food choices, and family tables.
            </p>
          </div>

          <Link
            href="/faq"
            className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            View FAQ Page
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </ScrollReveal>
    </div>
  );
}
