import type { Metadata } from 'next';
import { UtensilsCrossed } from 'lucide-react';
import MenuExperienceSwitch from '@/components/MenuExperienceSwitch';
import ScrollReveal from '@/components/ScrollReveal';
import { getMenuCategories, getMenuItems } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Open the Katha by Bhupa Greens menu book — Indian favourites, handi biryani, South Indian dosas, Korean bites, sandwiches, fresh chai, coffee, and desserts.',
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 pt-6 sm:pt-12 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <ScrollReveal className="max-w-2xl space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-[#774D78]">
          <UtensilsCrossed className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Katha by Bhupa Greens</span>
        </div>
        <h1 className="font-menu text-3xl sm:text-5xl font-semibold tracking-tight text-[#2A1C2B]">
          The Katha Menu
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#635364]">
          Turn through the menu book page by page, or switch to Search &amp; Filter to jump straight to any dish, chai, coffee, or dessert.
        </p>
      </ScrollReveal>

      {/* Interactive Page-by-Page Menu Book + Optional Searchable View */}
      <MenuExperienceSwitch categories={categories} items={items} />
    </div>
  );
}
