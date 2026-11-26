import type { ReactNode } from 'react';
import EditorialImage from '@/components/EditorialImage';

interface PageHeroBannerProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function PageHeroBanner({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  icon,
}: PageHeroBannerProps) {
  return (
    <header className="relative isolate w-full overflow-hidden rounded-2xl border border-[#774D78]/22 shadow-xl shadow-[#2A1C2B]/12 min-h-[210px] sm:min-h-[245px] lg:min-h-[265px] flex items-center">
      {/* Real Katha Background Photo with Subtle Dark Fade */}
      <div className="absolute inset-0 z-0">
        <EditorialImage
          src={imageSrc}
          alt={imageAlt}
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          containerClassName="relative w-full h-full"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#1F1520]/84 via-[#1F1520]/66 to-[#1F1520]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#1F1520]/55 via-transparent to-[#1F1520]/25"
        />
      </div>

      {/* Text Content Over Compact Hero Banner */}
      <div className="relative z-10 w-full px-6 sm:px-10 py-8 sm:py-10 max-w-2xl space-y-3 text-white">
        <div className="flex items-center gap-2 text-[#F1E3C4]">
          {icon}
          <span className="section-eyebrow text-[#F1E3C4]">{eyebrow}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium leading-[1.08] tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#FBF7EE]/90 max-w-xl">
          {description}
        </p>
      </div>
    </header>
  );
}
