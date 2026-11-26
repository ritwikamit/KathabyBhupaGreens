'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, Volume2, VolumeX } from 'lucide-react';
import type { ReelItem } from '@/lib/types/wordpress';

interface ReelPlayerProps {
  reel: ReelItem;
  isMuted: boolean;
  onToggleMute: () => void;
  compact?: boolean;
  hideCaption?: boolean;
}

export function PureReelPlayer({
  reel,
  isMuted,
  onToggleMute,
  compact = false,
  hideCaption = false,
}: ReelPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play on loop when the video enters the viewport, pause immediately when scrolled away
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = Boolean(entry && entry.isIntersecting);
        setIsInView(visible);
        if (!visible) {
          setUserPaused(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Synchronize native HTML5 playback & audio smoothly with viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (isInView && !userPaused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => undefined);
        });
      }
    } else {
      video.pause();
    }
  }, [isInView, isMuted, userPaused]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  return (
    <article className="flex flex-col space-y-3 w-full">
      {/* Pure 9:16 Video Frame Only — Zero Instagram Chrome, Only Mute/Unmute Button */}
      <div
        ref={containerRef}
        className={`interactive-media group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-[#1F1520] ${
          compact
            ? 'border-2 border-[#F1E3C4]/85 ring-4 ring-[#774D78]/40 shadow-[0_24px_60px_-15px_rgba(15,10,16,0.75)] max-h-[76vh]'
            : 'border border-[#774D78]/20 shadow-xl'
        }`}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl ?? undefined}
          poster={reel.posterImage}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onClick={handleTogglePlay}
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full cursor-pointer object-cover"
        />

        {/* Subtle pause indicator only when user explicitly taps to pause */}
        {userPaused && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={`Play ${reel.title}`}
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#1F1520]/30 transition-opacity"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#1F1520]/75 text-white backdrop-blur-md">
              <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
            </span>
          </button>
        )}

        {/* Compact Mute / Unmute Button Only (Muted by Default) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          aria-pressed={!isMuted}
          aria-label={isMuted ? `Unmute ${reel.title}` : `Mute ${reel.title}`}
          title={isMuted ? 'Unmute' : 'Mute'}
          className={`absolute bottom-3.5 right-3.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-150 ${
            isMuted
              ? 'border-white/25 bg-[#1F1520]/75 text-white hover:bg-[#1F1520]/90'
              : 'border-[#774D78] bg-[#774D78] text-white hover:bg-[#5D3A5E]'
          }`}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        {/* Hairline bottom progress track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/15"
        >
          <div
            className="h-full bg-[#AF8EB1] transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Minimal Caption Below Video Box */}
      {!hideCaption && (
        <div className="flex items-start justify-between gap-3 px-0.5">
          <div className="space-y-1 min-w-0">
            <h3 className="font-serif text-xl font-medium text-[#2A1C2B] leading-snug">
              {reel.title}
            </h3>
            <p className="text-xs leading-relaxed text-[#635364]">
              {reel.subtitle}
            </p>
          </div>

          <a
            href={reel.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${reel.title} on Instagram`}
            title="View original post"
            className="interactive-btn mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#774D78]/18 bg-white/75 text-[#635364] hover:border-[#774D78]/45 hover:text-[#774D78]"
          >
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

export function HeroReelBox({ reel }: { reel: ReelItem }) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full max-w-[250px] sm:max-w-[330px] lg:max-w-[380px] mx-auto lg:ml-auto lg:mr-0">
      <PureReelPlayer
        reel={reel}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        compact
        hideCaption
      />
    </div>
  );
}

export default function ReelsShowcase({
  reels,
  compactSingle = false,
}: {
  reels: ReelItem[];
  compactSingle?: boolean;
}) {
  // Muted by default; only one video unmuted at a time
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  if (reels.length === 1) {
    const reel = reels[0];
    return (
      <div
        className={
          compactSingle
            ? 'w-full max-w-[235px] sm:max-w-[270px] mx-auto'
            : 'w-full max-w-[290px] sm:max-w-[360px] mx-auto lg:mx-0'
        }
      >
        <PureReelPlayer
          reel={reel}
          isMuted={unmutedId !== reel.id}
          onToggleMute={() =>
            setUnmutedId((prev) => (prev === reel.id ? null : reel.id))
          }
        />
      </div>
    );
  }

  const gridCols =
    reels.length >= 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-6 lg:gap-7`}>
      {reels.map((reel) => {
        const isMuted = unmutedId !== reel.id;
        return (
          <div key={reel.id} className="w-full max-w-[340px] mx-auto sm:max-w-none">
            <PureReelPlayer
              reel={reel}
              isMuted={isMuted}
              onToggleMute={() =>
                setUnmutedId((prev) => (prev === reel.id ? null : reel.id))
              }
            />
          </div>
        );
      })}
    </div>
  );
}
