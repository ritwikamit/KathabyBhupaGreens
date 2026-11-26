'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Leaf,
  MapPin,
  RotateCcw,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import CategoryIcon from '@/components/CategoryIcon';
import EditorialImage from '@/components/EditorialImage';
import {
  playBookCoverSound,
  playPageTurnSound,
} from '@/lib/audio/pageTurnSound';
import type {
  DietaryIndicator,
  MenuCategory,
  MenuItem,
} from '@/lib/types/wordpress';

interface MenuBookProps {
  categories: MenuCategory[];
  items: MenuItem[];
  initialCategorySlug?: string;
  variant?: 'inline' | 'modal';
  onClose?: () => void;
}

interface SubcategoryChunk {
  subcategory: string;
  continued: boolean;
  items: MenuItem[];
}

type BookPageData =
  | {
      kind: 'welcome';
      id: string;
      categories: MenuCategory[];
    }
  | {
      kind: 'menu';
      id: string;
      pageNumber: number;
      category: MenuCategory;
      isCategoryStart: boolean;
      groups: SubcategoryChunk[];
    }
  | {
      kind: 'colophon';
      id: string;
    }
  | {
      kind: 'closing';
      id: string;
      pageNumber: number;
    };

interface DesktopSpread {
  index: number;
  left: BookPageData;
  right: BookPageData;
}

interface FlipState {
  from: number;
  to: number;
  dir: 1 | -1;
  id: number;
}

const FLIP_DURATION_SEC = 0.7;
const COVER_DURATION_SEC = 0.86;
const BOOK_EASE: [number, number, number, number] = [0.26, 0.08, 0.22, 1];
const COVER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLIP_TIMES = [0, 0.2, 0.5, 0.8, 1];

function dietaryLabel(dietary: DietaryIndicator): string | null {
  if (dietary === 'veg') return 'Veg';
  if (dietary === 'non-veg') return 'Non-Veg';
  return null;
}

/**
 * Calibrated non-scrolling pagination.
 * Separate max weights ensure comfortable, unclipped fit on both compact phones and two-page tablet/desktop spreads.
 */
function paginateMenu(
  categories: MenuCategory[],
  items: MenuItem[],
  maxPageWeight: number,
): BookPageData[] {
  const SUBHEADER_WEIGHT = 0.55;
  const ITEM_WEIGHT = 1.0;

  const menuPages: BookPageData[] = [];
  let pageNum = 1;

  for (const category of categories) {
    const catItems = items.filter((i) => i.categorySlug === category.slug);
    if (catItems.length === 0) continue;

    const orderedSubs: { name: string; dishes: MenuItem[] }[] = [];
    for (const dish of catItems) {
      const subName = dish.subcategory || 'Kitchen Selection';
      const existing = orderedSubs.find((s) => s.name === subName);
      if (existing) {
        existing.dishes.push(dish);
      } else {
        orderedSubs.push({ name: subName, dishes: [dish] });
      }
    }

    let currentGroups: SubcategoryChunk[] = [];
    let currentWeight = 0;
    let isFirstForCategory = true;

    const flushPage = () => {
      if (currentGroups.length === 0) return;
      menuPages.push({
        kind: 'menu',
        id: `${category.slug}-p${pageNum}`,
        pageNumber: pageNum,
        category,
        isCategoryStart: isFirstForCategory,
        groups: currentGroups,
      });
      pageNum += 1;
      currentGroups = [];
      currentWeight = 0;
      isFirstForCategory = false;
    };

    for (const sub of orderedSubs) {
      let isSubContinuation = false;

      for (const dish of sub.dishes) {
        const needsHeader =
          currentGroups.length === 0 ||
          currentGroups[currentGroups.length - 1].subcategory !== sub.name;
        const addedWeight =
          (needsHeader ? SUBHEADER_WEIGHT : 0) + ITEM_WEIGHT;

        if (
          currentGroups.length > 0 &&
          currentWeight + addedWeight > maxPageWeight
        ) {
          flushPage();
        }

        const lastGroup = currentGroups[currentGroups.length - 1];
        if (!lastGroup || lastGroup.subcategory !== sub.name) {
          currentGroups.push({
            subcategory: sub.name,
            continued: isSubContinuation,
            items: [dish],
          });
          currentWeight += SUBHEADER_WEIGHT + ITEM_WEIGHT;
        } else {
          lastGroup.items.push(dish);
          currentWeight += ITEM_WEIGHT;
        }
        isSubContinuation = true;
      }
    }

    flushPage();
  }

  menuPages.push({
    kind: 'closing',
    id: 'closing-page',
    pageNumber: pageNum,
  });

  return menuPages;
}

function buildDesktopSpreads(
  categories: MenuCategory[],
  pages: BookPageData[],
): DesktopSpread[] {
  const welcomePage: BookPageData = {
    kind: 'welcome',
    id: 'inside-front-cover',
    categories,
  };

  const spreads: DesktopSpread[] = [];
  if (pages.length === 0) return spreads;

  // Spread 0: Inside Front Cover (Left) + First Menu Page (Right)
  spreads.push({
    index: 0,
    left: welcomePage,
    right: pages[0],
  });

  // Remaining pages paired side-by-side cleanly
  for (let i = 1; i < pages.length; i += 2) {
    const left = pages[i];
    const nextRight = pages[i + 1];

    if (left.kind === 'closing') {
      // Closing page alone: place a clean Campus Endpaper on Left, Closing Back Cover on Right
      spreads.push({
        index: spreads.length,
        left: { kind: 'colophon', id: 'closing-endpaper-left' },
        right: left,
      });
    } else if (!nextRight) {
      spreads.push({
        index: spreads.length,
        left,
        right: {
          kind: 'closing',
          id: `closing-end-${i}`,
          pageNumber: left.kind === 'menu' ? left.pageNumber + 1 : pages.length,
        },
      });
    } else {
      spreads.push({
        index: spreads.length,
        left,
        right: nextRight,
      });
    }
  }

  return spreads;
}

function FrontCoverSurface() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-r-2xl rounded-l-sm border border-[#F1E3C4]/35 border-l-[10px] border-l-[#3E2040] bg-gradient-to-br from-[#2E1A2F] via-[#211222] to-[#130A14] p-6 sm:p-8 text-center text-[#FBF7EE] flex flex-col justify-between shadow-inner">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/45 via-white/[0.06] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 sm:inset-4 rounded-r-xl rounded-l-xs border border-[#F1E3C4]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-5 sm:inset-[22px] rounded-r-lg rounded-l-xs border border-[#F1E3C4]/14"
      />

      <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#F1E3C4]/90 pt-2">
        <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-menu">Inside Bhupa Greens · Darbhanga</span>
      </div>

      <div className="relative z-10 space-y-3 my-auto px-2">
        <p className="section-eyebrow text-[#F1E3C4]">
          Every Meal Has a Story
        </p>
        <h2 className="font-menu text-3xl md:text-4xl font-semibold tracking-wide text-white">
          The Katha Menu
        </h2>
        <p className="text-xs sm:text-sm text-[#D8C8D9] max-w-[260px] mx-auto leading-relaxed">
          Indian Curries · Handi Biryani · Dosas · Snacks · Coffee &amp; Desserts
        </p>
      </div>

      <div className="relative z-10 pb-2 text-[11px] font-menu text-[#F1E3C4]/80">
        Katha by Bhupa Greens
      </div>
    </div>
  );
}

function BookPageRenderer({
  page,
  totalMenuPages,
  side,
  onJumpCategory,
  onClose,
}: {
  page: BookPageData;
  totalMenuPages: number;
  side: 'left' | 'right' | 'single';
  onJumpCategory?: (slug: string) => void;
  onClose?: () => void;
}) {
  const cornerRound =
    side === 'left'
      ? 'rounded-l-xl'
      : side === 'right'
        ? 'rounded-r-xl'
        : 'rounded-r-xl rounded-l-sm';

  const spineGutter =
    side === 'left' ? (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-7 z-20 bg-gradient-to-l from-[#2A1C2B]/14 via-[#2A1C2B]/04 to-transparent"
      />
    ) : (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 ${
          side === 'single' ? 'w-6' : 'w-7'
        } z-20 bg-gradient-to-r from-[#2A1C2B]/16 via-[#2A1C2B]/04 to-transparent`}
      />
    );

  if (page.kind === 'welcome') {
    return (
      <div
        className={`relative h-full w-full overflow-hidden ${cornerRound} bg-gradient-to-br from-[#FCF9F1] via-[#FBF7EE] to-[#F4E8D1] p-5 md:p-6 lg:p-7 flex flex-col justify-between text-[#2A1C2B]`}
      >
        {spineGutter}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-lg border border-[#774D78]/15"
        />

        <div className="relative z-10 space-y-1 pt-1">
          <p className="section-eyebrow text-[#774D78]">Welcome to Our Table</p>
          <h3 className="font-menu text-xl lg:text-2xl font-semibold text-[#2A1C2B]">
            The Katha Menu
          </h3>
          <p className="text-xs text-[#635364] leading-relaxed">
            Honest, freshly cooked food served warm inside the Bhupa Greens campus.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-center my-1.5">
          <div className="relative w-full max-w-[205px] aspect-[5/4] overflow-hidden rounded-xl border border-[#774D78]/20 bg-white/85 p-1.5 shadow-sm">
            <EditorialImage
              src="/katha-photos/dining-hall.webp"
              alt="Katha by Bhupa Greens dining room"
              sizes="210px"
              containerClassName="relative w-full h-full rounded-lg overflow-hidden"
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 border-t border-[#774D78]/16 pt-2.5 space-y-1.5">
          <p className="font-menu text-[10px] font-semibold text-[#774D78]">
            Chapters Inside
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {page.categories.map((cat, idx) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onJumpCategory?.(cat.slug)}
                className="font-menu flex items-center gap-1.5 text-left text-[#2A1C2B] hover:text-[#774D78] transition-colors truncate py-0.5"
              >
                <span className="text-[#774D78] tabular-nums text-[10px]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (page.kind === 'colophon') {
    return (
      <div
        className={`relative h-full w-full overflow-hidden ${cornerRound} bg-gradient-to-br from-[#FCF9F1] via-[#FBF7EE] to-[#F4E8D1] p-6 md:p-7 flex flex-col justify-between text-[#2A1C2B]`}
      >
        {spineGutter}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-lg border border-[#774D78]/15"
        />

        <div className="relative z-10 pt-1">
          <p className="section-eyebrow text-[#774D78]">Visit Notes</p>
          <h3 className="font-menu text-xl lg:text-2xl font-semibold text-[#2A1C2B]">
            Kitchen &amp; Hours
          </h3>
        </div>

        <div className="relative z-10 flex items-center justify-center my-2">
          <div className="relative w-full max-w-[210px] aspect-[5/4] overflow-hidden rounded-xl border border-[#774D78]/20 bg-white/85 p-1.5 shadow-sm">
            <EditorialImage
              src="/katha-photos/bookshelf-corner.webp"
              alt="Quiet reading corner at Katha by Bhupa Greens"
              sizes="210px"
              containerClassName="relative w-full h-full rounded-lg overflow-hidden"
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 border-t border-[#774D78]/15 pt-3 space-y-1.5 text-xs text-[#635364]">
          <p className="flex items-center gap-2 text-[#2A1C2B] font-medium">
            <Clock className="h-3.5 w-3.5 text-[#774D78]" aria-hidden="true" />
            <span className="tabular-nums">Open Daily · 9:00 AM – 11:00 PM</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin
              className="h-3.5 w-3.5 text-[#774D78] mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span>Inside Bhupa Greens Campus, NH27 / NH57, Darbhanga</span>
          </p>
        </div>
      </div>
    );
  }

  if (page.kind === 'closing') {
    const darkSpineGutter =
      side === 'left' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-7 z-20 bg-gradient-to-l from-black/35 via-black/10 to-transparent"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 ${
            side === 'single' ? 'w-6' : 'w-7'
          } z-20 bg-gradient-to-r from-black/35 via-black/10 to-transparent`}
        />
      );

    return (
      <div
        className={`relative h-full w-full overflow-hidden ${cornerRound} bg-gradient-to-br from-[#2B182C] via-[#201121] to-[#130A14] p-6 sm:p-8 text-center text-[#FBF7EE] flex flex-col justify-between`}
      >
        {darkSpineGutter}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 rounded-lg border border-[#F1E3C4]/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-5 rounded-md border border-[#F1E3C4]/12"
        />

        <div className="relative z-10 pt-2 flex items-center justify-center gap-2 text-xs text-[#F1E3C4]/85">
          <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-menu">End of Menu</span>
        </div>

        <div className="relative z-10 space-y-3 my-auto px-2">
          <p className="section-eyebrow text-[#F1E3C4]">
            Thank You for Visiting
          </p>
          <h3 className="font-menu text-2xl sm:text-3xl font-semibold text-white">
            Every Meal Has a Story
          </h3>
          <p className="text-xs sm:text-sm text-[#D8C8D9] max-w-xs mx-auto leading-relaxed">
            Ask our dining team for today&apos;s fresh chef picks, extra breads, or spice level preferences.
          </p>

          <div className="pt-2 space-y-1 text-xs text-[#F1E3C4]/85">
            <p className="inline-flex items-center gap-1.5 justify-center">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">Open Every Day · 9:00 AM – 11:00 PM</span>
            </p>
            <p className="flex items-center gap-1.5 justify-center text-[11px] text-[#D8C8D9]/85">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>Inside Bhupa Greens · NH27, Darbhanga</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 pb-2 flex items-center justify-center">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="interactive-btn font-menu inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#774D78] border border-[#F1E3C4]/35 px-6 py-2 text-xs font-semibold text-white hover:bg-[#8E5E8F] shadow-lg"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Close Menu Book
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standard Calibrated Non-Scrolling Menu Page
  const pageNumLabel = String(page.pageNumber).padStart(2, '0');
  const totalLabel = String(totalMenuPages).padStart(2, '0');

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${cornerRound} bg-gradient-to-br from-[#FCF9F1] via-[#FBF7EE] to-[#F4E8D1] ${
        side === 'single' ? 'pl-5 pr-4 py-3.5 sm:p-5' : 'p-5 md:p-6'
      } flex flex-col justify-between text-[#2A1C2B]`}
    >
      {spineGutter}
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between gap-2 border-b border-[#774D78]/20 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-6 w-6 md:h-7 md:w-7 shrink-0 items-center justify-center rounded-md bg-[#774D78]/10 text-[#774D78]">
            <CategoryIcon slug={page.category.slug} className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-menu text-[15px] md:text-lg font-semibold text-[#2A1C2B] truncate leading-tight">
              {page.category.name}
            </h3>
            {!page.isCategoryStart && (
              <p className="text-[10px] text-[#774D78] leading-none">
                Continued
              </p>
            )}
          </div>
        </div>

        <span className="font-menu text-[11px] font-semibold text-[#774D78] tabular-nums shrink-0">
          {pageNumLabel} / {totalLabel}
        </span>
      </div>

      {/* Dish List — Strictly Calibrated To Fit Without Scrolling */}
      <div className="flex-1 min-h-0 overflow-hidden py-2 space-y-2.5">
        {page.groups.map((group) => (
          <div key={group.subcategory} className="space-y-1">
            <div className="flex items-center justify-between border-b border-[#774D78]/14 pb-0.5">
              <h4 className="font-menu text-[11px] font-semibold text-[#774D78]">
                {group.subcategory}
                {group.continued ? ' (Cont.)' : ''}
              </h4>
            </div>

            <div className="divide-y divide-[#774D78]/10">
              {group.items.map((item) => {
                const diet = dietaryLabel(item.dietary);
                return (
                  <div key={item.id} className="py-1.5 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-menu text-[13px] md:text-[14px] font-semibold text-[#2A1C2B] truncate">
                          {item.name}
                        </span>
                        {diet && (
                          <span
                            title={
                              item.dietary === 'veg'
                                ? 'Vegetarian'
                                : 'Non-Vegetarian'
                            }
                            className="shrink-0"
                          >
                            {item.dietary === 'veg' ? (
                              <Leaf
                                className="h-3 w-3 text-[#3E6B64]"
                                aria-hidden="true"
                              />
                            ) : (
                              <Flame
                                className="h-3 w-3 text-[#774D78]"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        )}
                      </div>

                      {item.price !== null && (
                        <span className="font-sans text-xs md:text-sm font-semibold text-[#2A1C2B] tabular-nums shrink-0">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] md:text-xs leading-snug text-[#635364] line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Folio Signature Line */}
      <div className="shrink-0 border-t border-[#774D78]/12 pt-1.5 flex items-center justify-between text-[10px] text-[#635364]/80">
        <span className="font-menu">Katha by Bhupa Greens</span>
        <span className="tabular-nums">Page {pageNumLabel}</span>
      </div>
    </div>
  );
}

export default function MenuBook({
  categories,
  items,
  initialCategorySlug,
  variant = 'inline',
  onClose,
}: MenuBookProps) {
  const isModal = variant === 'modal';

  // Desktop/Tablet spreads (>= 768px) fit 4-5 items; Smartphone pages (< 768px) fit 3 items cleanly with zero clipping even on 360x640 phones
  const desktopPages = useMemo(
    () => paginateMenu(categories, items, 4.55),
    [categories, items],
  );
  const mobilePages = useMemo(
    () => paginateMenu(categories, items, 3.65),
    [categories, items],
  );

  const spreads = useMemo(
    () => buildDesktopSpreads(categories, desktopPages),
    [categories, desktopPages],
  );

  const initialDesktopSpread = useMemo(() => {
    if (!initialCategorySlug) return 0;
    const found = spreads.findIndex(
      (s) =>
        (s.left.kind === 'menu' &&
          s.left.category.slug === initialCategorySlug) ||
        (s.right.kind === 'menu' &&
          s.right.category.slug === initialCategorySlug),
    );
    return found >= 0 ? found : 0;
  }, [initialCategorySlug, spreads]);

  const initialMobilePage = useMemo(() => {
    if (!initialCategorySlug) return 0;
    const found = mobilePages.findIndex(
      (p) => p.kind === 'menu' && p.category.slug === initialCategorySlug,
    );
    return found >= 0 ? found : 0;
  }, [initialCategorySlug, mobilePages]);

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [coverFlapActive, setCoverFlapActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopSpreadIdx, setDesktopSpreadIdx] =
    useState(initialDesktopSpread);
  const [mobilePageIdx, setMobilePageIdx] = useState(initialMobilePage);

  const [desktopFlips, setDesktopFlips] = useState<FlipState[]>([]);
  const [mobileFlips, setMobileFlips] = useState<FlipState[]>([]);

  const flipSeqRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const desktopSpreadIdxRef = useRef(initialDesktopSpread);
  const desktopFlipsRef = useRef<FlipState[]>([]);
  const mobilePageIdxRef = useRef(initialMobilePage);
  const mobileFlipsRef = useRef<FlipState[]>([]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBookOpen(true);
      if (soundEnabledRef.current) {
        playBookCoverSound(true);
      }
    }, 240);
    return () => window.clearTimeout(timer);
  }, []);

  const totalSpreads = spreads.length;
  const totalMobilePages = mobilePages.length;

  const activeSpreadIdx =
    desktopFlips.length > 0
      ? desktopFlips[desktopFlips.length - 1].to
      : desktopSpreadIdx;
  const activeMobileIdx =
    mobileFlips.length > 0
      ? mobileFlips[mobileFlips.length - 1].to
      : mobilePageIdx;

  const completeDesktopFlip = useCallback((flip: FlipState) => {
    const stillActive = desktopFlipsRef.current.some((f) => f.id === flip.id);
    if (!stillActive) return;
    desktopSpreadIdxRef.current = flip.to;
    setDesktopSpreadIdx(flip.to);
    const remaining = desktopFlipsRef.current.filter((f) => f.id !== flip.id);
    desktopFlipsRef.current = remaining;
    setDesktopFlips(remaining);
  }, []);

  const completeMobileFlip = useCallback((flip: FlipState) => {
    const stillActive = mobileFlipsRef.current.some((f) => f.id === flip.id);
    if (!stillActive) return;
    mobilePageIdxRef.current = flip.to;
    setMobilePageIdx(flip.to);
    const remaining = mobileFlipsRef.current.filter((f) => f.id !== flip.id);
    mobileFlipsRef.current = remaining;
    setMobileFlips(remaining);
  }, []);

  const goDesktopSpread = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= totalSpreads) return;
      const currentFlips = desktopFlipsRef.current;
      const latestIdx =
        currentFlips.length > 0
          ? currentFlips[currentFlips.length - 1].to
          : desktopSpreadIdxRef.current;

      if (!isBookOpen) {
        desktopSpreadIdxRef.current = targetIdx;
        desktopFlipsRef.current = [];
        setDesktopSpreadIdx(targetIdx);
        setDesktopFlips([]);
        setIsBookOpen(true);
        if (soundEnabledRef.current) playBookCoverSound(true);
        return;
      }

      if (targetIdx === latestIdx) return;
      const dir: 1 | -1 = targetIdx > latestIdx ? 1 : -1;
      const id = ++flipSeqRef.current;
      if (soundEnabledRef.current) playPageTurnSound(dir);

      const newFlip: FlipState = { from: latestIdx, to: targetIdx, dir, id };

      // Same-direction rapid turns cascade cleanly; reversing settles cleanly before reversing
      if (currentFlips.length > 0 && currentFlips[0].dir !== dir) {
        desktopSpreadIdxRef.current = latestIdx;
        setDesktopSpreadIdx(latestIdx);
        desktopFlipsRef.current = [newFlip];
        setDesktopFlips([newFlip]);
      } else if (currentFlips.length >= 4) {
        const oldest = currentFlips[0];
        desktopSpreadIdxRef.current = oldest.to;
        setDesktopSpreadIdx(oldest.to);
        const next = [...currentFlips.slice(1), newFlip];
        desktopFlipsRef.current = next;
        setDesktopFlips(next);
      } else {
        const next = [...currentFlips, newFlip];
        desktopFlipsRef.current = next;
        setDesktopFlips(next);
      }
    },
    [isBookOpen, totalSpreads],
  );

  const goMobilePage = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= totalMobilePages) return;
      const currentFlips = mobileFlipsRef.current;
      const latestIdx =
        currentFlips.length > 0
          ? currentFlips[currentFlips.length - 1].to
          : mobilePageIdxRef.current;

      if (!isBookOpen) {
        mobilePageIdxRef.current = targetIdx;
        mobileFlipsRef.current = [];
        setMobilePageIdx(targetIdx);
        setMobileFlips([]);
        setIsBookOpen(true);
        if (soundEnabledRef.current) playBookCoverSound(true);
        return;
      }

      if (targetIdx === latestIdx) return;
      const dir: 1 | -1 = targetIdx > latestIdx ? 1 : -1;
      const id = ++flipSeqRef.current;
      if (soundEnabledRef.current) playPageTurnSound(dir);

      const newFlip: FlipState = { from: latestIdx, to: targetIdx, dir, id };

      if (currentFlips.length > 0 && currentFlips[0].dir !== dir) {
        mobilePageIdxRef.current = latestIdx;
        setMobilePageIdx(latestIdx);
        mobileFlipsRef.current = [newFlip];
        setMobileFlips([newFlip]);
      } else if (currentFlips.length >= 4) {
        const oldest = currentFlips[0];
        mobilePageIdxRef.current = oldest.to;
        setMobilePageIdx(oldest.to);
        const next = [...currentFlips.slice(1), newFlip];
        mobileFlipsRef.current = next;
        setMobileFlips(next);
      } else {
        const next = [...currentFlips, newFlip];
        mobileFlipsRef.current = next;
        setMobileFlips(next);
      }
    },
    [isBookOpen, totalMobilePages],
  );

  const handleJumpCategory = useCallback(
    (slug: string) => {
      const sIdx = spreads.findIndex(
        (s) =>
          (s.left.kind === 'menu' && s.left.category.slug === slug) ||
          (s.right.kind === 'menu' && s.right.category.slug === slug),
      );
      if (sIdx >= 0) goDesktopSpread(sIdx);

      const mIdx = mobilePages.findIndex(
        (p) => p.kind === 'menu' && p.category.slug === slug,
      );
      if (mIdx >= 0) goMobilePage(mIdx);
    },
    [goDesktopSpread, goMobilePage, mobilePages, spreads],
  );

  const handleNext = useCallback(() => {
    if (!isBookOpen) {
      setCoverFlapActive(true);
      setIsBookOpen(true);
      if (soundEnabledRef.current) playBookCoverSound(true);
      return;
    }
    const isTabletOrDesktop =
      typeof window !== 'undefined' && window.innerWidth >= 768;
    if (isTabletOrDesktop) {
      if (activeSpreadIdx < totalSpreads - 1) {
        goDesktopSpread(activeSpreadIdx + 1);
      }
    } else if (activeMobileIdx < totalMobilePages - 1) {
      goMobilePage(activeMobileIdx + 1);
    }
  }, [
    activeMobileIdx,
    activeSpreadIdx,
    goDesktopSpread,
    goMobilePage,
    isBookOpen,
    totalMobilePages,
    totalSpreads,
  ]);

  const handlePrev = useCallback(() => {
    if (!isBookOpen) return;
    const isTabletOrDesktop =
      typeof window !== 'undefined' && window.innerWidth >= 768;
    if (isTabletOrDesktop) {
      if (activeSpreadIdx > 0) {
        goDesktopSpread(activeSpreadIdx - 1);
      } else {
        desktopFlipsRef.current = [];
        setDesktopFlips([]);
        setCoverFlapActive(true);
        setIsBookOpen(false);
        if (soundEnabledRef.current) playBookCoverSound(false);
      }
    } else if (activeMobileIdx > 0) {
      goMobilePage(activeMobileIdx - 1);
    } else {
      mobileFlipsRef.current = [];
      setMobileFlips([]);
      setCoverFlapActive(true);
      setIsBookOpen(false);
      if (soundEnabledRef.current) playBookCoverSound(false);
    }
  }, [
    activeMobileIdx,
    activeSpreadIdx,
    goDesktopSpread,
    goMobilePage,
    isBookOpen,
  ]);

  const replayBook = useCallback(() => {
    desktopFlipsRef.current = [];
    mobileFlipsRef.current = [];
    desktopSpreadIdxRef.current = 0;
    mobilePageIdxRef.current = 0;
    setDesktopFlips([]);
    setMobileFlips([]);
    setCoverFlapActive(true);
    setIsBookOpen(false);
    setDesktopSpreadIdx(0);
    setMobilePageIdx(0);
    if (soundEnabledRef.current) playBookCoverSound(false);
    window.setTimeout(() => {
      setIsBookOpen(true);
      if (soundEnabledRef.current) playBookCoverSound(true);
    }, 450);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playPageTurnSound(1);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev]);

  const totalDesktopMenuPages = desktopPages.filter(
    (p) => p.kind === 'menu',
  ).length;
  const totalMobileMenuPages = mobilePages.filter(
    (p) => p.kind === 'menu',
  ).length;

  const firstDesktopFlip = desktopFlips[0];
  const lastDesktopFlip = desktopFlips[desktopFlips.length - 1];

  const desktopBaseLeft = firstDesktopFlip
    ? firstDesktopFlip.dir === 1
      ? spreads[firstDesktopFlip.from]?.left
      : spreads[lastDesktopFlip.to]?.left
    : spreads[desktopSpreadIdx]?.left;

  const desktopBaseRight = firstDesktopFlip
    ? firstDesktopFlip.dir === 1
      ? spreads[lastDesktopFlip.to]?.right
      : spreads[firstDesktopFlip.from]?.right
    : spreads[desktopSpreadIdx]?.right;

  const currentMobilePage = mobilePages[mobilePageIdx] ?? mobilePages[0];
  const lastMobileFlip = mobileFlips[mobileFlips.length - 1];
  const targetMobilePage = lastMobileFlip
    ? lastMobileFlip.dir === 1
      ? mobilePages[lastMobileFlip.to]
      : mobilePages[mobileFlips[0].from]
    : currentMobilePage;

  if (!desktopBaseLeft || !desktopBaseRight || !currentMobilePage) return null;

  return (
    <div
      className={`w-full overflow-x-clip flex flex-col items-center ${
        isModal ? 'h-full justify-center' : 'space-y-4'
      }`}
    >
      {/* Inline /menu Route Only: Optional Chapter Jump Strip */}
      {!isModal && (
        <div className="w-full flex items-center justify-between gap-2">
          <div
            role="tablist"
            aria-label="Menu book chapters"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-w-0 flex-1"
          >
            {categories.map((cat, idx) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleJumpCategory(cat.slug)}
                className="font-menu inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/18 bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78] whitespace-nowrap shrink-0 transition-colors"
              >
                <span className="tabular-nums opacity-70">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={
                soundEnabled ? 'Mute page turn sound' : 'Unmute page turn sound'
              }
              title={soundEnabled ? 'Page turn sound on' : 'Page turn sound off'}
              className="interactive-btn inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/20 bg-white/85 px-2.5 py-1.5 text-xs font-medium text-[#774D78] hover:bg-white shrink-0"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              )}
              <span className="hidden md:inline">
                {soundEnabled ? 'Sound' : 'Muted'}
              </span>
            </button>
            <button
              type="button"
              onClick={replayBook}
              className="interactive-btn inline-flex items-center gap-1.5 rounded-lg border border-[#774D78]/20 bg-white/85 px-3 py-1.5 text-xs font-medium text-[#774D78] hover:bg-white shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Replay Cover</span>
            </button>
          </div>
        </div>
      )}

      {/* TABLET & DESKTOP TWO-PAGE HARDBOUND BOOK STAGE (md: 768px+) */}
      <div
        className="hidden md:flex w-full max-w-[920px] lg:max-w-[1040px] flex-col items-center gap-3"
        style={{ perspective: '2400px' }}
      >
        {/* Top-Right Sound & Close Controls Cleanly Framed Above Book */}
        {isModal && onClose && (
          <div className="w-full flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={
                soundEnabled ? 'Mute page turn sound' : 'Unmute page turn sound'
              }
              className="interactive-btn font-menu inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#F1E3C4]/30 bg-[#231424]/90 px-3 text-xs font-semibold text-[#F1E3C4] shadow-lg hover:bg-[#774D78] hover:text-white"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              )}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu book"
              className="interactive-btn font-menu inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#F1E3C4]/30 bg-[#231424]/90 px-3.5 text-xs font-semibold text-[#F1E3C4] shadow-lg hover:bg-[#774D78] hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>
        )}

        {/* Fixed-Height Animated Hardcover Book Stage */}
        <motion.div
          animate={{ x: isBookOpen ? '0%' : '-25%' }}
          transition={{ duration: COVER_DURATION_SEC, ease: COVER_EASE }}
          className="relative w-full h-[min(74dvh,590px)] select-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Base Book Layer (Isolated 2D Stacking — Zero Z-Fighting Along Center Crease) */}
          <div className="absolute inset-0 z-10">
            {/* Left Hardcover Backplate */}
            <motion.div
              animate={{ opacity: isBookOpen ? 1 : 0 }}
              transition={{
                duration: 0.28,
                delay: isBookOpen ? COVER_DURATION_SEC * 0.42 : 0,
              }}
              className="absolute inset-y-0 left-0 w-1/2 rounded-l-2xl bg-gradient-to-b from-[#3E2240] to-[#271429] p-2 pr-0 shadow-[0_28px_60px_-16px_rgba(10,4,12,0.72)] border border-r-0 border-[#F1E3C4]/20"
            >
              <div className="relative h-full w-full rounded-l-xl bg-[#FBF7EE] shadow-[-4px_0_0_#EAE0CB,-7px_0_0_#D8CBB1] overflow-hidden">
                <BookPageRenderer
                  page={desktopBaseLeft}
                  totalMenuPages={totalDesktopMenuPages}
                  side="left"
                  onJumpCategory={handleJumpCategory}
                  onClose={onClose}
                />
                {/* Dynamic Cast Shadow Under Landing / Lifting Turning Leaf */}
                {lastDesktopFlip && (
                  <motion.div
                    key={`l-cast-${lastDesktopFlip.id}`}
                    aria-hidden="true"
                    initial={{
                      opacity: lastDesktopFlip.dir === 1 ? 0 : 0.34,
                    }}
                    animate={{
                      opacity:
                        lastDesktopFlip.dir === 1
                          ? [0, 0.28, 0.14, 0]
                          : [0.34, 0.18, 0.06, 0],
                    }}
                    transition={{ duration: FLIP_DURATION_SEC, ease: 'easeInOut' }}
                    className="pointer-events-none absolute inset-0 z-[25] bg-gradient-to-l from-[#1A0D1C]/35 via-[#1A0D1C]/12 to-transparent"
                  />
                )}
                {isBookOpen && activeSpreadIdx > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Turn to previous menu page"
                    className="absolute inset-y-0 left-0 w-9 z-30 cursor-pointer bg-gradient-to-r from-[#774D78]/[0.05] to-transparent opacity-0 hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            </motion.div>

            {/* Right Hardcover Backplate */}
            <div className="absolute inset-y-0 left-1/2 w-1/2 rounded-r-2xl bg-gradient-to-b from-[#3E2240] to-[#271429] p-2 pl-0 shadow-[0_28px_60px_-16px_rgba(10,4,12,0.72)] border border-l-0 border-[#F1E3C4]/20">
              <div className="relative h-full w-full rounded-r-xl bg-[#FBF7EE] shadow-[4px_0_0_#EAE0CB,7px_0_0_#D8CBB1] overflow-hidden">
                <BookPageRenderer
                  page={desktopBaseRight}
                  totalMenuPages={totalDesktopMenuPages}
                  side="right"
                  onJumpCategory={handleJumpCategory}
                  onClose={onClose}
                />
                {/* Dynamic Cast Shadow Under Landing / Lifting Turning Leaf */}
                {lastDesktopFlip && (
                  <motion.div
                    key={`r-cast-${lastDesktopFlip.id}`}
                    aria-hidden="true"
                    initial={{
                      opacity: lastDesktopFlip.dir === 1 ? 0.36 : 0,
                    }}
                    animate={{
                      opacity:
                        lastDesktopFlip.dir === 1
                          ? [0.36, 0.16, 0.04, 0]
                          : [0, 0.28, 0.14, 0],
                    }}
                    transition={{ duration: FLIP_DURATION_SEC, ease: 'easeInOut' }}
                    className="pointer-events-none absolute inset-0 z-[25] bg-gradient-to-r from-[#1A0D1C]/35 via-[#1A0D1C]/12 to-transparent"
                  />
                )}
                {isBookOpen && activeSpreadIdx < totalSpreads - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Turn to next menu page"
                    className="absolute inset-y-0 right-0 w-9 z-30 cursor-pointer bg-gradient-to-l from-[#774D78]/[0.05] to-transparent opacity-0 hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            </div>

            {/* Feathered Center Spine Shadow + Continuous Bound Spine Crease */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: isBookOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute top-[9px] bottom-[9px] left-1/2 -translate-x-1/2 w-14 z-20"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(26,13,28,0.06) 28%, rgba(26,13,28,0.22) 48%, rgba(26,13,28,0.34) 50%, rgba(26,13,28,0.22) 52%, rgba(26,13,28,0.06) 72%, transparent 100%)',
              }}
            />
            <motion.div
              aria-hidden="true"
              animate={{ opacity: isBookOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute top-[9px] bottom-[9px] left-1/2 -translate-x-1/2 w-px z-[22] bg-[#1D0F1E]/28"
            />
            {/* Top & Bottom Leather Spine Caps Sealing Hardcover Rim Seam */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: isBookOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute top-[1px] left-1/2 -translate-x-1/2 h-[8px] w-7 z-[22] bg-gradient-to-r from-[#3A203C] via-[#271429] to-[#3A203C]"
            />
            <motion.div
              aria-hidden="true"
              animate={{ opacity: isBookOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute bottom-[1px] left-1/2 -translate-x-1/2 h-[8px] w-7 z-[22] bg-gradient-to-r from-[#2B162D] via-[#1D0F1F] to-[#2B162D]"
            />
          </div>

          {/* Continuous 3D Hardcover Front Flap */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: isBookOpen ? -180 : 0,
              opacity: coverFlapActive ? 1 : 0,
            }}
            transition={{
              rotateY: { duration: COVER_DURATION_SEC, ease: COVER_EASE },
              opacity: { duration: 0.01 },
            }}
            onAnimationComplete={() => {
              if (isBookOpen) {
                setCoverFlapActive(false);
              }
            }}
            onClick={() => {
              if (!isBookOpen) {
                setCoverFlapActive(true);
                setIsBookOpen(true);
                if (soundEnabledRef.current) playBookCoverSound(true);
              }
            }}
            style={{
              left: '50%',
              width: '50%',
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              pointerEvents: isBookOpen ? 'none' : 'auto',
              zIndex: coverFlapActive ? 30 : 0,
            }}
            className="absolute inset-y-0 cursor-pointer"
          >
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="absolute inset-0"
            >
              <FrontCoverSurface />
            </div>

            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 rounded-l-2xl bg-gradient-to-b from-[#3E2240] to-[#271429] p-2 pr-0 border border-r-0 border-[#F1E3C4]/20"
            >
              <div className="h-full w-full rounded-l-xl bg-[#FBF7EE] overflow-hidden">
                {spreads[desktopSpreadIdx] && (
                  <BookPageRenderer
                    page={spreads[desktopSpreadIdx].left}
                    totalMenuPages={totalDesktopMenuPages}
                    side="left"
                    onJumpCategory={handleJumpCategory}
                    onClose={onClose}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Stacked Double-Sided 3D Turning Leaves With Paper Arch, Corner Lift & Stable zIndex */}
          {isBookOpen &&
            desktopFlips.map((flip) => {
              const fromSpread = spreads[flip.from];
              const toSpread = spreads[flip.to];
              if (!fromSpread || !toSpread) return null;
              const leafFront = flip.dir === 1 ? fromSpread.right : toSpread.right;
              const leafBack = flip.dir === 1 ? toSpread.left : fromSpread.left;
              const stableOffset = flip.id % 50;
              const topZ = 200 - stableOffset;
              const settledZ = 100 + stableOffset;

              return (
                <motion.div
                  key={flip.id}
                  initial={{
                    rotateY: flip.dir === 1 ? 0 : -180,
                    skewY: 0,
                    scaleX: 1,
                    zIndex: topZ,
                  }}
                  animate={{
                    rotateY:
                      flip.dir === 1
                        ? [0, -32, -90, -148, -180]
                        : [-180, -148, -90, -32, 0],
                    skewY:
                      flip.dir === 1
                        ? [0, -1.6, -2.4, -1.1, 0]
                        : [0, 1.1, 2.4, 1.6, 0],
                    scaleX: [1, 0.985, 0.945, 0.985, 1],
                    zIndex: [topZ, topZ, settledZ, settledZ, settledZ],
                  }}
                  transition={{
                    duration: FLIP_DURATION_SEC,
                    times: FLIP_TIMES,
                    ease: BOOK_EASE,
                    zIndex: { times: [0, 0.49, 0.51, 0.9, 1], duration: FLIP_DURATION_SEC },
                  }}
                  onAnimationComplete={() => completeDesktopFlip(flip)}
                  style={{
                    left: '50%',
                    width: 'calc(50% - 9px)',
                    top: '9px',
                    bottom: '9px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                  }}
                  className="pointer-events-none absolute"
                >
                  {/* Front Leaf Face */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    className="absolute inset-0 rounded-r-xl overflow-hidden bg-[#FCF9F1] border-r border-[#DFCFAF]/70"
                  >
                    <BookPageRenderer
                      page={leafFront}
                      totalMenuPages={totalDesktopMenuPages}
                      side="right"
                    />
                    {/* Cylindrical Paper Bend Specular + Crease Band */}
                    <motion.div
                      aria-hidden="true"
                      initial={{
                        x: flip.dir === 1 ? '85%' : '-85%',
                        opacity: 0,
                      }}
                      animate={{
                        x: flip.dir === 1 ? '-85%' : '85%',
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{ duration: FLIP_DURATION_SEC, ease: 'easeInOut' }}
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(26,13,28,0.08) 28%, rgba(255,253,247,0.56) 50%, rgba(26,13,28,0.12) 72%, transparent 100%)',
                      }}
                      className="pointer-events-none absolute inset-y-0 -inset-x-12"
                    />
                    <motion.div
                      initial={{ opacity: flip.dir === 1 ? 0 : 0.34 }}
                      animate={{
                        opacity:
                          flip.dir === 1 ? [0, 0.14, 0.34] : [0.34, 0.16, 0],
                      }}
                      transition={{ duration: FLIP_DURATION_SEC, ease: 'linear' }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#1A0D1C]/26 via-transparent to-[#1A0D1C]/10"
                    />
                  </div>

                  {/* Back Leaf Face */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 rounded-l-xl overflow-hidden bg-[#FBF7EE] border-l border-[#DFCFAF]/70"
                  >
                    <BookPageRenderer
                      page={leafBack}
                      totalMenuPages={totalDesktopMenuPages}
                      side="left"
                    />
                    {/* Cylindrical Paper Bend Specular + Crease Band */}
                    <motion.div
                      aria-hidden="true"
                      initial={{
                        x: flip.dir === 1 ? '85%' : '-85%',
                        opacity: 0,
                      }}
                      animate={{
                        x: flip.dir === 1 ? '-85%' : '85%',
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{ duration: FLIP_DURATION_SEC, ease: 'easeInOut' }}
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(26,13,28,0.08) 28%, rgba(255,253,247,0.54) 50%, rgba(26,13,28,0.12) 72%, transparent 100%)',
                      }}
                      className="pointer-events-none absolute inset-y-0 -inset-x-12"
                    />
                    <motion.div
                      initial={{ opacity: flip.dir === 1 ? 0.34 : 0 }}
                      animate={{
                        opacity:
                          flip.dir === 1 ? [0.34, 0.14, 0] : [0, 0.16, 0.34],
                      }}
                      transition={{ duration: FLIP_DURATION_SEC, ease: 'linear' }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1A0D1C]/24 via-transparent to-[#1A0D1C]/10"
                    />
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* Dedicated Zero-Overlap Page-Turn Controls Below Open Book (Always Fixed Height) */}
        <div
          className={`w-full flex items-center justify-between gap-4 h-11 transition-opacity duration-300 ${
            isBookOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handlePrev}
            className={`interactive-btn font-menu inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-colors ${
              isModal
                ? 'border border-white/20 bg-white/10 text-white hover:bg-[#774D78] hover:border-[#AF8EB1]'
                : 'border border-[#774D78]/25 bg-white text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78]'
            }`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>{activeSpreadIdx === 0 ? 'Cover' : 'Prev Page'}</span>
          </button>

          <span
            className={`font-menu text-xs font-semibold tabular-nums ${
              isModal ? 'text-[#F1E3C4]' : 'text-[#635364]'
            }`}
          >
            Spread {String(activeSpreadIdx + 1).padStart(2, '0')} of{' '}
            {String(totalSpreads).padStart(2, '0')}
          </span>

          {activeSpreadIdx < totalSpreads - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#774D78] px-4 text-xs font-semibold text-white hover:bg-[#5D3A5E] shadow-md"
            >
              <span>Next Page</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#F1E3C4] px-4 text-xs font-semibold text-[#2A1C2B] hover:bg-white shadow-md"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Close Book</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={replayBook}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2A1C2B] px-4 text-xs font-semibold text-[#F1E3C4] hover:bg-[#774D78] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>

      {/* SMARTPHONE SINGLE-PAGE BOOK STAGE (< md: < 768px) */}
      <div
        className="relative flex md:hidden w-full max-w-[390px] flex-col items-center gap-2.5 select-none"
        style={{ perspective: '1900px' }}
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0]?.clientX ?? null;
          touchStartYRef.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(e) => {
          const sx = touchStartXRef.current;
          const sy = touchStartYRef.current;
          touchStartXRef.current = null;
          touchStartYRef.current = null;
          if (sx === null || sy === null) return;
          const ex = e.changedTouches[0]?.clientX ?? sx;
          const ey = e.changedTouches[0]?.clientY ?? sy;
          const dx = ex - sx;
          const dy = ey - sy;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            if (dx < 0) handleNext();
            else handlePrev();
          }
        }}
      >
        {/* Unclipped Top-Right Sound & Close Controls Aligned Cleanly Above Book */}
        {isModal && onClose && (
          <div className="w-full flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={
                soundEnabled ? 'Mute page turn sound' : 'Unmute page turn sound'
              }
              className="interactive-btn font-menu inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#F1E3C4]/30 bg-[#231424]/90 px-3 text-xs font-semibold text-[#F1E3C4] shadow-lg hover:bg-[#774D78] hover:text-white"
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              )}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu book"
              className="interactive-btn font-menu inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#F1E3C4]/30 bg-[#231424]/90 px-3.5 text-xs font-semibold text-[#F1E3C4] shadow-lg hover:bg-[#774D78] hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>
        )}

        {/* Fixed-Height Single Book Spine Frame (Flush Front Cover + Pure preserve-3d Leaves) */}
        <div
          className="relative w-full h-[min(72dvh,530px)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Hardcover Backplate */}
          <div
            className="absolute inset-0 rounded-r-2xl rounded-l-md bg-gradient-to-b from-[#3E2240] to-[#271429] p-1.5 shadow-[0_26px_64px_-16px_rgba(10,4,12,0.75)] border border-[#F1E3C4]/25"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="relative h-full w-full rounded-r-xl rounded-l-sm bg-[#FBF7EE] shadow-[3px_0_0_#EAE0CB,6px_0_0_#D8CBB1]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Settled Underlying Page */}
              <div className="relative h-full w-full rounded-r-xl rounded-l-sm overflow-hidden">
                <BookPageRenderer
                  page={targetMobilePage}
                  totalMenuPages={totalMobileMenuPages}
                  side="single"
                  onClose={onClose}
                />

                {/* Dynamic Cast Shadow On Revealed Smartphone Page */}
                {isBookOpen && lastMobileFlip && (
                  <motion.div
                    key={`m-cast-${lastMobileFlip.id}`}
                    aria-hidden="true"
                    initial={{
                      opacity: lastMobileFlip.dir === 1 ? 0.42 : 0,
                    }}
                    animate={{
                      opacity:
                        lastMobileFlip.dir === 1
                          ? [0.42, 0.16, 0]
                          : [0, 0.28, 0.12, 0],
                    }}
                    transition={{
                      duration: FLIP_DURATION_SEC * 0.92,
                      ease: 'easeInOut',
                    }}
                    className="pointer-events-none absolute inset-0 z-[25] bg-gradient-to-r from-[#1A0D1C]/38 via-[#1A0D1C]/14 to-transparent"
                  />
                )}
              </div>

              {/* Stacked Double-Sided 3D Turning Leaves on Smartphone (Pure preserve-3d, zero parent opacity!) */}
              {isBookOpen &&
                mobileFlips.map((flip) => {
                  const leafPage =
                    flip.dir === 1
                      ? mobilePages[flip.from]
                      : mobilePages[flip.to];
                  if (!leafPage) return null;
                  const stableOffset = flip.id % 50;
                  const zOrder =
                    flip.dir === 1 ? 200 - stableOffset : 100 + stableOffset;

                  return (
                    <motion.div
                      key={`mflip-${flip.id}`}
                      initial={
                        flip.dir === 1
                          ? {
                              rotateY: 0,
                              skewY: 0,
                              x: 0,
                            }
                          : {
                              rotateY: -150,
                              skewY: 0,
                              x: -12,
                            }
                      }
                      animate={
                        flip.dir === 1
                          ? {
                              rotateY: [0, -35, -90, -130, -150],
                              skewY: [0, -1.8, -2.4, -1.0, 0],
                              x: [0, -2, -5, -9, -12],
                            }
                          : {
                              rotateY: [-150, -130, -90, -35, 0],
                              skewY: [0, -1.0, -2.4, -1.8, 0],
                              x: [-12, -9, -5, -2, 0],
                            }
                      }
                      transition={{
                        duration: FLIP_DURATION_SEC * 0.94,
                        times: FLIP_TIMES,
                        ease: BOOK_EASE,
                      }}
                      onAnimationComplete={() => completeMobileFlip(flip)}
                      style={{
                        transformOrigin: 'left center',
                        transformStyle: 'preserve-3d',
                        zIndex: zOrder,
                      }}
                      className="pointer-events-none absolute inset-0"
                    >
                      {/* Front Sheet */}
                      <div
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                        className="absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm bg-[#FCF9F1] border-r border-[#DFCFAF]/75 shadow-[12px_0_28px_rgba(15,8,18,0.24)]"
                      >
                        <BookPageRenderer
                          page={leafPage}
                          totalMenuPages={totalMobileMenuPages}
                          side="single"
                        />
                        {/* Cylindrical Paper Bend Specular + Crease Band */}
                        <motion.div
                          aria-hidden="true"
                          initial={{
                            x: flip.dir === 1 ? '85%' : '-85%',
                            opacity: 0,
                          }}
                          animate={{
                            x: flip.dir === 1 ? '-85%' : '85%',
                            opacity: [0, 0.9, 0],
                          }}
                          transition={{
                            duration: FLIP_DURATION_SEC * 0.94,
                            ease: 'easeInOut',
                          }}
                          style={{
                            background:
                              'linear-gradient(90deg, transparent 0%, rgba(26,13,28,0.08) 28%, rgba(255,253,247,0.56) 50%, rgba(26,13,28,0.12) 72%, transparent 100%)',
                          }}
                          className="pointer-events-none absolute inset-y-0 -inset-x-10"
                        />
                        <motion.div
                          aria-hidden="true"
                          initial={{ opacity: flip.dir === 1 ? 0 : 0.28 }}
                          animate={{
                            opacity:
                              flip.dir === 1
                                ? [0, 0.14, 0.28]
                                : [0.28, 0.14, 0],
                          }}
                          transition={{
                            duration: FLIP_DURATION_SEC * 0.94,
                            ease: 'linear',
                          }}
                          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#1A0D1C]/26 via-transparent to-transparent"
                        />
                      </div>

                      {/* Genuine Parchment Back Sheet (Fades cleanly past -125deg without flattening 3D parent) */}
                      <motion.div
                        initial={{ opacity: flip.dir === 1 ? 1 : 0 }}
                        animate={{
                          opacity:
                            flip.dir === 1
                              ? [1, 1, 1, 0.55, 0]
                              : [0, 0.6, 1, 1, 1],
                        }}
                        transition={{
                          duration: FLIP_DURATION_SEC * 0.94,
                          times: FLIP_TIMES,
                          ease: 'easeInOut',
                        }}
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                        className="absolute inset-0 overflow-hidden rounded-l-xl rounded-r-sm bg-gradient-to-bl from-[#FCF9F1] via-[#F5EBD7] to-[#EADBC0] border-l border-[#DFCFAF]/80 shadow-[-12px_0_28px_rgba(15,8,18,0.24)]"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-3 rounded-lg border border-[#774D78]/12"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-[#2A1C2B]/14 via-[#2A1C2B]/04 to-transparent"
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Flush Double-Sided Mobile Front Hardbound Cover Swinging Open */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: isBookOpen ? -148 : 0,
            }}
            transition={{ duration: COVER_DURATION_SEC, ease: COVER_EASE }}
            onAnimationComplete={() => {
              if (isBookOpen) {
                setCoverFlapActive(false);
              }
            }}
            onClick={() => {
              if (!isBookOpen) {
                setCoverFlapActive(true);
                setIsBookOpen(true);
                if (soundEnabledRef.current) playBookCoverSound(true);
              }
            }}
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              pointerEvents: isBookOpen ? 'none' : 'auto',
              visibility: !coverFlapActive && isBookOpen ? 'hidden' : 'visible',
              zIndex: 250,
            }}
            className="absolute inset-0 cursor-pointer"
          >
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="absolute inset-0"
            >
              <FrontCoverSurface />
            </div>
            <motion.div
              animate={{
                opacity: isBookOpen ? [1, 1, 0.5, 0] : [0, 0.8, 1],
              }}
              transition={{
                duration: COVER_DURATION_SEC,
                times: isBookOpen ? [0, 0.55, 0.82, 1] : [0, 0.35, 1],
                ease: 'easeInOut',
              }}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 rounded-l-2xl rounded-r-sm bg-gradient-to-b from-[#3E2240] to-[#271429] p-1.5 border border-[#F1E3C4]/20"
            >
              <div className="h-full w-full rounded-l-xl bg-gradient-to-br from-[#FCF9F1] via-[#FBF7EE] to-[#F4E8D1]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Always-Reserved Smartphone Bottom Controls (Unified Design Consistency) */}
        <div
          className={`w-full flex items-center justify-between gap-2 h-11 transition-opacity duration-300 ${
            isBookOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handlePrev}
            className={`interactive-btn font-menu inline-flex h-10 items-center gap-1 rounded-xl px-3.5 text-xs font-semibold transition-colors ${
              isModal
                ? 'border border-white/20 bg-white/10 text-white hover:bg-[#774D78] hover:border-[#AF8EB1]'
                : 'border border-[#774D78]/25 bg-white text-[#2A1C2B] hover:border-[#774D78] hover:text-[#774D78]'
            }`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>{activeMobileIdx === 0 ? 'Cover' : 'Prev Page'}</span>
          </button>

          <span
            className={`text-xs font-menu font-semibold tabular-nums ${
              isModal ? 'text-[#F1E3C4]' : 'text-[#635364]'
            }`}
          >
            Page {String(activeMobileIdx + 1).padStart(2, '0')} /{' '}
            {String(totalMobilePages).padStart(2, '0')}
          </span>

          {activeMobileIdx < totalMobilePages - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1 rounded-xl bg-[#774D78] hover:bg-[#5D3A5E] px-4 text-xs font-semibold text-white transition-colors shadow-md"
            >
              <span>Next Page</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1 rounded-xl bg-[#F1E3C4] px-4 text-xs font-semibold text-[#2A1C2B] hover:bg-white transition-colors shadow-md"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Close Book</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={replayBook}
              className="interactive-btn font-menu inline-flex h-10 items-center gap-1 rounded-xl bg-[#2A1C2B] px-3.5 text-xs font-semibold text-[#F1E3C4] hover:bg-[#774D78] hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
