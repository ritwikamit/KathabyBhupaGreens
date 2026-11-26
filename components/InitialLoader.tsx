'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { SITE_CONFIG } from '@/lib/data/katha-data';

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let dismissed = false;

    const scheduleHide = () => {
      if (dismissed) return;
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsed);
      hideTimer = setTimeout(() => {
        dismissed = true;
        setVisible(false);
      }, delay);
    };

    if (document.readyState === 'complete') {
      scheduleHide();
    } else {
      window.addEventListener('load', scheduleHide, { once: true });
      const fallbackTimer = setTimeout(scheduleHide, 1200);
      return () => {
        window.removeEventListener('load', scheduleHide);
        clearTimeout(fallbackTimer);
        if (hideTimer) clearTimeout(hideTimer);
      };
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading Katha by Bhupa Greens"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FBF7EE] px-6"
        >
          {/* Ambient soft palette glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#AF8EB1]/20 blur-3xl" />
            <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-[#B7D0CC]/25 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center gap-5 text-center"
          >
            <Image
              src={SITE_CONFIG.logos.katha}
              alt="Katha by Bhupa Greens"
              width={320}
              height={150}
              priority
              referrerPolicy="no-referrer"
              className="h-24 sm:h-32 md:h-36 w-auto object-contain"
            />

            <p className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-[#774D78] inline-flex items-baseline">
              <span>Loading</span>
              <span className="loading-dot-1 inline-block ml-0.5">.</span>
              <span className="loading-dot-2 inline-block">.</span>
              <span className="loading-dot-3 inline-block">.</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
