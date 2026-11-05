import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { CartItem } from '../../types';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { X, RefreshCw, CheckCircle2, Upload, ArrowRight } from 'lucide-react';

export const ExchangeModal: React.FC = () => {
  const {
    isExchangeModalOpen,
    setIsExchangeModalOpen,
    selectedOrderForExchange,
    createExchangeRequest,
    setIsOrdersOpen,
    formatTaka,
  } = useShop();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [reason, setReason] = useState<'size_fit' | 'defective' | 'damaged_transit' | 'color_style' | 'upgrade_model'>('size_fit');
  const [preferredReplacement, setPreferredReplacement] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  if (!isExchangeModalOpen || !selectedOrderForExchange) return null;

  const currentItem: CartItem | undefined = selectedOrderForExchange.items[selectedItemIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    const newTicket = createExchangeRequest({
      orderId: selectedOrderForExchange.id,
      orderNumber: selectedOrderForExchange.orderNumber,
      productId: currentItem.product.id,
      productName: currentItem.product.name,
      productImage: currentItem.product.image,
      reason,
      customerNotes: customerNotes || 'Customer requested direct product exchange according to GreenCart 14-day policy.',
      preferredReplacement: preferredReplacement || 'Direct variant exchange / Same model replacement',
      proofImageUrl: photoUploaded ? currentItem.product.image : undefined,
    });

    setGeneratedTicketId(newTicket.id);
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsExchangeModalOpen(false);
    setIsSubmitted(false);
    setIsOrdersOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#16A34A]" />
            <h3 className="text-sm font-bold text-[#064E3B]">
              Request Product Exchange (Order #{selectedOrderForExchange.orderNumber})
            </h3>
          </div>
          <button
            onClick={() => {
              setIsExchangeModalOpen(false);
              setIsSubmitted(false);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#064E3B]">
                Exchange Ticket #{generatedTicketId} Submitted!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Our GreenCart store management has received your request. We will review and schedule your replacement courier pickup.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div><strong>Exchange Item:</strong> {currentItem?.product.name}</div>
              <div><strong>Replacement:</strong> {preferredReplacement}</div>
              <div><strong>Status:</strong> Pending Administrator Review</div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 px-4 bg-[#064E3B] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Go to Orders & Exchanges Tracker
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Policy Badge */}
            <div className="p-3 bg-[#ECFDF5] border border-[#16A34A]/30 rounded-xl flex items-start gap-2.5 text-slate-900">
              <RefreshCw className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#064E3B]">GreenCart 14-Day Free Exchange Policy Active</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Complimentary doorstep return courier pickup anywhere in Bangladesh.
                </div>
              </div>
            </div>

            {/* Select Item to Exchange */}
            {selectedOrderForExchange.items.length > 1 && (
              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">Select Item to Exchange:</label>
                <select
                  value={selectedItemIndex}
                  onChange={(e) => setSelectedItemIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                >
                  {selectedOrderForExchange.items.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.product.name} (Qty: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Item Preview */}
            {currentItem && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <img
                  src={resolveImageUrl(currentItem.product.image)}
                  alt={currentItem.product.name}
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 block"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== IMAGES.wardrobe) {
                      target.src = IMAGES.wardrobe;
                    }
                  }}
                />
                <div className="flex-1 truncate">
                  <div className="font-bold text-[#0A2540] truncate">{currentItem.product.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    Current: {Object.values(currentItem.selectedVariants).join(', ') || 'Standard'}
                  </div>
                </div>
                <div className="font-mono tabular-nums font-bold text-[#0A2540]">
                  {formatTaka(currentItem.product.price)}
                </div>
              </div>
            )}

            {/* Reason Selection */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-semibold">Reason for Exchange:</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
              >
                <option value="size_fit">Size / Fit Mismatch (Need alternate measurements)</option>
                <option value="defective">Defective / Malfunctioning upon arrival</option>
                <option value="damaged_transit">Damaged during shipping carrier transit</option>
                <option value="color_style">Color / Shade preference change</option>
                <option value="upgrade_model">Upgrade to different model / tier</option>
              </select>
            </div>

            {/* Replacement Details */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-semibold">
                Desired Replacement Variant or Item:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Size L (40) instead of M (38)"
                value={preferredReplacement}
                onChange={(e) => setPreferredReplacement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-semibold">Additional Notes for Courier:</label>
              <textarea
                rows={2}
                placeholder="Explain the fit or courier handover notes..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
              />
            </div>

            {/* Photo Inspection Attachment Simulator */}
            <div className="space-y-1">
              <label className="block text-slate-700 font-semibold">Attach Photo Proof (Optional):</label>
              <div
                onClick={() => setPhotoUploaded(!photoUploaded)}
                className={`p-3 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                  photoUploaded
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 hover:border-[#00A86B] bg-slate-50 text-slate-600'
                }`}
              >
                <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                {photoUploaded ? (
                  <span className="font-bold text-emerald-700">Photo Attached: item_inspection_photo.jpg (Click to change)</span>
                ) : (
                  <span>Click to attach photo or tag verification</span>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExchangeModalOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00A86B] hover:bg-[#00925c] text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Submit Exchange Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
