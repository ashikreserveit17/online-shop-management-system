import React from 'react';

export const LOGO_URL = '/assets/aistudio/GreenCart_Eco_Shopping_Logo_7add3268.png';

interface SabasLogoProps {
  variant?: 'badge' | 'emblem' | 'compact' | 'full';
  subtitle?: string;
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SabasLogo: React.FC<SabasLogoProps> = ({
  subtitle,
  className = '',
  theme = 'light',
  size = 'md',
}) => {
  const isDark = theme === 'dark';

  // Sizing configuration
  const heightClass =
    size === 'sm'
      ? 'h-10 sm:h-12'
      : size === 'lg'
      ? 'h-20 sm:h-24 md:h-28'
      : size === 'xl'
      ? 'h-24 sm:h-30 md:h-36'
      : 'h-16 sm:h-20 md:h-22'; // Standard storefront header

  // In dark or admin card context
  if (isDark) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-emerald-100/90 select-none ${className}`}
      >
        <img
          src={LOGO_URL}
          alt="GreenCart - Good Choice, Greener Tomorrow"
          className={`${size === 'lg' ? 'h-16 sm:h-20' : 'h-12 sm:h-14'} w-auto max-w-[210px] object-contain shrink-0`}
        />
        {subtitle && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EBF7EE] border border-[#16A34A]/30 text-[#064E3B] text-[10px] font-extrabold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
            <span className="truncate">{subtitle}</span>
          </div>
        )}
      </div>
    );
  }

  // Storefront navigation header
  return (
    <div className={`inline-flex flex-col sm:flex-row items-center gap-2 select-none ${className}`}>
      <img
        src={LOGO_URL}
        alt="GreenCart - Good Choice, Greener Tomorrow"
        className={`${heightClass} w-auto max-w-[280px] sm:max-w-[340px] object-contain shrink-0 transition-transform duration-200 hover:scale-[1.02]`}
      />
      {subtitle && (
        <span className="inline-block text-[10px] font-bold tracking-wider text-[#064E3B] uppercase bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/30">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export const GreenCartLogo = SabasLogo;
