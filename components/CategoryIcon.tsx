import {
  CakeSlice,
  ChefHat,
  Coffee,
  Flame,
  Sandwich,
  Soup,
  UtensilsCrossed,
} from 'lucide-react';

interface CategoryIconProps {
  slug: string;
  className?: string;
}

export default function CategoryIcon({
  slug,
  className = 'h-4 w-4',
}: CategoryIconProps) {
  switch (slug) {
    case 'indian-favourites':
      return <Flame className={className} aria-hidden="true" />;
    case 'biryani-and-rice':
      return <Soup className={className} aria-hidden="true" />;
    case 'south-indian':
      return <UtensilsCrossed className={className} aria-hidden="true" />;
    case 'korean-bites':
      return <ChefHat className={className} aria-hidden="true" />;
    case 'snacks-and-sandwiches':
      return <Sandwich className={className} aria-hidden="true" />;
    case 'coffee-and-drinks':
      return <Coffee className={className} aria-hidden="true" />;
    case 'desserts':
      return <CakeSlice className={className} aria-hidden="true" />;
    default:
      return <UtensilsCrossed className={className} aria-hidden="true" />;
  }
}
