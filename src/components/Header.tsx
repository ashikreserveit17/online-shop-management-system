import React from 'react';
import { useShop } from '../context/ShopContext';
import { SabasLogo } from './SabasLogo';
import { ShoppingBag, Package, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    setSelectedCategory,
    cartCount,
    setIsCartOpen,
    setIsOrdersOpen,
    setIsCustomerLoginOpen,
    customerUser,
    myOrders,
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top brand accent gradient line matching GreenCart logo palette */}
      <div className="h-1 bg-gradient-to-r from-[#064E3B] via-[#16A34A] to-[#68BC20]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[96px] sm:min-h-[110px] py-2 sm:py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo - enlarged and prominent */}
        <button
          onClick={() => setSelectedCategory('all')}
          className="text-left group cursor-pointer focus:outline-none flex items-center shrink-0"
          aria-label="GreenCart Home"
        >
          <SabasLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
          <button
            onClick={() => setSelectedCategory('all')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            All Catalog
          </button>
          <button
            onClick={() => setSelectedCategory('womens_wardrobe')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Women's
          </button>
          <button
            onClick={() => setSelectedCategory('mens_wardrobe')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Men's
          </button>
          <button
            onClick={() => setSelectedCategory('phones_telecom')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Electronics
          </button>
          <button
            onClick={() => setSelectedCategory('home_appliances')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Home Appliances
          </button>
          <button
            onClick={() => setSelectedCategory('office_equipment')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Office
          </button>
          <button
            onClick={() => setSelectedCategory('automobiles')}
            className="hover:text-[#16A34A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Mobility
          </button>
        </nav>

        {/* Zone 3: Customer Actions (Zero Admin Panel button on customer storefront) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer Login / Profile Button */}
          <button
            onClick={() => setIsCustomerLoginOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#064E3B] hover:bg-emerald-50/80 rounded-xl transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-[#16A34A]" />
            <span className="hidden sm:inline">
              {customerUser ? customerUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Customer Orders: Only shows badge when logged in with active orders! */}
          <button
            onClick={() => {
              if (!customerUser) {
                setIsCustomerLoginOpen(true);
              } else {
                setIsOrdersOpen(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#064E3B] hover:bg-emerald-50/80 rounded-xl transition-colors cursor-pointer"
            title={customerUser ? 'Track Your Orders & Exchanges' : 'Sign in to view your orders'}
          >
            <Package className="w-4 h-4 text-[#064E3B]" />
            <span className="hidden sm:inline">Orders</span>
            {customerUser && myOrders.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-emerald-800 font-bold bg-[#DCFCE7] border border-[#16A34A]/30 px-1.5 py-0.5 rounded-full">
                {myOrders.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#053D2E] rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#68BC20]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="font-mono tabular-nums text-[11px] font-bold px-1.5 py-0.2 bg-[#16A34A] text-white rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
