import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  HelpCircle,
  Phone,
  UtensilsCrossed,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import OpenMenuBookButton from '@/components/OpenMenuBookButton';
import StructuredData from '@/components/StructuredData';
import { getAeoFaqs, getSiteConfig } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers to common questions about visiting Katha by Bhupa Greens in Darbhanga, including location, hours, menu sections, and table enquiries.',
};

const EXTRA_FAQS = [
  {
    question: 'Do you serve both vegetarian and non-vegetarian dishes?',
    answer:
      'Yes. Our menu offers vegetarian and non-vegetarian sections across Indian Favourites, Biryani & Rice, Korean Bites, and Snacks, alongside vegetarian South Indian dishes, beverages, and desserts. Use the dietary filter on our Menu page to browse easily.',
  },
  {
    question: 'Are beverages and coolers available all day?',
    answer:
      'Yes. Masala chai, ginger chai, butter chai, hot chocolate, filter coffee, cold coffee, and Sparkling Stories refreshers are served through the day. Seasonal shakes depend on fresh fruit availability.',
  },
  {
    question: 'Can I visit Katha while travelling on NH27 or NH57?',
    answer:
      'Yes. Katha sits right off the NH27 / NH57 corridor inside the Bhupa Greens campus in Shahpur, Darbhanga, making it a convenient stop for families and highway travellers.',
  },
];

export default function FaqPage() {
  const site = getSiteConfig();
  const baseFaqs = getAeoFaqs();
  const allFaqs = [...baseFaqs, ...EXTRA_FAQS];

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-10 sm:pt-14 space-y-14">
      <StructuredData faqs={allFaqs} />

      <header className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-[#774D78]">
          <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Visitor Information</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          Frequently Asked Questions
        </h1>
        <p className="text-base leading-relaxed text-[#635364]">
          Practical answers before you visit Katha by Bhupa Greens in Darbhanga. If you need help with group dining or campus event timings, reach our desk directly.
        </p>
      </header>

      {/* Clean Hairline FAQ List */}
      <section aria-label="Frequently asked questions" className="glass-panel rounded-2xl px-6 sm:px-9 divide-y divide-[#774D78]/14">
        {allFaqs.map((faq, idx) => (
          <details
            key={faq.question}
            open={idx < 2}
            className="group py-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl sm:text-2xl font-medium text-[#2A1C2B] hover:text-[#774D78] transition-colors">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#774D78]/20 text-base font-sans text-[#774D78] transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#635364] max-w-3xl pr-8">
              {faq.answer}
            </p>
          </details>
        ))}
      </section>

      {/* Quick Action Strip (No Exposed Phone Number) */}
      <section className="glass-sage rounded-2xl p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="section-eyebrow text-[#774D78] block">
            Still Have a Question?
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
            Reach the Katha dining desk
          </h2>
          <p className="text-sm text-[#2A1C2B]/80 leading-relaxed">
            Book a table on call, start a WhatsApp enquiry, or send a message through our Find Us page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5D3A5E] whitespace-nowrap transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Book Table on Call
          </a>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#774D78]/25 bg-white/85 px-5 py-2.5 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] whitespace-nowrap transition-colors"
          >
            <FaWhatsapp className="h-[18px] w-[18px] text-[#25D366]" aria-hidden="true" />
            WhatsApp Enquiry
          </a>
        </div>
      </section>

      {/* Helpful Links */}
      <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#2A1C2B]">
        <OpenMenuBookButton
          className="inline-flex items-center gap-1.5 hover:text-[#774D78] transition-colors"
        >
          <UtensilsCrossed className="h-4 w-4 text-[#774D78]" aria-hidden="true" />
          Browse the Menu
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </OpenMenuBookButton>
        <Link
          href="/find-us"
          className="inline-flex items-center gap-1.5 hover:text-[#774D78] transition-colors"
        >
          <Compass className="h-4 w-4 text-[#774D78]" aria-hidden="true" />
          Directions &amp; Enquiry Form
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
