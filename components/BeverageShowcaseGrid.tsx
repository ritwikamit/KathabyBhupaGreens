'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import EditorialImage from '@/components/EditorialImage';

export interface BeverageCardItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
}

export default function BeverageShowcaseGrid({
  cards,
}: {
  cards: BeverageCardItem[];
}) {
  const [activeCard, setActiveCard] = useState<BeverageCardItem | null>(null);

  useEffect(() => {
    if (!activeCard) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCard(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCard]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActiveCard(card)}
            aria-label={`View enlarged photo of ${card.title}`}
            className="interactive-media group text-left rounded-xl border border-[#774D78]/16 bg-white/75 backdrop-blur-sm overflow-hidden flex flex-col hover:border-[#774D78]/45"
          >
            <div className="relative aspect-[9/14] w-full bg-[#F1E3C4]/45 overflow-hidden">
              <EditorialImage
                src={card.src}
                alt={card.alt}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                containerClassName="relative w-full h-full"
                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-3 space-y-0.5 border-t border-[#774D78]/10 w-full">
              <p className="font-menu text-xs font-semibold text-[#2A1C2B] leading-snug group-hover:text-[#774D78] transition-colors">
                {card.title}
              </p>
              <p className="text-xs text-[#635364]">{card.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {activeCard &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeCard.title}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1F1520]/82 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setActiveCard(null)}
          >
            <div
              className="relative w-full max-w-md max-h-[90svh] flex flex-col overflow-hidden rounded-2xl border border-[#AF8EB1]/30 bg-[#FBF7EE] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveCard(null)}
                aria-label="Close enlarged beverage photo"
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1520]/80 text-white hover:bg-[#774D78] transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative w-full h-[58svh] sm:h-[62svh] max-h-[540px] bg-[#F1E3C4]/45">
                <EditorialImage
                  src={activeCard.src}
                  alt={activeCard.alt}
                  sizes="(max-width: 768px) 92vw, 440px"
                  containerClassName="relative w-full h-full"
                  className="object-contain p-3"
                />
              </div>

              <div className="p-5 border-t border-[#774D78]/15 space-y-1 text-center">
                <p className="text-xs font-semibold text-[#774D78]">
                  {activeCard.subtitle}
                </p>
                <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                  {activeCard.title}
                </h3>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
