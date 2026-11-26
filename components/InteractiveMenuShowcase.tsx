'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, UtensilsCrossed } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import EditorialImage from '@/components/EditorialImage';
import CategoryIcon from '@/components/CategoryIcon';
import { useMenuBookModal } from '@/components/MenuBookModalContext';
import type { MenuCategory } from '@/lib/types/wordpress';

interface InteractiveMenuShowcaseProps {
  categories: MenuCategory[];
}

export default function InteractiveMenuShowcase({
  categories,
}: InteractiveMenuShowcaseProps) {
  const { openMenuBook } = useMenuBookModal();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex] ?? categories[0];

  if (!activeCategory) return null;

  const isTallMorePhoto =
    activeCategory.heroImage.includes('space-13') ||
    activeCategory.heroImage.includes('food-21');
  const isSquareMorePhoto = activeCategory.heroImage.includes('food-08');

  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl shadow-[#2A1C2B]/[0.06] space-y-5 sm:space-y-6">
      {/* Exclusive Box Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#774D78]/15 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#774D78] text-white shrink-0">
            <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-menu text-sm font-semibold text-[#2A1C2B]">
              The Katha Menu
            </p>
            <p className="text-xs text-[#635364]">
              Hover or tap any section to preview and explore its dishes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openMenuBook(activeCategory.slug)}
          className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg bg-[#774D78] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5D3A5E] whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          View Menu
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Exclusive Menu Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Interactive Chapter Index in Dedicated Menu Font */}
        <div className="lg:col-span-7 divide-y divide-[#774D78]/12 border-y border-[#774D78]/14">
          {categories.map((category, index) => {
            const isActive = index === activeIndex;
            const chapterNum = String(index + 1).padStart(2, '0');

            return (
              <div
                key={category.slug}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`interactive-menu-row group rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F1E3C4]/55 shadow-sm'
                    : 'hover:bg-white/75'
                }`}
              >
                <Link
                  href={`/menu/${category.slug}`}
                  className="flex items-center justify-between gap-4 px-3.5 sm:px-5 py-4 sm:py-5"
                >
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
                    <span className="font-menu text-xs font-semibold text-[#635364] tabular-nums pt-1 sm:pt-0 w-6 shrink-0">
                      {chapterNum}
                    </span>

                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 group-hover:scale-110 ${
                        isActive
                          ? 'border-[#774D78]/35 bg-[#774D78] text-white'
                          : 'border-[#774D78]/18 bg-white/80 text-[#774D78] group-hover:bg-[#F1E3C4]/65'
                      }`}
                    >
                      <CategoryIcon slug={category.slug} className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 space-y-0.5">
                      <h3
                        className={`font-menu text-base sm:text-lg font-semibold leading-snug transition-colors ${
                          isActive
                            ? 'text-[#774D78]'
                            : 'text-[#2A1C2B] group-hover:text-[#774D78]'
                        }`}
                      >
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#635364] line-clamp-1">
                        {category.shortSummary}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-[#774D78] translate-x-0.5 -translate-y-0.5 scale-110'
                        : 'text-[#635364] group-hover:text-[#774D78] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right: Compact Crisp Photo Preview Frame (Respects Low-Res Photos & Enlarges Smoothly on Hover) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="interactive-media overflow-hidden rounded-2xl border border-[#774D78]/18 bg-white/85 shadow-sm">
            <div className="flex items-center justify-center bg-[#F1E3C4]/45 px-4 py-5">
              <div
                className={`relative w-full overflow-hidden rounded-xl border border-[#774D78]/15 bg-[#FBF7EE] shadow-sm ${
                  isTallMorePhoto
                    ? 'max-w-[205px] aspect-[9/16]'
                    : isSquareMorePhoto
                      ? 'max-w-[255px] aspect-square'
                      : 'max-w-[275px] aspect-[6/5]'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory.slug}
                    initial={{ opacity: 0.25, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.25, scale: 0.97 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <EditorialImage
                      src={activeCategory.heroImage}
                      alt={activeCategory.heroAlt}
                      sizes="280px"
                      containerClassName="relative w-full h-full"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-[#774D78]/12 bg-[#FBF7EE]/95 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#774D78]">
                <CategoryIcon slug={activeCategory.slug} className="h-3.5 w-3.5" />
                <span className="font-menu text-[11px]">Menu Section</span>
              </div>
              <p className="font-menu text-xl sm:text-2xl font-semibold leading-tight text-[#2A1C2B]">
                {activeCategory.name}
              </p>
              <p className="text-sm leading-relaxed text-[#635364]">
                {activeCategory.description}
              </p>
              <Link
                href={`/menu/${activeCategory.slug}`}
                className="interactive-btn font-menu inline-flex items-center gap-2 mt-1 rounded-lg bg-[#774D78]/10 px-3.5 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white"
              >
                Open {activeCategory.name}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
