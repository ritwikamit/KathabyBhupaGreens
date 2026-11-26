'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import MenuBook from '@/components/MenuBook';
import type { MenuCategory, MenuItem } from '@/lib/types/wordpress';

interface MenuBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  items: MenuItem[];
  initialCategorySlug?: string;
}

export default function MenuBookDialog({
  isOpen,
  onClose,
  categories,
  items,
  initialCategorySlug,
}: MenuBookDialogProps) {
  // Lock page scrolling while keeping current scroll position undisturbed
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Katha Menu Book"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120913]/82 backdrop-blur-md p-3 sm:p-6 overflow-hidden"
          onClick={onClose}
        >
          {/* Ambient Soft Candlelight Glow Behind the Book */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[46rem] rounded-full bg-[#774D78]/25 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuBook
              key={initialCategorySlug || 'book-start'}
              categories={categories}
              items={items}
              initialCategorySlug={initialCategorySlug}
              variant="modal"
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
