import React from 'react';
import { useShop } from '../context/ShopContext';
import { SabasLogo } from './SabasLogo';
import { X, Printer } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, selectedOrderForInvoice, settings, formatTaka } = useShop();

  if (!isInvoiceModalOpen || !selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0">
        {/* Controls */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="text-xs font-bold text-[#0A2540]">Tax Invoice Receipt (৳ BDT)</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#0A2540] hover:bg-[#00A86B] rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-900 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <SabasLogo size="lg" />
              <p className="text-slate-500 mt-2">{settings.tagline}</p>
              <p className="text-slate-500">{settings.supportEmail} · {settings.supportPhone}</p>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-[#0A2540]">OFFICIAL TAX INVOICE</div>
              <div className="text-slate-600 mt-0.5 font-bold">#{order.orderNumber}</div>
              <div className="text-slate-500 mt-0.5">Date: {order.date}</div>
              <div className="text-emerald-700 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                PAID IN FULL (৳ BDT)
              </div>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="text-slate-400 uppercase tracking-wide font-semibold text-[10px] mb-1">
                Billed & Shipped To:
              </div>
              <div className="font-bold text-[#0A2540] text-sm">{order.shippingAddress.fullName}</div>
              <div className="text-slate-600 mt-0.5">{order.shippingAddress.street}</div>
              <div className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </div>
              <div className="text-slate-500 mt-1 font-mono">{order.shippingAddress.email}</div>
              <div className="text-slate-500 font-mono">{order.shippingAddress.phone}</div>
            </div>

            <div>
              <div className="text-slate-400 uppercase tracking-wide font-semibold text-[10px] mb-1">
                Fulfillment & Payment:
              </div>
              <div>
                <span className="text-slate-500">Method: </span>
                <span className="font-semibold text-slate-900 capitalize">
                  {order.payment.walletName || order.payment.method.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Transaction ID: </span>
                <span className="font-mono text-slate-800">{order.payment.transactionId}</span>
              </div>
              <div>
                <span className="text-slate-500">Courier Tracking: </span>
                <span className="font-mono text-slate-800 font-bold">{order.trackingNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Exchange Guarantee: </span>
                <span className="text-[#00A86B] font-semibold">14-Day Free Return Active</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.product.name}</div>
                      {Object.keys(item.selectedVariants).length > 0 && (
                        <div className="text-[11px] text-slate-500 font-mono">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {item.product.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {formatTaka(item.product.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#0A2540]">
                      {formatTaka(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums font-semibold">{formatTaka(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Freight:</span>
                <span className="font-mono tabular-nums font-semibold">
                  {order.shipping === 0 ? 'FREE' : formatTaka(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-base text-[#0A2540] font-black">
                  {formatTaka(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 text-center leading-relaxed">
            <p>Thank you for choosing {settings.storeName}. All items include verified warranties and our {settings.exchangeGuaranteeDays}-day friction-free product exchange guarantee.</p>
            <p className="mt-1 font-mono">Computer Generated Official Tax Document · Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
};
