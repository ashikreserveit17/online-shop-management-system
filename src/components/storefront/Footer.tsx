import React from 'react';
import { useShop } from '../../context/ShopContext';
import { SabasLogo } from '../SabasLogo';
import { ShieldCheck, RefreshCw, Truck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setSelectedCategory, setIsOrdersOpen, setIsCustomerLoginOpen, formatTaka } = useShop();

  return (
    <footer className="bg-[#042013] text-slate-300 text-xs border-t border-emerald-900/60">
      {/* Trust Badges Bar */}
      <div className="border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#68BC20] shrink-0" />
            <div>
              <div className="font-bold text-white">{settings.exchangeGuaranteeDays}-Day Free Exchange</div>
              <div className="text-[11px] text-emerald-200/80">Doorstep courier pickup nationwide</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#68BC20] shrink-0" />
            <div>
              <div className="font-bold text-white">Nationwide Express Delivery</div>
              <div className="text-[11px] text-emerald-200/80">Free on orders over {formatTaka(settings.freeShippingThreshold)} with live tracking</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#68BC20] shrink-0" />
            <div>
              <div className="font-bold text-white">Secure MFS & Card Checkout</div>
              <div className="text-[11px] text-emerald-200/80">bKash, Nagad, Visa, Mastercard & Verified COD</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#68BC20] shrink-0" />
            <div>
              <div className="font-bold text-white">100% Authentic Quality</div>
              <div className="text-[11px] text-emerald-200/80">Certified genuine & quality inspected stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <SabasLogo size="md" theme="dark" />
          <p className="text-emerald-100/70 leading-relaxed text-[11px] max-w-xs mt-3">
            {settings.tagline}. Curated sustainable fashion, modern electronics, kitchen appliances, and premium lifestyle essentials.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Product Collections
          </div>
          <ul className="space-y-1.5 text-emerald-200/70">
            <li>
              <button
                onClick={() => setSelectedCategory('womens_wardrobe')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Women's Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('mens_wardrobe')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Men's Wardrobe
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('phones_telecom')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Phones & Gadgets
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('home_appliances')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Home Appliances
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('office_equipment')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Office Equipment
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('automobiles')}
                className="hover:text-[#68BC20] transition-colors cursor-pointer"
              >
                Automobiles & Mobility
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Customer Support
          </div>
          <ul className="space-y-1.5 text-emerald-200/70">
            <li>
              <button onClick={() => setIsOrdersOpen(true)} className="hover:text-[#68BC20] transition-colors cursor-pointer">
                Order Tracking & Receipts
              </button>
            </li>
            <li>
              <button onClick={() => setIsOrdersOpen(true)} className="hover:text-[#68BC20] transition-colors cursor-pointer">
                14-Day Free Exchange Portal
              </button>
            </li>
            <li>
              <button onClick={() => setIsCustomerLoginOpen(true)} className="hover:text-[#68BC20] transition-colors cursor-pointer">
                Customer Account Sign In
              </button>
            </li>
            <li>
              <span className="text-emerald-300 font-mono text-[11px]">{settings.supportPhone}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            GreenCart Corporate Office
          </div>
          <p className="text-emerald-200/70 leading-relaxed text-[11px]">
            House 42, Road 11, Banani, Dhaka 1213.<br />
            Support Email: {settings.supportEmail}
          </p>
          <div className="pt-2 text-[10px] text-emerald-400/80 font-mono">
            All prices listed in Bangladeshi Taka (৳ BDT)
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-emerald-950 py-6 text-center text-emerald-400/60 text-[11px]">
        © {new Date().getFullYear()} {settings.storeName}. All rights reserved. Good Choice, Greener Tomorrow.
      </div>
    </footer>
  );
};
