import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import JournalExplorer from '@/components/JournalExplorer';
import { getJournalPosts } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read the Katha by Bhupa Greens blog for menu highlights, culinary stories, seasonal drinks, and Darbhanga dining updates.',
};

export default async function BlogPage() {
  const posts = await getJournalPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 sm:pt-14 space-y-12">
      <header className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-[#774D78]">
          <Newspaper className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="section-eyebrow">Katha Blog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#2A1C2B]">
          Stories, Flavours &amp; Updates
        </h1>
        <p className="text-base leading-relaxed text-[#635364]">
          Explore menu guides, seasonal beverage notes, and dining updates straight from Katha by Bhupa Greens in Darbhanga.
        </p>
      </header>

      <JournalExplorer posts={posts} />
    </div>
  );
}
