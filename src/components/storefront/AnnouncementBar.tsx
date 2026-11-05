import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, RefreshCw } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useShop();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementBar.enabled || dismissed) return null;

  return (
    <div className="bg-[#064E3B] text-emerald-50 text-xs py-2 px-4 border-b border-[#043A2B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#68BC20] font-bold tracking-wide">
            <RefreshCw className="w-3.5 h-3.5 text-[#68BC20] shrink-0" />
            <span>{settings.exchangeGuaranteeDays}-Day Free Exchange</span>
          </span>
          <span className="text-emerald-400/60" aria-hidden="true">·</span>
          <span className="truncate text-white font-medium">{settings.announcementBar.text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-emerald-300 hover:text-white transition-colors shrink-0 p-0.5 cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
