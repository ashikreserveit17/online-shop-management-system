import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { Star, ShoppingCart, RefreshCw, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, formatTaka } = useShop();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const categoryLabels: Record<string, string> = {
    womens_wardrobe: "Women's Collection",
    mens_wardrobe: "Men's Wardrobe",
    home_appliances: 'Home Appliances',
    office_equipment: 'Office Equipment',
    automobiles: 'Automobiles',
    phones_telecom: 'Phones & Telecom',
  };

  const safeImageSrc = product.image?.startsWith('data:') ? product.image : resolveImageUrl(product.image, product.name);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-2xl border border-emerald-100/90 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#16A34A] cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
        <img
          src={safeImageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 block"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== IMAGES.blackKnitTrousers) {
              target.src = IMAGES.blackKnitTrousers;
            }
          }}
        />

        {/* Quiet Subtle Multimedia Indicator */}
        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
          <Layers className="w-3 h-3 text-[#68BC20]" />
          <span className="capitalize">{product.multimediaType.replace('_', ' ')}</span>
        </div>

        {/* Exchange Guarantee Indicator */}
        {product.exchangeEligible && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#064E3B]/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] text-white flex items-center gap-1 border border-[#16A34A]/40">
            <RefreshCw className="w-3 h-3 text-[#68BC20]" />
            <span>{product.exchangePeriodDays}-Day Exchange</span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wide">
              {categoryLabels[product.category] || product.category}
            </span>
            <span className="flex items-center gap-0.5 text-amber-500 font-mono">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#16A34A] transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing in Bangladeshi Taka (৳) & Actions */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#064E3B] font-mono tabular-nums">
                {formatTaka(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatTaka(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px]">
              {product.stock > 0 ? (
                <span className="text-emerald-700 font-semibold">{product.stock} in stock</span>
              ) : (
                <span className="text-rose-600 font-medium">Out of stock</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className="p-2 text-slate-700 hover:text-[#064E3B] bg-slate-100 hover:bg-[#EBF7EE] border border-slate-200 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Add to Cart"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4 text-[#16A34A]" />
            </button>
            <button
              onClick={() => setSelectedProduct(product)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#16A34A] rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
