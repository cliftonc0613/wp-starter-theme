'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useCallback } from 'react';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  /**
   * Optional blur data URL for custom placeholder.
   * If provided, uses Next.js native blur placeholder.
   * If not provided, uses CSS-based blur effect.
   */
  blurDataURL?: string;
}

/**
 * BlurImage - Next.js Image wrapper with blur placeholder support
 *
 * Provides a Medium-style blur-up loading effect for images.
 * - If blurDataURL is provided: uses Next.js native placeholder="blur"
 * - If no blurDataURL: uses CSS-based blur effect with smooth transition
 */
export function BlurImage({
  blurDataURL,
  className = '',
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // If blurDataURL is provided, use Next.js native blur placeholder
  if (blurDataURL) {
    return (
      <Image
        {...props}
        className={className}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />
    );
  }

  // Otherwise, use CSS-based blur effect
  return (
    <Image
      {...props}
      className={`blur-image ${isLoaded ? 'blur-image--loaded' : ''} ${className}`}
      onLoad={handleLoad}
    />
  );
}

export default BlurImage;
