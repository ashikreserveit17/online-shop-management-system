import React, { useState } from 'react';
import { resolveImageUrl, IMAGES } from '../../data/assets';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = 'Product image',
  className = '',
  fallbackSrc,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveImageUrl(src));

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.dataset.triedFallback1) {
      target.dataset.triedFallback1 = '1';
      const fb = fallbackSrc || IMAGES.wardrobe;
      setCurrentSrc(fb);
      target.src = fb;
    } else if (!target.dataset.triedFallback2) {
      target.dataset.triedFallback2 = '1';
      const fb2 = IMAGES.hero;
      setCurrentSrc(fb2);
      target.src = fb2;
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#06182B] to-[#0A2540] text-white p-4 text-center select-none ${className}`}
      >
        <span className="font-bold text-xs tracking-wider text-[#68BC20]">
          GreenCart Collection
        </span>
        <span className="text-[10px] text-slate-300 mt-1 line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
      {...props}
    />
  );
};
