import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import EditorialImage from '@/components/EditorialImage';
import ScrollReveal from '@/components/ScrollReveal';
import { getJournalPostBySlug, getJournalPosts } from '@/lib/wordpress';

interface JournalArticleProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getJournalPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: JournalArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) {
    return { title: 'The Katha Journal' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function JournalArticlePage({
  params,
}: JournalArticleProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getJournalPostBySlug(slug),
    getJournalPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const isLowRes = post.featuredImage.includes('/more/');
  const isTallMore =
    post.featuredImage.includes('space-13') ||
    post.featuredImage.includes('food-21');
  const isPortraitHighRes =
    post.featuredImage.includes('campus-walkway') ||
    post.featuredImage.includes('exterior-evening') ||
    post.featuredImage.includes('bookshelf-corner');

  return (
    <article className="mx-auto max-w-4xl px-5 sm:px-8 pt-10 sm:pt-14 space-y-10">
      <div>
        <Link
          href="/journal"
          className="interactive-btn font-menu inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#635364] hover:text-[#774D78]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to The Katha Journal
        </Link>
      </div>

      {/* Article Header */}
      <ScrollReveal className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#635364]">
          <span className="font-medium text-[#774D78]">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <span>{post.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-medium leading-[1.12] tracking-tight text-[#2A1C2B]">
          {post.title}
        </h1>

        <p className="text-lg leading-relaxed text-[#635364] max-w-3xl">
          {post.intro}
        </p>
      </ScrollReveal>

      {/* Featured Image — Respects Low-Res Dimensions & Zero Cropping */}
      <div className="flex justify-center">
        <div
          className={`interactive-media relative w-full overflow-hidden rounded-2xl border border-[#774D78]/16 bg-[#F1E3C4]/40 ${
            isLowRes
              ? isTallMore
                ? 'aspect-[9/16] max-w-[240px]'
                : 'aspect-[6/5] max-w-[300px]'
              : isPortraitHighRes
                ? 'aspect-[3/4] max-w-md'
                : 'aspect-square max-w-lg'
          }`}
        >
          <EditorialImage
            src={post.featuredImage}
            alt={post.featuredAlt}
            priority
            sizes={isLowRes ? '300px' : '(max-width: 896px) 100vw, 520px'}
            containerClassName="relative w-full h-full"
            className="object-contain p-1.5"
          />
        </div>
      </div>

      {/* Structured Readable Body */}
      <ScrollReveal className="glass-panel rounded-2xl p-7 sm:p-10 space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading} className="space-y-3.5 max-w-[68ch]">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base leading-[1.75] text-[#2A1C2B]/85"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {/* Relevant Next Action */}
        <div className="pt-6 border-t border-[#774D78]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-[#635364]">
            Hungry already or planning a stop?
          </p>
          <Link
            href={post.relatedLink.href}
            className="interactive-btn inline-flex items-center gap-2 rounded-lg bg-[#774D78] px-5 py-2.5 text-sm font-medium text-white whitespace-nowrap shrink-0 hover:bg-[#5D3A5E] self-start sm:self-auto"
          >
            {post.relatedLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Related Stories */}
      {relatedPosts.length > 0 && (
        <section className="pt-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
            More from The Katha Journal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/journal/${rel.slug}`}
                className="interactive-media group glass-panel rounded-2xl p-6 space-y-2.5 hover:bg-white"
              >
                <div className="flex items-center gap-2 text-xs text-[#635364]">
                  <span className="font-medium text-[#774D78]">{rel.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rel.readTime}</span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#2A1C2B] group-hover:text-[#774D78] transition-colors">
                  {rel.title}
                </h3>
                <p className="text-sm text-[#635364] line-clamp-2">
                  {rel.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
