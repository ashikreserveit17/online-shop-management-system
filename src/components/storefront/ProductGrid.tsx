import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { PackageOpen } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } = useShop();
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFeatures = p.features.some((f) => f.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchFeatures) {
            return false;
          }
        }

        // Price range filter in Bangladeshi Taka
        if (priceRange === 'under2000' && p.price >= 2000) return false;
        if (priceRange === '2000to10000' && (p.price < 2000 || p.price > 10000)) return false;
        if (priceRange === 'above10000' && p.price <= 10000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured default
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  return (
    <div className="space-y-6">
      <CategoryFilter
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#ECFDF5] flex items-center justify-center text-slate-400">
            <PackageOpen className="w-6 h-6 text-[#00A86B]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-[#0A2540]">No matching products found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find items matching your active category and filter selections.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setPriceRange('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#00A86B] rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
