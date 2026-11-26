'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowRight, Flame, Leaf, Search, X } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import EditorialImage from '@/components/EditorialImage';
import type { DietaryIndicator, MenuCategory, MenuItem } from '@/lib/types/wordpress';

interface MenuExplorerProps {
  categories: MenuCategory[];
  items: MenuItem[];
  lockedCategorySlug?: string;
}

type DietaryFilter = 'all' | 'veg' | 'non-veg';

function dietaryLabel(dietary: DietaryIndicator): string | null {
  if (dietary === 'veg') return 'Vegetarian';
  if (dietary === 'non-veg') return 'Non-Vegetarian';
  return null;
}

export default function MenuExplorer({
  categories,
  items,
  lockedCategorySlug,
}: MenuExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    lockedCategorySlug || 'all'
  );
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [query, setQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!previewItem) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewItem(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [previewItem]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (lockedCategorySlug && item.categorySlug !== lockedCategorySlug) {
        return false;
      }
      if (
        !lockedCategorySlug &&
        selectedCategory !== 'all' &&
        item.categorySlug !== selectedCategory
      ) {
        return false;
      }
      if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) {
        return false;
      }
      if (q) {
        const hay = `${item.name} ${item.description} ${item.subcategory}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [items, lockedCategorySlug, selectedCategory, dietaryFilter, query]);

  const groupedByCategory = useMemo(() => {
    const activeCategories = lockedCategorySlug
      ? categories.filter((c) => c.slug === lockedCategorySlug)
      : selectedCategory === 'all'
        ? categories
        : categories.filter((c) => c.slug === selectedCategory);

    return activeCategories
      .map((category) => {
        const catItems = filteredItems.filter(
          (i) => i.categorySlug === category.slug
        );
        const subMap = new Map<string, MenuItem[]>();
        for (const item of catItems) {
          const key = item.subcategory || 'Selection';
          const list = subMap.get(key) || [];
          list.push(item);
          subMap.set(key, list);
        }
        return {
          category,
          totalCount: catItems.length,
          subgroups: Array.from(subMap.entries()),
        };
      })
      .filter((group) => group.totalCount > 0);
  }, [categories, filteredItems, lockedCategorySlug, selectedCategory]);

  const resetFilters = () => {
    if (!lockedCategorySlug) setSelectedCategory('all');
    setDietaryFilter('all');
    setQuery('');
  };

  return (
    <div className="space-y-12">
      {/* Hairline Frosted Filter & Search Bar */}
      <div className="glass-panel rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#635364]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, e.g. biryani, dosa, chai..."
              aria-label="Search menu items"
              className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 py-2.5 pl-10 pr-10 text-sm text-[#2A1C2B] placeholder:text-[#635364] focus:border-[#774D78] focus:bg-white transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#635364] hover:text-[#2A1C2B]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Dietary Segmented Control */}
          <div
            role="group"
            aria-label="Filter by dietary preference"
            className="inline-flex items-center rounded-lg border border-[#774D78]/15 bg-[#F1E3C4]/45 p-1 self-start lg:self-auto"
          >
            {(
              [
                { value: 'all', label: 'All Dishes' },
                { value: 'veg', label: 'Vegetarian' },
                { value: 'non-veg', label: 'Non-Vegetarian' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDietaryFilter(opt.value)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  dietaryFilter === opt.value
                    ? 'bg-[#2A1C2B] text-white'
                    : 'text-[#635364] hover:text-[#2A1C2B]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Category Tabs in Menu Font */}
        {!lockedCategorySlug && (
          <div className="pt-4 border-t border-[#774D78]/12">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`font-menu rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#774D78] text-white'
                    : 'bg-white/80 text-[#2A1C2B]/80 hover:bg-[#F1E3C4]/50 border border-[#774D78]/15'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`font-menu inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#774D78] text-white'
                      : 'bg-white/80 text-[#2A1C2B]/80 hover:bg-[#F1E3C4]/50 border border-[#774D78]/15'
                  }`}
                >
                  <CategoryIcon slug={cat.slug} className="h-3.5 w-3.5" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Area */}
      {groupedByCategory.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center space-y-4">
          <h3 className="text-2xl font-medium text-[#2A1C2B]">
            No matching dishes found
          </h3>
          <p className="text-sm text-[#635364] max-w-md mx-auto">
            Try clearing your search or switching the dietary filter to browse the rest of the Katha menu.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5D3A5E] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {groupedByCategory.map(({ category, subgroups }) => (
            <section
              key={category.slug}
              aria-labelledby={`menu-cat-${category.slug}`}
              className="space-y-8"
            >
              {/* Category Header with Icon in Menu Font */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[#774D78]/18 pb-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#774D78]/20 bg-[#F1E3C4]/55 text-[#774D78]">
                      <CategoryIcon slug={category.slug} className="h-4 w-4" />
                    </span>
                    <h2
                      id={`menu-cat-${category.slug}`}
                      className="font-menu text-2xl sm:text-3xl font-semibold tracking-tight text-[#2A1C2B]"
                    >
                      {category.name}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-[#635364]">
                    {category.description}
                  </p>
                </div>

                {!lockedCategorySlug && (
                  <Link
                    href={`/menu/${category.slug}`}
                    className="interactive-btn font-menu inline-flex items-center gap-1.5 rounded-lg bg-[#774D78]/10 px-3.5 py-2 text-xs font-semibold text-[#774D78] hover:bg-[#774D78] hover:text-white whitespace-nowrap shrink-0"
                  >
                    Open section
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {/* Subgroups */}
              <div className="space-y-10">
                {subgroups.map(([subcategoryName, subItems]) => (
                  <div key={subcategoryName} className="space-y-4">
                    <h3 className="font-menu text-xs font-semibold text-[#774D78]">
                      {subcategoryName}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                      {subItems.map((item) => {
                        const diet = dietaryLabel(item.dietary);
                        return (
                          <article
                            key={item.id}
                            className="interactive-menu-row group flex items-start justify-between gap-4 border-b border-[#774D78]/12 py-5 px-2.5 -mx-2.5 rounded-xl hover:bg-[#F1E3C4]/30"
                          >
                            <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                              <div className="flex items-baseline justify-between gap-4">
                                <h4 className="font-menu text-base sm:text-lg font-semibold text-[#2A1C2B] group-hover:text-[#774D78] transition-colors">
                                  {item.name}
                                </h4>
                                {item.price !== null && (
                                  <span className="font-sans text-sm font-semibold text-[#2A1C2B] tabular-nums shrink-0">
                                    ₹{item.price}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm leading-relaxed text-[#635364]">
                                {item.description}
                              </p>

                              {/* Quiet unboxed metadata with crisp semantic icon */}
                              {(diet || item.seasonal) && (
                                <div className="flex items-center gap-2 pt-1 text-xs text-[#635364]">
                                  {diet && (
                                    <span className="inline-flex items-center gap-1">
                                      {item.dietary === 'veg' ? (
                                        <Leaf className="h-3 w-3 text-[#3E6B64]" aria-hidden="true" />
                                      ) : (
                                        <Flame className="h-3 w-3 text-[#774D78]" aria-hidden="true" />
                                      )}
                                      <span>{diet}</span>
                                    </span>
                                  )}
                                  {diet && item.seasonal && (
                                    <span aria-hidden="true">·</span>
                                  )}
                                  {item.seasonal && <span>Seasonal</span>}
                                </div>
                              )}
                            </div>

                            {item.image && (
                              <button
                                type="button"
                                onClick={() => setPreviewItem(item)}
                                aria-label={`View photo of ${item.name}`}
                                className="interactive-media group relative h-24 w-20 sm:h-28 sm:w-24 shrink-0 overflow-hidden rounded-lg border border-[#774D78]/18 bg-[#F1E3C4]/45 focus-visible:outline-none"
                              >
                                <EditorialImage
                                  src={item.image}
                                  alt={`${item.name} at Katha by Bhupa Greens`}
                                  sizes="96px"
                                  containerClassName="relative w-full h-full"
                                  className="object-contain p-1"
                                />
                              </button>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Warm Human Availability Note */}
      <div className="glass-sage rounded-xl p-5 sm:p-6 text-sm text-[#2A1C2B]/85 leading-relaxed">
        Everything is cooked fresh in our kitchen. If you have any food allergies or want to check today&apos;s specials and prices, just ask your server when you sit down.
      </div>

      {/* Viewport-Centered Portaled Lightbox for Beverage / Dish Photos */}
      {previewItem &&
        previewItem.image &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={previewItem.name}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1F1520]/84 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="relative w-full max-w-md max-h-[90svh] flex flex-col overflow-hidden rounded-2xl border border-[#AF8EB1]/30 bg-[#FBF7EE] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Close photo preview"
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1520]/80 text-white hover:bg-[#774D78] transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative w-full h-[56svh] sm:h-[60svh] max-h-[520px] bg-[#F1E3C4]/45">
                <EditorialImage
                  src={previewItem.image}
                  alt={`${previewItem.name} at Katha by Bhupa Greens`}
                  sizes="(max-width: 768px) 92vw, 440px"
                  containerClassName="relative w-full h-full"
                  className="object-contain p-3"
                />
              </div>

              <div className="p-5 border-t border-[#774D78]/15 space-y-1.5">
                <p className="text-xs font-semibold text-[#774D78]">
                  {previewItem.subcategory}
                </p>
                <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                  {previewItem.name}
                </h3>
                <p className="text-sm text-[#635364] leading-relaxed">
                  {previewItem.description}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
