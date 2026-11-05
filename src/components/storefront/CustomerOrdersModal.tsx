import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import { SabasLogo } from '../SabasLogo';
import {
  X,
  Package,
  RefreshCw,
  FileText,
  CheckCircle,
  Truck,
  User,
  ShoppingBag,
} from 'lucide-react';

export const CustomerOrdersModal: React.FC = () => {
  const {
    isOrdersOpen,
    setIsOrdersOpen,
    myOrders,
    exchanges,
    customerUser,
    setIsCustomerLoginOpen,
    setSelectedOrderForExchange,
    setIsExchangeModalOpen,
    setSelectedOrderForInvoice,
    setIsInvoiceModalOpen,
    formatTaka,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'exchanges'>('orders');

  if (!isOrdersOpen) return null;

  // Filter exchanges to current customer's orders
  const myExchanges = exchanges.filter((e) =>
    myOrders.some((o) => o.orderNumber === e.orderNumber || o.id === e.orderId)
  );

  const handleStartExchange = (order: Order) => {
    setSelectedOrderForExchange(order);
    setIsOrdersOpen(false);
    setIsExchangeModalOpen(true);
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsOrdersOpen(false);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <SabasLogo size="sm" subtitle="CUSTOMER ORDERS & EXCHANGES" />
          </div>
          <button
            onClick={() => setIsOrdersOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unauthenticated View: User needs to login */}
        {!customerUser ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mx-auto shadow-xs">
              <User className="w-8 h-8 text-[#16A34A]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#064E3B]">
                Sign In to View Your Orders
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Please sign in with your customer account or email to view past orders, live courier tracking, invoices, and 14-day exchange requests.
              </p>
            </div>
            <button
              onClick={() => {
                setIsOrdersOpen(false);
                setIsCustomerLoginOpen(true);
              }}
              className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#053D2E] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#68BC20]" />
              <span>Customer Sign In / Register</span>
            </button>
          </div>
        ) : (
          <>
            {/* Customer identity bar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Logged in as: <strong className="text-[#064E3B]">{customerUser.name}</strong> ({customerUser.email})
              </span>
              <span className="font-mono text-[11px] text-[#16A34A] font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {myOrders.length} {myOrders.length === 1 ? 'Order' : 'Orders'} on Record
              </span>
            </div>

            {/* Tab Controls */}
            <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#16A34A] text-[#064E3B] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4 text-[#16A34A]" />
                <span>My Order History ({myOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('exchanges')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'exchanges'
                    ? 'border-[#16A34A] text-[#064E3B] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-[#16A34A]" />
                <span>Exchange Requests ({myExchanges.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {myOrders.length === 0 ? (
                    <div className="py-14 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <ShoppingBag className="w-7 h-7 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">No Orders Placed Yet</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          You haven't placed any orders yet. When you complete checkout, your order will appear here with live tracking.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsOrdersOpen(false)}
                        className="px-5 py-2 bg-[#064E3B] hover:bg-[#053D2E] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Explore Store Catalog
                      </button>
                    </div>
                  ) : (
                    myOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs"
                      >
                        {/* Order Bar */}
                        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono text-[#064E3B]">
                              #{order.orderNumber}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-600">{order.date}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-[11px] font-bold capitalize text-[#16A34A]">
                              Status: {order.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewInvoice(order)}
                              className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Invoice (৳)</span>
                            </button>

                            <button
                              onClick={() => handleStartExchange(order)}
                              className="px-2.5 py-1 text-[#064E3B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-[#16A34A]" />
                              <span>Request Exchange</span>
                            </button>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 space-y-3 divide-y divide-slate-100 text-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 pt-2 first:pt-0">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={it.product.image}
                                  alt={it.product.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 truncate">{it.product.name}</div>
                                  <div className="text-slate-500 text-[11px]">Qty: {it.quantity}</div>
                                </div>
                              </div>
                              <div className="font-mono font-bold text-slate-900 shrink-0">
                                {formatTaka(it.product.price * it.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Tracking */}
                        <div className="p-3 bg-emerald-50/40 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <Truck className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span>Courier Tracking: <strong>{order.trackingNumber}</strong></span>
                          </div>
                          <div className="font-bold text-[#064E3B]">
                            Total Paid: <span className="font-mono text-sm">{formatTaka(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'exchanges' && (
                <div className="space-y-4">
                  {myExchanges.length === 0 ? (
                    <div className="py-14 text-center space-y-2">
                      <RefreshCw className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">No active exchange tickets on file.</p>
                      <p className="text-[11px] text-slate-400">
                        You can request a free size or model exchange on any order within 14 days of delivery.
                      </p>
                    </div>
                  ) : (
                    myExchanges.map((exc) => (
                      <div
                        key={exc.id}
                        className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="font-mono font-bold text-[#064E3B]">Ticket #{exc.id}</div>
                          <div className="font-mono text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {exc.status.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={exc.productImage}
                            alt={exc.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{exc.productName}</div>
                            <div className="text-slate-500 text-[11px]">Desired: {exc.preferredReplacement}</div>
                          </div>
                        </div>
                        {exc.adminResolutionNotes && (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                            <strong>GreenCart Store Manager Decision:</strong> {exc.adminResolutionNotes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
