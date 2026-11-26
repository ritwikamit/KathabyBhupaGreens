'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import EditorialImage from '@/components/EditorialImage';
import type { GalleryGroup, GalleryPhoto } from '@/lib/types/wordpress';

const GROUPS: Array<'All' | GalleryGroup> = [
  'All',
  'Food and drinks',
  'Restaurant interiors',
  'Table settings',
  'Group and family dining',
  'Seasonal highlights',
];

function getAspectClass(aspect: GalleryPhoto['aspect']) {
  switch (aspect) {
    case 'landscape':
      return 'aspect-[16/9]';
    case 'square':
      return 'aspect-square';
    case 'tall':
      return 'aspect-[3/5]';
    case 'portrait':
      return 'aspect-[4/5]';
    default:
      return 'aspect-[6/5]';
  }
}

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [selectedGroup, setSelectedGroup] = useState<'All' | GalleryGroup>('All');
  const [activeId, setActiveId] = useState<string | null>(null);

  const availableGroups = GROUPS.filter(
    (g) => g === 'All' || photos.some((p) => p.group === g)
  );

  const visiblePhotos =
    selectedGroup === 'All'
      ? photos
      : photos.filter((photo) => photo.group === selectedGroup);

  const highResPhotos = visiblePhotos.filter((p) => !p.lowRes);
  const compactSnapshots = visiblePhotos.filter((p) => p.lowRes);

  const activeIndex = activeId
    ? visiblePhotos.findIndex((p) => p.id === activeId)
    : -1;
  const activePhoto = activeIndex >= 0 ? visiblePhotos[activeIndex] : null;

  useEffect(() => {
    if (!activePhoto) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
      if (e.key === 'ArrowRight') {
        const next = visiblePhotos[(activeIndex + 1) % visiblePhotos.length];
        if (next) setActiveId(next.id);
      }
      if (e.key === 'ArrowLeft') {
        const prev =
          visiblePhotos[
            (activeIndex - 1 + visiblePhotos.length) % visiblePhotos.length
          ];
        if (prev) setActiveId(prev.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activePhoto, activeIndex, visiblePhotos]);

  return (
    <div className="space-y-12">
      {/* Filter Controls */}
      <div
        role="group"
        aria-label="Filter gallery photographs"
        className="flex flex-wrap items-center gap-2"
      >
        {availableGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => {
              setSelectedGroup(group);
              setActiveId(null);
            }}
            className={`font-menu rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedGroup === group
                ? 'bg-[#774D78] text-white'
                : 'glass-panel text-[#2A1C2B]/85 hover:bg-[#F1E3C4]/50'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* High-Resolution Feature Spaces */}
      {highResPhotos.length > 0 && (
        <div className="space-y-4">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-7 space-y-7">
            {highResPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className="interactive-media group block w-full break-inside-avoid text-left glass-panel rounded-2xl overflow-hidden"
              >
                <div
                  className={`relative w-full overflow-hidden bg-[#F1E3C4]/35 ${getAspectClass(photo.aspect)}`}
                >
                  <EditorialImage
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    containerClassName="relative w-full h-full"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-5 sm:p-6 space-y-1.5">
                  <p className="text-xs text-[#774D78] font-semibold">
                    {photo.group}
                  </p>
                  <h3 className="font-serif text-2xl font-medium text-[#2A1C2B]">
                    {photo.title}
                  </h3>
                  <p className="text-sm text-[#635364] leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Snapshots Grid (Sized Specifically So Smaller Real Photos Stay Crisp & Sharp) */}
      {compactSnapshots.length > 0 && (
        <div className="space-y-5 pt-2">
          <div className="space-y-1">
            <span className="section-eyebrow text-[#774D78] block">
              Everyday Moments
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A1C2B]">
              From our tables and corners
            </h3>
            <p className="text-sm text-[#635364]">
              Real snapshots from around the cafe — tap any photo to take a closer look.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
            {compactSnapshots.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className="interactive-media group flex flex-col h-full w-full text-left glass-panel rounded-xl overflow-hidden"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F1E3C4]/40 shrink-0">
                  <EditorialImage
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 220px"
                    containerClassName="relative w-full h-full"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="p-3 space-y-1 border-t border-[#774D78]/10 flex-1 flex flex-col justify-start">
                  <p className="font-serif text-base font-semibold text-[#2A1C2B] leading-snug line-clamp-1">
                    {photo.title}
                  </p>
                  <p className="text-xs text-[#635364] leading-snug line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Viewport-Centered Portaled Lightbox (Caps Size for Compact Snapshots to Prevent Blur) */}
      {activePhoto &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1F1520]/88 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setActiveId(null)}
          >
            <div
              className={`relative w-full max-h-[92svh] flex flex-col overflow-hidden rounded-2xl border border-[#AF8EB1]/25 bg-[#FBF7EE] shadow-2xl ${
                activePhoto.lowRes ? 'max-w-[350px]' : 'max-w-4xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative w-full bg-[#1F1520] ${
                  activePhoto.lowRes
                    ? 'h-[48svh] max-h-[430px]'
                    : 'h-[60svh] sm:h-[66svh] max-h-[600px]'
                }`}
              >
                <EditorialImage
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  sizes={
                    activePhoto.lowRes
                      ? '340px'
                      : '(max-width: 1024px) 100vw, 900px'
                  }
                  containerClassName="relative w-full h-full"
                  className="object-contain p-2.5"
                />
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Close photograph viewer"
                  className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1520]/80 text-white hover:bg-[#774D78] transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                {visiblePhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const prev =
                          visiblePhotos[
                            (activeIndex - 1 + visiblePhotos.length) %
                              visiblePhotos.length
                          ];
                        if (prev) setActiveId(prev.id);
                      }}
                      aria-label="Previous photograph"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1520]/80 text-white hover:bg-[#774D78] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          visiblePhotos[
                            (activeIndex + 1) % visiblePhotos.length
                          ];
                        if (next) setActiveId(next.id);
                      }}
                      aria-label="Next photograph"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1520]/80 text-white hover:bg-[#774D78] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5">
                <div>
                  <p className="text-xs font-semibold text-[#774D78]">
                    {activePhoto.group}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2A1C2B]">
                    {activePhoto.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#635364]">
                    {activePhoto.caption}
                  </p>
                </div>
                <p className="text-xs text-[#635364] tabular-nums shrink-0">
                  {activeIndex + 1} / {visiblePhotos.length}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
