'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

const FALLBACK = '/images/kaos1.jpeg';

export default function ProductImage({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className = '',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src ?? FALLBACK);
  const [errored, setErrored] = useState(false);

  const isExternal = imgSrc.startsWith('http');

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={{ objectPosition: 'center top' }}
      unoptimized={isExternal}
      onError={() => {
        if (!errored) {
          setErrored(true);
          setImgSrc(FALLBACK);
        }
      }}
    />
  );
}
