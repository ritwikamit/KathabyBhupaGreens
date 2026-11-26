'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import MenuBookDialog from '@/components/MenuBookDialog';
import type { MenuCategory, MenuItem } from '@/lib/types/wordpress';

interface MenuBookModalContextValue {
  isOpen: boolean;
  openMenuBook: (categorySlug?: string) => void;
  closeMenuBook: () => void;
}

const MenuBookModalContext = createContext<MenuBookModalContextValue>({
  isOpen: false,
  openMenuBook: () => undefined,
  closeMenuBook: () => undefined,
});

export function useMenuBookModal() {
  return useContext(MenuBookModalContext);
}

export function MenuBookModalProvider({
  children,
  categories,
  items,
}: {
  children: React.ReactNode;
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  const pathname = usePathname();
  const [openState, setOpenState] = useState<{
    pathname: string;
    categorySlug?: string;
  } | null>(null);

  const isOpen = openState !== null && openState.pathname === pathname;

  const openMenuBook = useCallback(
    (categorySlug?: string) => {
      setOpenState({ pathname, categorySlug });
    },
    [pathname],
  );

  const closeMenuBook = useCallback(() => {
    setOpenState(null);
  }, []);

  return (
    <MenuBookModalContext.Provider
      value={{ isOpen, openMenuBook, closeMenuBook }}
    >
      {children}
      <MenuBookDialog
        isOpen={isOpen}
        onClose={closeMenuBook}
        categories={categories}
        items={items}
        initialCategorySlug={openState?.categorySlug}
      />
    </MenuBookModalContext.Provider>
  );
}
