import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Coffee } from 'lucide-react';
import BeverageShowcaseGrid from '@/components/BeverageShowcaseGrid';
import CategoryIcon from '@/components/CategoryIcon';
import EditorialImage from '@/components/EditorialImage';
import MenuExplorer from '@/components/MenuExplorer';
import ScrollReveal from '@/components/ScrollReveal';
import { SPARKLING_STORIES_CARDS } from '@/lib/data/katha-data';
import {
  getMenuCategories,
  getMenuCategoryBySlug,
  getMenuItems,
} from '@/lib/wordpress';

interface MenuCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getMenuCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: MenuCategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getMenuCategoryBySlug(slug);
  if (!category) {
    return { title: 'Menu' };
  }
  return {
    title: `${category.name} Menu`,
    description: `${category.description} Browse ${category.name} at Katha by Bhupa Greens in Darbhanga.`,
  };
}

export default async function DedicatedMenuCategoryPage({
  params,
}: MenuCategoryPageProps) {
  const { category: slug } = await params;
  const [categories, currentCategory, categoryItems] = await Promise.all([
    getMenuCategories(),
    getMenuCategoryBySlug(slug),
    getMenuItems(slug),
  ]);

  if (!currentCategory) {
    notFound();
  }

  const otherCategories = categories.filter(
    (c) => c.slug !== currentCategory.slug
  );
  const isDrinks = currentCategory.slug === 'coffee-and-drinks';
  const isTallMorePhoto =
    currentCategory.heroImage.includes('space-13') ||
    currentCategory.heroImage.includes('food-21');
  const isSquareMorePhoto = currentCategory.heroImage.includes('food-08');

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 sm:pt-14 space-y-14">
      {/* Breadcrumb Back Link */}
      <div>
        <Link
          href="/menu"
          className="interactive-btn font-menu inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#635364] hover:text-[#774D78]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Full Menu
        </Link>
      </div>

      {/* Category Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <ScrollReveal className="lg:col-span-7 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#774D78]">
              <CategoryIcon slug={currentCategory.slug} className="h-4 w-4 shrink-0" />
              <span className="section-eyebrow">Katha Menu</span>
            </div>
            <h1 className="font-menu text-3xl sm:text-5xl font-semibold tracking-tight text-[#2A1C2B]">
              {currentCategory.name}
            </h1>
            <p className="text-base leading-relaxed text-[#635364]">
              {currentCategory.description}
            </p>
          </div>

          {currentCategory.availabilityNote && (
            <p className="text-xs leading-relaxed text-[#635364] border-t border-[#774D78]/15 pt-4">
              {currentCategory.availabilityNote}
            </p>
          )}
        </ScrollReveal>

        {/* Compact Crisp Frame so Real morePhotos Stay Sharp & Uncropped */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            className={`interactive-media relative w-full overflow-hidden rounded-2xl border border-[#774D78]/20 bg-[#F1E3C4]/50 p-2 shadow-sm ${
              isDrinks
                ? 'aspect-[4/5] max-w-[300px]'
                : isTallMorePhoto
                  ? 'aspect-[9/16] max-w-[220px]'
                  : isSquareMorePhoto
                    ? 'aspect-square max-w-[280px]'
                    : 'aspect-[6/5] max-w-[295px]'
            }`}
          >
            <EditorialImage
              src={
                isDrinks
                  ? '/katha-photos/beverages/masala-chai.jpg'
                  : currentCategory.heroImage
              }
              alt={currentCategory.heroAlt}
              priority
              sizes="300px"
              containerClassName="relative w-full h-full rounded-xl overflow-hidden bg-[#F1E3C4]/35"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Complete Beverages Photo Gallery for Coffee & Drinks (Zero Star/Sparkles Icons) */}
      {isDrinks && (
        <section className="space-y-6 border-t border-[#774D78]/15 pt-10">
          <ScrollReveal className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#774D78]">
              <Coffee className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="section-eyebrow">Beverage Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#2A1C2B]">
              Hot Chai, Cocoa &amp; Sparkling Stories
            </h2>
            <p className="text-sm text-[#635364]">
              Tap any drink below to see it closer in the center of your screen.
            </p>
          </ScrollReveal>

          <BeverageShowcaseGrid cards={SPARKLING_STORIES_CARDS} />
        </section>
      )}

      {/* Dedicated Category Dishes */}
      <MenuExplorer
        categories={categories}
        items={categoryItems}
        lockedCategorySlug={currentCategory.slug}
      />

      {/* Cross-Navigation to Other Dedicated Menus */}
      <section className="space-y-6 pt-8 border-t border-[#774D78]/15">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
            Explore other sections
          </h2>
          <Link
            href="/menu"
            className="interactive-btn font-menu text-xs font-semibold text-[#774D78] hover:text-[#5D3A5E] whitespace-nowrap"
          >
            View all dishes
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/menu/${cat.slug}`}
              className="interactive-media group glass-panel rounded-xl p-5 flex items-center justify-between gap-4 hover:bg-white"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#774D78]/18 bg-[#F1E3C4]/55 text-[#774D78] group-hover:bg-[#774D78] group-hover:text-white transition-colors">
                  <CategoryIcon slug={cat.slug} className="h-4 w-4" />
                </span>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-menu text-sm font-semibold text-[#2A1C2B] group-hover:text-[#774D78] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#635364] line-clamp-1">
                    {cat.shortSummary}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-[#635364] group-hover:text-[#774D78] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
