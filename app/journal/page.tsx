import type { Metadata } from 'next';
import { Feather } from 'lucide-react';
import JournalExplorer from '@/components/JournalExplorer';
import PageHeroBanner from '@/components/PageHeroBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { getJournalPosts } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Food Stories & Updates',
  description:
    'Read friendly menu notes, food stories, seasonal picks, and updates from Katha by Bhupa Greens in Darbhanga.',
};

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-7 sm:pt-10 space-y-12">
      {/* Compact Page Hero Banner from pages hero/journal.jpg */}
      <PageHeroBanner
        imageSrc="/katha-photos/pages-hero/journal.webp"
        imageAlt="Warm sunlit coral seating and chandeliers inside Katha by Bhupa Greens"
        icon={<Feather className="h-4 w-4 shrink-0" aria-hidden="true" />}
        eyebrow="Stories & Notes"
        title="The Katha Journal"
        description="Good food brings people together. Here we share simple notes about our dishes, favourite pairings, and helpful tips for visiting us."
      />

      <ScrollReveal>
        <JournalExplorer posts={posts} />
      </ScrollReveal>
    </div>
  );
}
