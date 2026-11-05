import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';
import { Search, X } from 'lucide-react';

interface CategoryFilterProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    products,
  } = useShop();

  const getCategoryCount = (catId: CategoryId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  const categoryTabs: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Catalog' },
    { id: 'womens_wardrobe', label: "Women's Collection" },
    { id: 'mens_wardrobe', label: "Men's Wardrobe" },
    { id: 'home_appliances', label: 'Home Appliances' },
    { id: 'office_equipment', label: 'Office Equipment' },
    { id: 'phones_telecom', label: 'Phones & Telecom' },
    { id: 'automobiles', label: 'Automobiles' },
  ];

  return (
    <div id="catalog-section" className="space-y-4 pt-6 pb-4">
      {/* Search and Secondary Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by collection, fabric, or model..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and Price Filter (in Bangladeshi Taka ৳) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Price (৳):</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="under2000">Under ৳ 2,000</option>
              <option value="2000to10000">৳ 2,000 – ৳ 10,000</option>
              <option value="above10000">৳ 10,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Category Tabs with Emerald Underline Indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {categoryTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          const count = getCategoryCount(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
                isActive
                  ? 'border-[#16A34A] text-[#064E3B] bg-white shadow-xs font-bold'
                  : 'border-transparent text-slate-600 hover:text-[#064E3B] hover:bg-emerald-50/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono tabular-nums text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#16A34A] text-white font-bold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
