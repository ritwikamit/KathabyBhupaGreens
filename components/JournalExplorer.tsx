'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EditorialImage from '@/components/EditorialImage';
import type { JournalCategory, JournalPost } from '@/lib/types/wordpress';

const CATEGORIES: Array<'All' | JournalCategory> = [
  'All',
  'Menu Notes',
  'Food & Ingredients',
  'Seasonal Picks',
  'Restaurant Updates',
  'Visit Katha',
];

export default function JournalExplorer({ posts }: { posts: JournalPost[] }) {
  const [selected, setSelected] = useState<'All' | JournalCategory>('All');

  const filtered =
    selected === 'All'
      ? posts
      : posts.filter((post) => post.category === selected);

  return (
    <div className="space-y-10">
      <div
        role="group"
        aria-label="Filter journal stories by category"
        className="flex flex-wrap items-center gap-2 border-y border-[#774D78]/15 py-4"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelected(category)}
            className={`font-menu rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selected === category
                ? 'bg-[#774D78] text-white'
                : 'text-[#635364] hover:text-[#2A1C2B] hover:bg-[#F1E3C4]/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-xl p-10 text-center space-y-3">
          <h2 className="text-2xl font-medium text-[#2A1C2B]">
            Nothing here just yet
          </h2>
          <p className="text-sm text-[#635364]">
            We will share new notes under {selected} soon. In the meantime, explore all our stories.
          </p>
          <button
            type="button"
            onClick={() => setSelected('All')}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5D3A5E]"
          >
            Show All Stories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-stretch">
          {filtered.map((post) => (
            <article key={post.id} className="group flex flex-col h-full space-y-4">
              <Link
                href={`/journal/${post.slug}`}
                className="interactive-media relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#774D78]/16 block bg-[#F1E3C4]/45 shrink-0"
              >
                <EditorialImage
                  src={post.featuredImage}
                  alt={post.featuredAlt}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  containerClassName="relative w-full h-full"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </Link>

                <div className="flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#635364]">
                      <span className="font-medium text-[#774D78]">
                        {post.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="font-serif text-2xl font-medium leading-snug text-[#2A1C2B] group-hover:text-[#774D78] transition-colors">
                      <Link href={`/journal/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-sm leading-relaxed text-[#635364]">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/journal/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2A1C2B] hover:text-[#774D78] transition-colors"
                  >
                    Read story
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </article>
          ))}
        </div>
      )}
    </div>
  );
}
