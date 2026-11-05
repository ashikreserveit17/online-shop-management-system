import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { SabasLogo } from '../SabasLogo';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CustomerLoginModal: React.FC = () => {
  const {
    isCustomerLoginOpen,
    setIsCustomerLoginOpen,
    customerUser,
    customerLogin,
    customerLogout,
    setIsOrdersOpen,
  } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isCustomerLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    customerLogin(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <SabasLogo size="sm" subtitle="ONLINE SHOP" />
          <button
            onClick={() => setIsCustomerLoginOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {customerUser ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#00A86B] text-[#0A2540] font-bold text-lg flex items-center justify-center mx-auto">
              {customerUser.avatarText || customerUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0A2540]">{customerUser.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{customerUser.email}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Customer Account Active</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Access your past orders, delivery dispatches, and 14-day exchange requests.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsCustomerLoginOpen(false);
                  setIsOrdersOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-[#0A2540] hover:bg-[#00A86B] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View Orders & Exchanges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => customerLogout()}
                className="w-full py-2 px-4 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out from Store
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0A2540]">
                {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'login'
                  ? 'Sign in to track orders, saved addresses, and exchange items.'
                  : 'Join GreenCart for seamless shopping and priority support.'}
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-100 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-[#0A2540] shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-[#0A2540] shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#00A86B] hover:bg-[#00925c] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md mt-3 cursor-pointer"
              >
                <span>{mode === 'login' ? 'Sign In as Customer' : 'Complete Registration'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
