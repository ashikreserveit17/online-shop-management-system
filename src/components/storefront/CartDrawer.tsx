import React from 'react';
import { useShop } from '../../context/ShopContext';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    settings,
    setIsCheckoutOpen,
    formatTaka,
  } = useShop();

  if (!isCartOpen) return null;

  const isFreeShipping = cartTotal >= settings.freeShippingThreshold;
  const shippingAmount = isFreeShipping || cartTotal === 0 ? 0 : 100;
  const finalTotal = cartTotal + shippingAmount;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#00A86B]/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#00A86B]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A2540]">Shopping Bag</h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {cart.reduce((a, c) => a + c.quantity, 0)} items in your cart
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress in Bangladeshi Taka (৳) */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
          {isFreeShipping ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>You've unlocked free nationwide courier delivery!</span>
            </span>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Add {formatTaka(settings.freeShippingThreshold - cartTotal)} more for free delivery</span>
                <span className="font-mono font-bold text-[#00A86B]">
                  {Math.round((cartTotal / settings.freeShippingThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00A86B] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (cartTotal / settings.freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#00A86B]/30 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-7 h-7 text-[#00A86B]" />
              </div>
              <p className="text-sm font-semibold text-[#064E3B]">Your shopping bag is empty</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore the latest GreenCart collections in women's, men's, electronics, and lifestyle goods.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#16A34A] rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="pt-3 first:pt-0 flex gap-3.5">
                <img
                  src={resolveImageUrl(item.product.image, item.product.name)}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50 block"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== IMAGES.blackKnitTrousers) {
                      target.src = IMAGES.blackKnitTrousers;
                    }
                  }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <span className="font-semibold text-[#0A2540]">{item.product.brand}</span>
                      {Object.keys(item.selectedVariants).length > 0 && (
                        <span> · {Object.values(item.selectedVariants).join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-mono tabular-nums text-slate-900 font-bold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold font-mono tabular-nums text-[#0A2540]">
                      {formatTaka(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {formatTaka(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span className="font-mono tabular-nums text-slate-900 font-semibold">
                  {shippingAmount === 0 ? 'FREE' : formatTaka(shippingAmount)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base text-[#0A2540] font-black">
                  {formatTaka(finalTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 bg-[#00A86B] hover:bg-[#00925c] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
