'use client';

import { useMenuBookModal } from '@/components/MenuBookModalContext';

interface OpenMenuBookButtonProps {
  categorySlug?: string;
  className?: string;
  children: React.ReactNode;
  onBeforeOpen?: () => void;
}

export default function OpenMenuBookButton({
  categorySlug,
  className,
  children,
  onBeforeOpen,
}: OpenMenuBookButtonProps) {
  const { openMenuBook } = useMenuBookModal();

  return (
    <button
      type="button"
      onClick={() => {
        onBeforeOpen?.();
        openMenuBook(categorySlug);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
