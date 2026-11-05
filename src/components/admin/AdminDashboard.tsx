import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Order, ExchangeRequest, OrderStatus, ExchangeStatus, UserAccount } from '../../types';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { SabasLogo } from '../SabasLogo';
import { AddProductModal } from './AddProductModal';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCw,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Copy,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  UserCheck,
  LogOut,
  Bell,
  Search,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    updateProduct,
    deleteProduct,
    resetCatalogToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
    exchanges,
    updateExchangeStatus,
    users,
    addUser,
    updateUserRole,
    deleteUser,
    settings,
    updateSettings,
    setCurrentView,
    adminLogout,
    categories,
    formatTaka,
    setSelectedOrderForInvoice,
    setIsInvoiceModalOpen,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'exchanges' | 'users' | 'reports' | 'settings'>('dashboard');
  const [salesTimeframe, setSalesTimeframe] = useState<'today' | 'week'>('week');
  const [copiedLink, setCopiedLink] = useState<'admin' | 'store' | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Live dynamic clock matching screenshot "Tuesday, September 29, 2026 • 17:50:36"
  const [currentDateTime, setCurrentDateTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      const datePart = now.toLocaleDateString('en-US', options);
      const timePart = now.toTimeString().split(' ')[0];
      setCurrentDateTime(`${datePart} • ${timePart}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Settings form states
  const [heroImageInput, setHeroImageInput] = useState(settings.heroImage);
  const [heroTitleInput, setHeroTitleInput] = useState(settings.heroTitle);
  const [heroSubtitleInput, setHeroSubtitleInput] = useState(settings.heroSubtitle);
  const [announcementInput, setAnnouncementInput] = useState(settings.announcementBar.text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementBar.enabled);
  const [exchangeDaysInput, setExchangeDaysInput] = useState(String(settings.exchangeGuaranteeDays));
  const [freeShippingInput, setFreeShippingInput] = useState(String(settings.freeShippingThreshold));
  const [settingsNotice, setSettingsNotice] = useState(false);

  // Exchange resolution state
  const [resolvingExcId, setResolvingExcId] = useState<string | null>(null);
  const [resNote, setResNote] = useState('Exchange approved by GreenCart Store Manager. Pickup scheduled.');
  const [resPickupDate, setResPickupDate] = useState('2026-10-02');

  // Copy portal links
  const handleCopyLink = (type: 'admin' | 'store') => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const url = type === 'admin' ? `${origin}${path}?portal=admin` : `${origin}${path}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Quick Restock handler
  const handleRestock = (productId: string, addUnits = 25) => {
    const p = products.find((x) => x.id === productId);
    if (p) {
      updateProduct(productId, { stock: p.stock + addUnits });
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroImage: heroImageInput,
      heroTitle: heroTitleInput,
      heroSubtitle: heroSubtitleInput,
      announcementBar: {
        enabled: announcementEnabled,
        text: announcementInput,
      },
      exchangeGuaranteeDays: Number(exchangeDaysInput) || 14,
      freeShippingThreshold: Number(freeShippingInput) || 3500,
    });
    setSettingsNotice(true);
    setTimeout(() => setSettingsNotice(false), 2500);
  };

  // Computed metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingExchanges = exchanges.filter((e) => e.status === 'pending_review');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* LEFT SIDEBAR (GreenCart Forest Theme) */}
      <aside className="w-full lg:w-68 bg-[#042013] text-emerald-100 flex flex-col justify-between shrink-0 border-r border-emerald-950 select-none">
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-4 border-b border-emerald-900/60">
            <SabasLogo size="md" theme="dark" subtitle="STORE MANAGEMENT" />
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* 2. Products */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'products' ? 'bg-black/30 text-white' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {products.length}
              </span>
            </button>

            {/* 3. Sales & Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Sales & Orders</span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-black/30 text-white' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {orders.length}
              </span>
            </button>

            {/* 4. Due-Time Exchanges */}
            <button
              onClick={() => setActiveTab('exchanges')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'exchanges'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4" />
                <span>Due-Time Exchanges</span>
              </div>
              {pendingExchanges.length > 0 && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                  {pendingExchanges.length}
                </span>
              )}
            </button>

            {/* 5. User IDs & Roles */}
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>User IDs & Roles</span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'users' ? 'bg-black/30 text-white' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {users.length}
              </span>
            </button>

            {/* 6. Reports */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Reports</span>
              </div>
            </button>

            {/* 7. Settings (Edit Everything) */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#16A34A] text-white font-bold shadow-md'
                  : 'hover:bg-emerald-900/40 hover:text-white text-emerald-200/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </nav>

          {/* Help Box matching screenshot */}
          <div className="p-4 mx-3 my-2 bg-[#0B2545] rounded-xl border border-slate-700/60 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>Need help?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Contact our administrator support team for assistance.
            </p>
            <button
              onClick={() => alert('Support hotline: +880 9612-GREENCART · support@greencart.com.bd')}
              className="w-full py-1.5 px-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] rounded-md transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          {/* Portal Links Widget matching screenshot */}
          <div className="p-4 mx-3 bg-[#0B2545] rounded-xl border border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold tracking-wider uppercase">
              <span>PORTAL LINKS</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCopyLink('admin')}
                className="py-1 px-2 bg-slate-800/80 hover:bg-slate-700 text-[10px] text-slate-200 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Copy confidential Admin Login URL"
              >
                <Copy className="w-3 h-3 text-[#00A86B]" />
                <span>{copiedLink === 'admin' ? 'Copied!' : 'Admin Link'}</span>
              </button>
              <button
                onClick={() => handleCopyLink('store')}
                className="py-1 px-2 bg-slate-800/80 hover:bg-slate-700 text-[10px] text-slate-200 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Copy public Customer Storefront URL"
              >
                <ExternalLink className="w-3 h-3 text-sky-400" />
                <span>{copiedLink === 'store' ? 'Copied!' : 'Store Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: View Storefront & Logout */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </button>
          <button
            onClick={() => adminLogout()}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar matching screenshot */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sticky top-0 z-20">
          {/* Breadcrumb trail */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-[#064E3B] font-bold">GreenCart Store Management</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#16A34A] uppercase tracking-wider">{activeTab}</span>
          </div>

          {/* Quick Action Badges & Live Clock */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCopyLink('admin')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3 text-[#16A34A]" />
              <span>{copiedLink === 'admin' ? 'Copied Admin Link!' : 'Copy Admin Link'}</span>
            </button>
            <button
              onClick={() => handleCopyLink('store')}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3 text-sky-600" />
              <span>{copiedLink === 'store' ? 'Copied Storefront Link!' : 'Copy Customer Link'}</span>
            </button>

            {/* Live Clock Pill */}
            <div className="px-3 py-1 bg-[#042013] text-white text-[11px] font-mono rounded-full flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3 h-3 text-[#68BC20]" />
              <span>{currentDateTime}</span>
            </div>

            {/* Notifications & Admin Profile */}
            <button
              onClick={() => setActiveTab('exchanges')}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {pendingExchanges.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#16A34A] absolute top-1 right-1" />
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white font-bold text-xs flex items-center justify-center font-mono">
                GC
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-bold text-[#064E3B]">GreenCart Admin</div>
                <div className="text-[10px] text-slate-500">Store Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Title & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#064E3B] tracking-tight">
                    Today's Store Overview
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Welcome back, <strong>Store Administrator</strong>. Real-time fulfillment and catalog performance in Bangladeshi Taka (৳).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#064E3B] hover:bg-[#053D2E] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#68BC20]" />
                  <span>+ Add New Product</span>
                </button>
              </div>

              {/* 4 Stat Cards matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Sales */}
                <div className="bg-white p-5 rounded-2xl border border-[#e5dccb] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                    <span>Total Sales</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900">
                    {formatTaka(totalRevenue)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>↑ 12.5% from yesterday</span>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-white p-5 rounded-2xl border border-[#e5dccb] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                    <span>Transactions</span>
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900">
                    {158 + orders.length}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-sky-600 font-semibold font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>↗ 8.2% from yesterday</span>
                  </div>
                </div>

                {/* Customers */}
                <div className="bg-white p-5 rounded-2xl border border-[#e5dccb] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                    <span>Customers</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900">
                    {64 + users.length}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold font-mono">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>↘ 3.1% from yesterday</span>
                  </div>
                </div>

                {/* Avg. Sale */}
                <div className="bg-white p-5 rounded-2xl border border-[#e5dccb] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                    <span>Avg. Sale</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-neutral-900">
                    ৳ 2,850
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>↗ 4.3% from yesterday</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Sales Overview Curve & Top Products Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Overview Chart (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e5dccb] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-serif">
                        Sales Overview (৳ BDT)
                      </h3>
                      <p className="text-[11px] text-neutral-500">Weekly performance curve in Bangladeshi Taka</p>
                    </div>

                    <div className="flex items-center bg-[#f8f5ee] rounded-lg p-0.5 border border-[#e5dccb] text-xs font-semibold">
                      <button
                        onClick={() => setSalesTimeframe('today')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          salesTimeframe === 'today' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setSalesTimeframe('week')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          salesTimeframe === 'week' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500'
                        }`}
                      >
                        Week
                      </button>
                    </div>
                  </div>

                  {/* SVG Chart Curves (Orange + Navy matching brand) */}
                  <div className="relative h-60 w-full pt-4">
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="goldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00A86B" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#00A86B" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#e2e8f0" strokeDasharray="3 3" />

                      {/* Area Fill for Orange Curve */}
                      <path
                        d="M 20 120 Q 150 135 280 95 T 450 45 T 580 90 L 580 180 L 20 180 Z"
                        fill="url(#goldCurveGrad)"
                      />

                      {/* Orange Primary Curve */}
                      <path
                        d="M 20 120 Q 150 135 280 95 T 450 45 T 580 90"
                        fill="none"
                        stroke="#00A86B"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Secondary Navy Curve */}
                      <path
                        d="M 20 150 Q 150 150 280 140 T 450 115 T 580 85"
                        fill="none"
                        stroke="#0A2540"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* High point indicator */}
                      <circle cx="450" cy="45" r="5" fill="#00A86B" stroke="#ffffff" strokeWidth="2" />
                    </svg>

                    {/* Weekday Labels */}
                    <div className="flex justify-between text-[11px] font-mono text-neutral-500 pt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Top Products matching screenshot (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e5dccb] shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 font-serif">Top Products</h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs text-[#b8860b] hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3.5 divide-y divide-neutral-100">
                    {products.slice(0, 4).map((p) => (
                      <div key={p.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={resolveImageUrl(p.image)}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-[#e5dccb] shrink-0 block"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== IMAGES.wardrobe) {
                                target.src = IMAGES.wardrobe;
                              }
                            }}
                          />
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-neutral-900 truncate">
                              {p.name}
                            </h4>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              {p.stock} units left
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-xs text-neutral-900">
                            {formatTaka(p.price)}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-mono">
                            ↑ 18%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="w-full py-2 bg-[#f8f5ee] hover:bg-[#ede5d8] border border-[#e5dccb] text-neutral-900 font-bold text-xs rounded-xl transition-colors mt-2"
                  >
                    Manage Full Product Catalog
                  </button>
                </div>
              </div>

              {/* Bottom Row: Recent Transactions & Inventory Alerts matching screenshot */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Transactions (6 Cols) */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#e5dccb] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 font-serif">Recent Transactions</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#b8860b] hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 text-xs">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold font-mono text-neutral-900">#{ord.orderNumber}</div>
                          <div className="text-[11px] text-neutral-500">
                            {ord.shippingAddress.fullName} · {ord.payment.method.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-neutral-900">
                            {formatTaka(ord.total)}
                          </div>
                          <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inventory Alerts matching screenshot (6 Cols) */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#e5dccb] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 font-serif">Inventory Alerts</h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs text-[#b8860b] hover:underline font-semibold"
                    >
                      Manage Inventory
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {/* Critical Item: 2 units left */}
                    <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-neutral-900 truncate">
                            Classic Black Ribbed Knit Top & Beige Wide-Leg Trousers Set
                          </div>
                          <div className="text-[11px] text-rose-700 font-bold font-mono">
                            Critical: {products[0]?.stock ?? 2} units left
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestock(products[0]?.id || 'ww-01')}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors shrink-0 shadow-sm"
                      >
                        Restock
                      </button>
                    </div>

                    {/* Low item 1 */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-neutral-900 truncate">
                            Azure Blossom Embroidered Salwar Suit
                          </div>
                          <div className="text-[11px] text-amber-800 font-mono">
                            Low: {products[1]?.stock ?? 35} units left
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestock(products[1]?.id || 'ww-02')}
                        className="px-3 py-1 bg-[#0A2540] hover:bg-[#00A86B] text-white font-bold text-[11px] rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>

                    {/* Low item 2 */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">
                            Noir Blossom Embroidered Salwar Suit
                          </div>
                          <div className="text-[11px] text-amber-800 font-mono">
                            Low: {products[2]?.stock ?? 35} units left
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestock(products[2]?.id || 'ww-03')}
                        className="px-3 py-1 bg-[#0A2540] hover:bg-[#00A86B] text-white font-bold text-[11px] rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG (Admin can edit everything) */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#064E3B]">
                    Product Catalog & Pricing Management (৳ BDT)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full administrator access to add, edit, restock, or remove catalog products.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Restore default GreenCart catalog and authentic product photos?')) {
                        resetCatalogToDefault();
                      }
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all border border-slate-300 cursor-pointer"
                    title="Reset to fresh authentic photos"
                  >
                    Restore Default Catalog
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Search & Filter Bar */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by product name, SKU, or category..."
                  className="w-full text-xs bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Item & Multimedia</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-right">Price (৳)</th>
                      <th className="py-3.5 px-4 text-center">Stock</th>
                      <th className="py-3.5 px-4">Exchange Window</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(
                        (p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveImageUrl(prod.image, prod.name)}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 block shadow-xs"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== IMAGES.blackKnitTrousers) {
                                  target.src = IMAGES.blackKnitTrousers;
                                }
                              }}
                            />
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">{prod.name}</div>
                              <div className="text-[11px] text-[#00A86B] font-mono mt-0.5">
                                {prod.brand} · {prod.multimediaType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-700 font-medium">
                          {prod.category.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                          {formatTaka(prod.price)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {prod.stock <= 5 ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                              {prod.stock} units
                            </span>
                          ) : (
                            <span className="text-slate-700 font-semibold">{prod.stock} units</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {prod.exchangePeriodDays} Days
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleRestock(prod.id, 20)}
                              className="px-2 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200 cursor-pointer"
                              title="Quick Restock +20"
                            >
                              +20 Stock
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Edit Everything"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#064E3B]">
                    Customer Orders & Delivery Status (Bangladesh)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatch parcels, monitor courier delivery tracking, and view paid tax receipts.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-[#064E3B]">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Recorded
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50/50 border-b border-emerald-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer & Location</th>
                      <th className="py-3.5 px-4">Purchased Items</th>
                      <th className="py-3.5 px-4 text-right">Total (৳)</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                      <th className="py-3.5 px-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <ShoppingCart className="w-10 h-10 text-emerald-300" />
                            <p className="text-sm font-bold text-[#064E3B]">No Customer Orders Yet</p>
                            <p className="text-xs text-slate-500 max-w-sm">
                              Store database initialized clean. Live customer checkouts and shipments will automatically appear here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                          <div className="font-bold font-mono text-neutral-900">#{ord.orderNumber}</div>
                          <div className="text-[11px] text-neutral-500">{ord.date}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-900">{ord.shippingAddress.fullName}</div>
                          <div className="text-[11px] text-neutral-500">
                            {ord.shippingAddress.city}, {ord.shippingAddress.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-800 line-clamp-1 font-medium">
                            {ord.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            {ord.trackingNumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-neutral-900">
                          {formatTaka(ord.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="text-xs py-1 px-2 bg-[#f8f5ee] border border-[#e5dccb] rounded-lg font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped (In Transit)</option>
                            <option value="delivered">Delivered</option>
                            <option value="exchange_requested">Exchange Requested</option>
                            <option value="exchange_approved">Exchange Approved</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedOrderForInvoice(ord);
                                setIsInvoiceModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                            >
                              Invoice
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete Order #${ord.orderNumber}?`)) {
                                  deleteOrder(ord.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DUE-TIME EXCHANGES */}
          {activeTab === 'exchanges' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#064E3B]">
                    Customer Due-Time Product Exchanges
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authorize replacements, review customer photo proofs, and assign courier pickup dates.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200 px-3 py-1 rounded-full">
                  14-Day Guarantee Active
                </span>
              </div>

              {exchanges.length === 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-14 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto shadow-xs">
                    <RefreshCw className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#064E3B]">No Due-Time Exchanges</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      All exchange tickets resolved or no customer exchange requests submitted yet. Customers can request free doorstep replacements within 14 days of delivery.
                    </p>
                  </div>
                </div>
              ) : (
                exchanges.map((exc) => (
                  <div key={exc.id} className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-mono text-slate-900">Ticket #{exc.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">Order #{exc.orderNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{exc.requestedDate}</span>
                      </div>
                      <span className="font-mono text-xs font-bold capitalize px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {exc.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs">
                      <div className="md:col-span-5 flex items-start gap-3">
                        <img
                          src={resolveImageUrl(exc.productImage)}
                          alt={exc.productName}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 block"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== IMAGES.wardrobe) {
                              target.src = IMAGES.wardrobe;
                            }
                          }}
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 leading-snug">{exc.productName}</h4>
                          <div className="text-slate-600">
                            <strong>Reason:</strong> <span className="capitalize">{exc.reason.replace('_', ' ')}</span>
                          </div>
                          <div className="text-slate-600">
                            <strong>Desired Replacement:</strong> {exc.preferredReplacement}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 italic text-slate-700">
                          "{exc.customerNotes}"
                        </div>

                        {resolvingExcId === exc.id ? (
                          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                            <h5 className="font-bold text-[#064E3B]">Authorize Exchange Resolution</h5>
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1">
                                Manager Resolution Note
                              </label>
                              <input
                                type="text"
                                value={resNote}
                                onChange={(e) => setResNote(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1">
                                Courier Return Pickup Date
                              </label>
                              <input
                                type="date"
                                value={resPickupDate}
                                onChange={(e) => setResPickupDate(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                              />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                onClick={() => setResolvingExcId(null)}
                                className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  updateExchangeStatus(exc.id, 'rejected', resNote);
                                  setResolvingExcId(null);
                                }}
                                className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg font-bold cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => {
                                  updateExchangeStatus(exc.id, 'approved', resNote, resPickupDate);
                                  setResolvingExcId(null);
                                }}
                                className="px-4 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg font-bold shadow-sm cursor-pointer"
                              >
                                Approve & Schedule Courier
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between pt-1">
                            {exc.adminResolutionNotes ? (
                              <div className="text-[11px] text-slate-600 font-medium">
                                <strong>Decision:</strong> {exc.adminResolutionNotes}
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-bold">Awaiting administrator decision</span>
                            )}
                            <button
                              onClick={() => {
                                setResolvingExcId(exc.id);
                                setResNote(`Approved exchange for ${exc.productName}. Free courier return.`);
                              }}
                              className="px-3.5 py-1.5 bg-[#064E3B] hover:bg-[#16A34A] text-white font-bold rounded-lg transition-all text-xs cursor-pointer shadow-xs"
                            >
                              Resolve Ticket
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: USER IDS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#e5dccb] shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-neutral-900">
                    Administrator & User Accounts
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Manage team permissions, store administrators, and registered customer IDs.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#fcfaf6] px-3 py-1.5 rounded-lg border border-[#e5dccb] text-neutral-800">
                  {users.length} Active Accounts
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#e5dccb] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfaf6] border-b border-[#e5dccb] text-neutral-600 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">User ID & Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#fcfaf6] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-neutral-900">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{u.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-700">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono ${
                              u.role === 'admin'
                                ? 'bg-black text-[#e5b842]'
                                : u.role === 'store_manager'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-600">{u.phone || 'N/A'}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                            ● Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#064E3B]">
                  GreenCart Financial & Performance Reports (৳ BDT)
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed sales volume and category fulfillment telemetry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Gross Revenue</div>
                  <div className="text-xl font-bold font-mono text-[#0A2540]">{formatTaka(totalRevenue)}</div>
                  <div className="text-[10px] text-slate-400">Bangladeshi Taka (BDT)</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Exchange Satisfaction</div>
                  <div className="text-xl font-bold font-mono text-slate-900">98.4%</div>
                  <div className="text-[10px] text-slate-400">Within 14-day window</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Fulfillment Rate</div>
                  <div className="text-xl font-bold font-mono text-slate-900">99.1%</div>
                  <div className="text-[10px] text-slate-400">Fast dispatch in Bangladesh</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS (Admin Can Edit Everything Including Hero Image) */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <h3 className="text-base font-bold text-[#0A2540]">
                  Storefront Branding & Hero Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  As requested, change the hero image at the beginning of the website, announcement banners, and operational rules.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
                {settingsNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Storefront updated successfully! View live storefront to preview.</span>
                  </div>
                )}

                {/* Hero Image Changer */}
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#0A2540] uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#00A86B]" />
                      <span>Website Beginning Hero Image</span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Change the prominent photograph shown at the beginning of the GreenCart storefront.
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={resolveImageUrl(heroImageInput)}
                      alt="Hero preview"
                      className="w-24 h-16 object-cover rounded-lg border border-slate-200 block"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== IMAGES.hero) {
                          target.src = IMAGES.hero;
                        }
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={heroImageInput}
                        onChange={(e) => setHeroImageInput(e.target.value)}
                        placeholder="Image URL..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setHeroImageInput(IMAGES.hero)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-bold rounded text-[11px] border border-emerald-200 cursor-pointer"
                        >
                          Showcase 1: Modern Eco Boutique (Default)
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroImageInput(IMAGES.heroAlt)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] border border-slate-300 cursor-pointer"
                        >
                          Showcase 2: Luxury Retail Packaging
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroImageInput(IMAGES.showcase)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] border border-slate-300 cursor-pointer"
                        >
                          Showcase 3: Premium Lifestyle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Headlines */}
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <h4 className="font-bold text-[#0A2540] uppercase tracking-wider text-xs">
                    Hero Headlines
                  </h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Headline</label>
                    <input
                      type="text"
                      value={heroTitleInput}
                      onChange={(e) => setHeroTitleInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={heroSubtitleInput}
                      onChange={(e) => setHeroSubtitleInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                    />
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#0A2540] uppercase tracking-wider text-xs">
                      Top Announcement Bar
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={announcementEnabled}
                        onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                        className="rounded accent-[#00A86B]"
                      />
                      <span className="text-slate-700 font-semibold">Enable Banner</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                  />
                </div>

                {/* Operating Policies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Exchange Guarantee Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={exchangeDaysInput}
                      onChange={(e) => setExchangeDaysInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Free Nationwide Shipping Threshold (৳ BDT)
                    </label>
                    <input
                      type="number"
                      value={freeShippingInput}
                      onChange={(e) => setFreeShippingInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all products and restore authentic photos?')) {
                        resetCatalogToDefault();
                        setHeroImageInput(IMAGES.hero);
                        alert('Catalog restored successfully!');
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all border border-slate-300 cursor-pointer"
                  >
                    Factory Reset Catalog & Photos
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99]"
                  >
                    Save Storefront Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
      />
    </div>
  );
};
