import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-24 text-center">
      <div className="glass-panel rounded-3xl p-10 sm:p-14 space-y-6">
        <p className="section-eyebrow text-[#774D78]">
          Page Not Found
        </p>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          We could not find that page
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#635364]">
          The page you are looking for may have moved or is no longer listed on the menu. You can browse the full menu or head back to the home page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-6 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] transition-colors"
          >
            Browse the Menu
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[#774D78]/20 bg-white/85 px-6 py-3 text-sm font-medium text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
