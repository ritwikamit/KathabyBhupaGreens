import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/data/katha-data';

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Katha by Bhupa Greens"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#FBF7EE] px-6"
    >
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <Image
          src={SITE_CONFIG.logos.katha}
          alt="Katha by Bhupa Greens"
          width={320}
          height={150}
          priority
          referrerPolicy="no-referrer"
          className="h-24 sm:h-32 md:h-36 w-auto object-contain"
        />

        <p className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-[#774D78] inline-flex items-baseline">
          <span>Loading</span>
          <span className="loading-dot-1 inline-block ml-0.5">.</span>
          <span className="loading-dot-2 inline-block">.</span>
          <span className="loading-dot-3 inline-block">.</span>
        </p>
      </div>
    </div>
  );
}
