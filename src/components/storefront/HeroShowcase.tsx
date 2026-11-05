import React from 'react';
import { useShop } from '../../context/ShopContext';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export const HeroShowcase: React.FC = () => {
  const { settings, setSelectedCategory, products, setSelectedProduct, formatTaka } = useShop();

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF5] via-[#FAFDFB] to-white text-slate-900 border-b border-emerald-100/80">
      {/* Background ambient lighting matching GreenCart logo's leaf green & forest tones */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-b from-[#16A34A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] bg-gradient-to-tr from-[#68BC20]/12 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Brand Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF7EE] border border-[#16A34A]/30 text-xs text-[#064E3B] font-bold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>GreenCart Official Store</span>
              <span aria-hidden="true" className="text-emerald-300">·</span>
              <span>Bangladeshi Taka (৳)</span>
              <span aria-hidden="true" className="text-emerald-300">·</span>
              <span>14-Day Free Exchange</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#063B24] max-w-2xl leading-[1.15]">
              {settings.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              {settings.heroSubtitle}
            </p>

            {/* Value Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-emerald-200/60 max-w-lg">
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-[#064E3B] font-mono tabular-nums flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>100%</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">Authentic & Inspected</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-[#064E3B] font-mono tabular-nums flex items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-[#16A34A]" />
                  <span>14 Days</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">Doorstep Exchange</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-[#064E3B] font-mono tabular-nums flex items-center gap-1">
                  <Truck className="w-4 h-4 text-[#16A34A]" />
                  <span>Nationwide</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">Express Delivery</div>
              </div>
            </div>

            {/* Quick Category Buttons with GreenCart Colors */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 mr-1 font-semibold">Collections:</span>
              <button
                onClick={() => {
                  setSelectedCategory('womens_wardrobe');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#064E3B] hover:text-white font-semibold text-slate-700 rounded-xl transition-all border border-emerald-200/90 shadow-xs cursor-pointer"
              >
                Women's Collection
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('mens_wardrobe');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#064E3B] hover:text-white font-semibold text-slate-700 rounded-xl transition-all border border-emerald-200/90 shadow-xs cursor-pointer"
              >
                Men's Wardrobe
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('phones_telecom');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#064E3B] hover:text-white font-semibold text-slate-700 rounded-xl transition-all border border-emerald-200/90 shadow-xs cursor-pointer"
              >
                Electronics & Gadgets
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('home_appliances');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#064E3B] hover:text-white font-semibold text-slate-700 rounded-xl transition-all border border-emerald-200/90 shadow-xs cursor-pointer"
              >
                Home Appliances
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('office_equipment');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-xs bg-white hover:bg-[#064E3B] hover:text-white font-semibold text-slate-700 rounded-xl transition-all border border-emerald-200/90 shadow-xs cursor-pointer"
              >
                Office
              </button>
            </div>
          </div>

          {/* Right Column: Featured Hero Card with Product Showcase */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Soft glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#16A34A]/25 via-[#68BC20]/20 to-[#064E3B]/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

              <div className="relative rounded-3xl bg-white border border-emerald-100 shadow-xl overflow-hidden">
                {/* Hero Showcase Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={resolveImageUrl(settings.heroImage)}
                    alt={settings.heroTitle}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 block"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== IMAGES.hero) {
                        target.src = IMAGES.hero;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#064E3B]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-emerald-400/40 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#68BC20]" />
                      <span>GreenCart Featured Showcase</span>
                    </span>
                  </div>

                  {/* Product Highlight overlay if available */}
                  {featuredProduct && (
                    <div className="absolute bottom-4 inset-x-4 text-white space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#68BC20]">
                        Featured In-Demand Item
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-sm sm:text-base line-clamp-1 drop-shadow-sm">
                          {featuredProduct.name}
                        </div>
                        <div className="font-mono font-bold text-sm bg-black/60 px-2.5 py-0.5 rounded-lg border border-white/20 shrink-0">
                          {formatTaka(featuredProduct.price)}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-200 line-clamp-1">
                        {featuredProduct.brand}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white">
                  <div className="text-xs text-slate-600 line-clamp-2 pr-2">
                    {featuredProduct?.description || 'Ultra-soft silhouette paired with breathable fabrics. Elegant everyday chic and evening versatility.'}
                  </div>
                  {featuredProduct && (
                    <button
                      onClick={() => setSelectedProduct(featuredProduct)}
                      className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#68BC20]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
