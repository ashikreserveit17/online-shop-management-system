import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PaymentMethodType, ShippingAddress, Order } from '../../types';
import { SabasLogo } from '../SabasLogo';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Package,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    settings,
    placeOrder,
    setSelectedOrderForInvoice,
    setIsInvoiceModalOpen,
    setIsOrdersOpen,
    formatTaka,
  } = useShop();

  const [step, setStep] = useState<'details_and_payment' | 'processing' | 'confirmed'>('details_and_payment');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form states with Bangladeshi defaults
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Tanvir Ahmed',
    email: 'tanvir@gmail.com',
    phone: '+880 1712-345678',
    street: 'House 14, Road 7, Sector 3, Uttara',
    city: 'Dhaka',
    state: 'Dhaka Division',
    postalCode: '1230',
    deliveryNotes: 'Call recipient before dispatch.',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('digital_wallet'); // bKash/Nagad
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState('TANVIR AHMED');
  const [upiId, setUpiId] = useState('01712345678');
  const [walletType, setWalletType] = useState('bKash');
  const [codOtp, setCodOtp] = useState('7842');

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartTotal >= settings.freeShippingThreshold;
  const shippingAmount = isFreeShipping || cartTotal === 0 ? 0 : 100;
  const finalTotal = cartTotal + shippingAmount;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const paymentInfo = {
        method: paymentMethod,
        cardLast4: paymentMethod === 'credit_card' ? cardNumber.slice(-4) : undefined,
        cardBrand: paymentMethod === 'credit_card' ? 'Visa' : undefined,
        upiId: paymentMethod === 'upi_netbanking' ? upiId : undefined,
        walletName: paymentMethod === 'digital_wallet' ? walletType : undefined,
        transactionId: `TXN-${walletType.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        paidAt: new Date().toISOString(),
        amount: finalTotal,
      };

      const trackingNumber = `STEADFAST-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2);

      const newOrder = placeOrder({
        items: [...cart],
        subtotal: cartTotal,
        tax: 0,
        shipping: shippingAmount,
        total: finalTotal,
        status: 'processing',
        shippingAddress: { ...shippingAddress },
        payment: paymentInfo,
        trackingNumber,
        estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      });

      setCreatedOrder(newOrder);
      setStep('confirmed');
    }, 1400);
  };

  const handleOpenInvoice = () => {
    if (createdOrder) {
      setSelectedOrderForInvoice(createdOrder);
      setIsCheckoutOpen(false);
      setIsInvoiceModalOpen(true);
    }
  };

  const handleOpenOrders = () => {
    setIsCheckoutOpen(false);
    setIsOrdersOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <SabasLogo size="sm" subtitle="ONLINE CHECKOUT" />
          </div>
          {step !== 'processing' && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div className="py-20 px-6 text-center space-y-4">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-[#00A86B] rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#0A2540]">
                Authorizing Secure Payment in ৳ BDT...
              </h4>
              <p className="text-xs text-slate-500">
                Connecting to payment gateway with 256-bit encryption. Please do not refresh.
              </p>
            </div>
          </div>
        )}

        {/* Confirmed State */}
        {step === 'confirmed' && createdOrder && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0A2540]">
                Order #{createdOrder.orderNumber} Confirmed!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you, {createdOrder.shippingAddress.fullName}. Your order has been placed successfully in Bangladeshi Taka with GreenCart.
              </p>
            </div>

            {/* Order Summary Snapshot */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <div className="text-slate-400 font-medium">Tracking Number</div>
                  <div className="font-mono text-slate-900 font-semibold mt-0.5">{createdOrder.trackingNumber}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Est. Delivery</div>
                  <div className="font-mono text-slate-900 font-semibold mt-0.5">{createdOrder.estimatedDelivery}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Payment Channel</div>
                  <div className="text-slate-900 font-semibold capitalize mt-0.5">
                    {createdOrder.payment.walletName || createdOrder.payment.method.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Total Paid</div>
                  <div className="font-mono text-[#064E3B] font-bold text-sm mt-0.5">
                    {formatTaka(createdOrder.total)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 pt-1">
                <div className="font-medium text-slate-700">Purchased Items:</div>
                {createdOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-600">
                    <span className="truncate pr-4">
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {formatTaka(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exchange Guarantee Notice */}
              <div className="p-2.5 bg-[#ECFDF5] border border-[#16A34A]/30 rounded-lg flex items-center gap-2 text-slate-800">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#16A34A]" />
                <span className="text-[11px]">
                  Protected by GreenCart 14-day free exchange policy. You can request size or item exchange directly from your Orders portal.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleOpenInvoice}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-white border border-slate-300 hover:border-[#0A2540] text-[#0A2540] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#00A86B]" />
                <span>View & Print Tax Invoice (৳)</span>
              </button>
              <button
                onClick={handleOpenOrders}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-[#0A2540] hover:bg-[#00A86B] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Track Delivery & Exchange</span>
              </button>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        {step === 'details_and_payment' && (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Customer Details in Bangladesh */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#e5dccb]">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  1. Delivery Address & Contact (Bangladesh)
                </h4>
                <span className="text-[11px] text-neutral-500">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Mobile Contact (+880)</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Street / House / Area Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">City / Division</label>
                  <input
                    type="text"
                    required
                    value={`${shippingAddress.city}, ${shippingAddress.state}`}
                    onChange={(e) => {
                      const [city, state] = e.target.value.split(',');
                      setShippingAddress({
                        ...shippingAddress,
                        city: city?.trim() || shippingAddress.city,
                        state: state?.trim() || shippingAddress.state,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options in Bangladesh */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wide">
                  2. Select Payment Method (Bangladeshi Taka ৳)
                </h4>
                <span className="text-[11px] text-[#00A86B] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure Transaction
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('digital_wallet')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                    paymentMethod === 'digital_wallet'
                      ? 'border-[#00A86B] bg-[#0A2540] text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className={`w-4 h-4 ${paymentMethod === 'digital_wallet' ? 'text-[#00A86B]' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold">bKash / Nagad</div>
                    <div className="text-[10px] opacity-80">Mobile Banking MFS</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#00A86B] bg-[#0A2540] text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 ${paymentMethod === 'credit_card' ? 'text-[#00A86B]' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold">Visa / Master</div>
                    <div className="text-[10px] opacity-80">NexusPay / Amex</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_netbanking')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                    paymentMethod === 'upi_netbanking'
                      ? 'border-[#00A86B] bg-[#0A2540] text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className={`w-4 h-4 ${paymentMethod === 'upi_netbanking' ? 'text-[#00A86B]' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold">Internet Banking</div>
                    <div className="text-[10px] opacity-80">City, BRAC, DBBL</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-[#00A86B] bg-[#0A2540] text-white shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className={`w-4 h-4 ${paymentMethod === 'cash_on_delivery' ? 'text-[#00A86B]' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold">Cash on Delivery</div>
                    <div className="text-[10px] opacity-80">Pay on Handover</div>
                  </div>
                </button>
              </div>

              {/* Method Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                {paymentMethod === 'digital_wallet' && (
                  <div className="space-y-3">
                    <label className="block text-slate-700 font-semibold mb-1">Select MFS Provider</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['bKash', 'Nagad', 'Rocket'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWalletType(w)}
                          className={`py-2 px-3 rounded-lg border text-center font-bold transition-colors cursor-pointer ${
                            walletType === w
                              ? 'bg-[#00A86B] text-white border-[#00A86B]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Account Mobile Number</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Card Number (16-Digit)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Cardholder</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded uppercase font-medium focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi_netbanking' && (
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-semibold mb-1">Select Bank Gateway</label>
                    <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00A86B]">
                      <option>City Bank Citytouch</option>
                      <option>BRAC Bank Astha</option>
                      <option>Dutch-Bangla Bank (DBBL)</option>
                      <option>Eastern Bank (EBL)</option>
                      <option>Standard Chartered Bangladesh</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cash_on_delivery' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Verification Delivery PIN:</span>
                      <span className="font-mono font-bold text-sm bg-slate-200 px-2 py-0.5 rounded text-[#0A2540]">
                        {codOtp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Pay cash upon doorstep inspection to our courier partner. Free exchange guarantee remains active for 14 days.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total and CTA */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Total Payable:</span>
                <div className="text-lg font-bold font-mono tabular-nums text-[#0A2540]">
                  {formatTaka(finalTotal)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#00925c] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99]"
                >
                  <span>Authorize & Place Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
