import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import {
  X,
  Star,
  RefreshCw,
  ShieldCheck,
  Check,
  RotateCw,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
    formatTaka,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'interactive_360' | 'video_walkthrough' | 'audio_demo'>('photos');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentVariants, setCurrentVariants] = useState<Record<string, string>>({});
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedProduct) return null;

  const handleVariantSelect = (group: string, option: string) => {
    setCurrentVariants((prev) => ({ ...prev, [group]: option }));
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentVariants);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleInstantBuy = () => {
    addToCart(selectedProduct, quantity, currentVariants);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const primaryImage = resolveImageUrl(
    selectedProduct.gallery[activeImageIndex] || selectedProduct.image,
    selectedProduct.name
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="text-[#0A2540] font-bold">{selectedProduct.brand}</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{selectedProduct.name}</span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Multimedia Viewer (7 Cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#06182B] text-white flex flex-col justify-between">
            {/* Multimedia Mode Selector */}
            <div className="flex items-center justify-between gap-2 pb-4">
              <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg text-xs border border-white/10">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    activeMediaTab === 'photos'
                      ? 'bg-[#00A86B] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => setActiveMediaTab('interactive_360')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    activeMediaTab === 'interactive_360'
                      ? 'bg-[#00A86B] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>360° Inspect</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('video_walkthrough')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    activeMediaTab === 'video_walkthrough'
                      ? 'bg-[#00A86B] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Video Demo</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('audio_demo')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    activeMediaTab === 'audio_demo'
                      ? 'bg-[#00A86B] text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Acoustics</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#68BC20] hidden sm:inline font-semibold">
                GreenCart HD Multimedia
              </span>
            </div>

            {/* Display Stage */}
            <div className="relative aspect-[4/3] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {activeMediaTab === 'photos' && (
                <img
                  src={primaryImage}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-opacity duration-300 block"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== IMAGES.hero) {
                      target.src = IMAGES.hero;
                    }
                  }}
                />
              )}

              {activeMediaTab === 'interactive_360' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-slate-950">
                  <div
                    className="relative w-56 h-56 transition-transform duration-200"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  >
                    <img
                      src={primaryImage}
                      alt="360 view"
                      className="w-full h-full object-cover rounded-full shadow-2xl border border-[#00A86B]/40 block"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== IMAGES.wardrobe) {
                          target.src = IMAGES.wardrobe;
                        }
                      }}
                    />
                    <div className="absolute inset-0 rounded-full border border-[#00A86B]/40 animate-pulse pointer-events-none" />
                  </div>
                  <div className="mt-4 w-full max-w-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Drag to Inspect Drape</span>
                      <span className="text-[#00A86B] font-bold">{rotationAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="w-full accent-[#00A86B] cursor-ew-resize"
                    />
                  </div>
                </div>
              )}

              {activeMediaTab === 'video_walkthrough' && (
                <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                  <img
                    src={primaryImage}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 block"
                  />
                  <div className="relative z-10 text-center space-y-3 p-4">
                    <span className="text-xs font-mono bg-black/80 px-2 py-0.5 rounded border border-[#00A86B]/40 text-[#FF8C38]">
                      Dhaka Studio 4K Walkthrough
                    </span>
                    <h4 className="text-sm font-semibold max-w-sm text-white">
                      {selectedProduct.multimediaTitle}
                    </h4>
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="w-14 h-14 rounded-full bg-[#00A86B] hover:bg-[#00925c] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 mx-auto cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    </button>
                    {isPlayingVideo && (
                      <div className="text-xs text-emerald-400 font-mono animate-pulse">
                        Simulating 60fps HD Product Stream...
                      </div>
                    )}
                  </div>
                  {isPlayingVideo && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-700">
                      <div className="bg-[#00A86B] h-full transition-all duration-300 w-3/4 animate-pulse" />
                    </div>
                  )}
                </div>
              )}

              {activeMediaTab === 'audio_demo' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950">
                  <div className="w-20 h-20 rounded-full bg-[#00A86B]/20 border border-[#00A86B]/50 flex items-center justify-center animate-pulse">
                    <Volume2 className="w-10 h-10 text-[#00A86B]" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <div className="text-sm font-bold text-white">Studio Acoustic Sample</div>
                    <div className="text-xs text-slate-400">
                      Auditory verification of fabric movement or engine acoustics.
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A86B] hover:bg-[#00925c] text-white font-bold text-xs rounded-lg transition-colors shadow-lg cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Mute Acoustic Sample</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Play Operating Audio</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            <div className="flex items-center gap-2 pt-4 overflow-x-auto">
              {selectedProduct.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setActiveMediaTab('photos');
                  }}
                  className={`w-16 h-12 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    activeMediaTab === 'photos' && activeImageIndex === idx
                      ? 'border-[#00A86B] ring-2 ring-[#00A86B]'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={resolveImageUrl(imgUrl)}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-cover block"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== IMAGES.hero) {
                        target.src = IMAGES.hero;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Specifications (5 Cols) */}
          <div className="lg:col-span-5 p-6 space-y-5 flex flex-col justify-between bg-white text-slate-900">
            <div className="space-y-4">
              {/* Brand and Rating */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#0A2540]">{selectedProduct.brand}</span>
                  <div className="flex items-center gap-1 font-mono text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-slate-400">({selectedProduct.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-[#0A2540] leading-snug">
                  {selectedProduct.name}
                </h2>
              </div>

              {/* Price in Bangladeshi Taka (৳) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono tabular-nums text-[#0A2540]">
                      {formatTaka(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                        {formatTaka(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">VAT inclusive in Bangladesh</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-700 font-mono">
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} Available` : 'Backorder'}
                  </div>
                  <div className="text-[11px] text-slate-500">Dhaka Central Hub</div>
                </div>
              </div>

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-3 pt-1">
                  {selectedProduct.variants.map((v) => (
                    <div key={v.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{v.name}:</span>
                        <span className="font-mono text-slate-500 font-semibold">
                          {currentVariants[v.name] || v.options[0]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {v.options.map((opt) => {
                          const isSelected = (currentVariants[v.name] || v.options[0]) === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleVariantSelect(v.name, opt)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#0A2540] bg-[#0A2540] text-white shadow-xs'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#00A86B]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono tabular-nums text-slate-900 font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 14-Day Exchange Guarantee */}
              <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#00A86B]/30 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#0A2540] font-bold">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>{selectedProduct.exchangePeriodDays}-Day Hassle-Free Exchange</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Direct size exchange, alternate color replacement, or store credit with free courier return anywhere in Bangladesh.
                </p>
                <div className="flex items-center gap-1.5 text-slate-700 pt-1 border-t border-slate-200 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{selectedProduct.warranty}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {addedNotice && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 text-center font-medium flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added {quantity} item(s) to bag</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock === 0}
                  className="py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleInstantBuy}
                  disabled={selectedProduct.stock === 0}
                  className="py-2.5 px-4 text-xs font-bold text-white bg-[#00A86B] hover:bg-[#00925c] rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  Instant Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
