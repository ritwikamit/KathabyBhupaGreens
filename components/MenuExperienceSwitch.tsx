'use client';

import { useState } from 'react';
import { BookOpen, Maximize2, Search } from 'lucide-react';
import MenuBook from '@/components/MenuBook';
import MenuExplorer from '@/components/MenuExplorer';
import OpenMenuBookButton from '@/components/OpenMenuBookButton';
import type { MenuCategory, MenuItem } from '@/lib/types/wordpress';

interface MenuExperienceSwitchProps {
  categories: MenuCategory[];
  items: MenuItem[];
  initialCategorySlug?: string;
}

export default function MenuExperienceSwitch({
  categories,
  items,
  initialCategorySlug,
}: MenuExperienceSwitchProps) {
  const [mode, setMode] = useState<'book' | 'explorer'>('book');

  return (
    <div className="space-y-7 sm:space-y-9">
      {/* Mode Switcher Bar: Book View (Page by Page) vs Full Searchable List */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Choose menu reading layout"
          className="inline-flex w-full sm:w-auto items-center rounded-xl border border-[#774D78]/20 bg-white/85 p-1 gap-1 shadow-sm"
        >
          <button
            type="button"
            onClick={() => setMode('book')}
            className={`font-menu flex-1 sm:flex-initial inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              mode === 'book'
                ? 'bg-[#774D78] text-white shadow-sm'
                : 'text-[#635364] hover:text-[#2A1C2B]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Menu Book
          </button>
          <button
            type="button"
            onClick={() => setMode('explorer')}
            className={`font-menu flex-1 sm:flex-initial inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              mode === 'explorer'
                ? 'bg-[#774D78] text-white shadow-sm'
                : 'text-[#635364] hover:text-[#2A1C2B]'
            }`}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search &amp; Filter
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-[#635364]">
            {mode === 'book'
              ? 'Flip page by page through every chapter of the Katha menu'
              : 'Search any dish or filter by Vegetarian / Non-Vegetarian'}
          </p>
          <OpenMenuBookButton
            categorySlug={initialCategorySlug}
            className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            Full-Screen Book
          </OpenMenuBookButton>
        </div>
      </div>

      {mode === 'book' ? (
        <MenuBook
          categories={categories}
          items={items}
          initialCategorySlug={initialCategorySlug}
        />
      ) : (
        <div className="glass-panel rounded-3xl p-4 sm:p-8 lg:p-10 shadow-lg shadow-[#2A1C2B]/[0.05]">
          <MenuExplorer categories={categories} items={items} />
        </div>
      )}
    </div>
  );
}
