import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { SabasLogo } from '../SabasLogo';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLoginGate: React.FC = () => {
  const { adminLogin, setCurrentView } = useShop();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      const res = adminLogin(loginId, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#042013] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#16A34A] selection:text-white">
      {/* Background ambient lighting in GreenCart eco palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-[#68BC20]/15 via-[#16A34A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#05301C] rounded-3xl border border-emerald-800/80 shadow-2xl p-7 sm:p-8 space-y-6 relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 pb-1">
          <SabasLogo size="lg" theme="dark" subtitle="ADMIN PORTAL" />
          <div className="pt-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#68BC20]" />
              <span>Administrator Portal</span>
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1">
              Authorized personnel only. Product catalog, order fulfillment, and store controls.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-emerald-100 mb-1.5 uppercase tracking-wider">
              Administrator ID or Email
            </label>
            <input
              type="text"
              required
              autoFocus
              autoComplete="off"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-3.5 py-2.5 bg-[#031B10] border border-emerald-800 focus:border-[#68BC20] rounded-xl text-white text-xs placeholder:text-emerald-300/40 focus:outline-none focus:ring-1 focus:ring-[#68BC20] transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-100 mb-1.5 uppercase tracking-wider">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. admin123"
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#031B10] border border-emerald-800 focus:border-[#68BC20] rounded-xl text-white text-xs placeholder:text-emerald-300/40 focus:outline-none focus:ring-1 focus:ring-[#68BC20] transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#16A34A] to-[#68BC20] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Return to Public Storefront */}
        <div className="pt-2 text-center border-t border-emerald-900/60 text-xs text-emerald-300/80">
          <button
            onClick={() => {
              window.location.search = '';
              setCurrentView('storefront');
            }}
            className="text-[#68BC20] hover:underline cursor-pointer transition-colors"
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
