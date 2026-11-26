'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

export default function EditorialImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = 'object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-[#F1E3C4]/45',
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${containerClassName} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F1E3C4]/70 to-[#B7D0CC]/45 p-6 text-center text-[#635364]`}
      >
        <UtensilsCrossed className="h-6 w-6 opacity-65 text-[#774D78]" aria-hidden="true" />
        <span className="text-xs font-medium max-w-[20ch]">{alt}</span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={className}
      />
    </div>
  );
}
