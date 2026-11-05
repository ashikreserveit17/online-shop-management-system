import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/storefront/AnnouncementBar';
import { HeroShowcase } from './components/storefront/HeroShowcase';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { CustomerOrdersModal } from './components/storefront/CustomerOrdersModal';
import { ExchangeModal } from './components/storefront/ExchangeModal';
import { CustomerLoginModal } from './components/storefront/CustomerLoginModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginGate } from './components/admin/AdminLoginGate';
import { Footer } from './components/storefront/Footer';

const AppContent: React.FC = () => {
  const { currentView, isAdminAuthenticated } = useShop();

  // If user navigated to the Admin Portal Link
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      // Secure Admin Login Gateway: Inputs are 100% blank, no prefilled credentials
      return <AdminLoginGate />;
    }
    // Authenticated Admin Dashboard matching user's exact design
    return <AdminDashboard />;
  }

  // Regular Customer Storefront (Zero admin login button visible to customers)
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#16A34A] selection:text-white">
      {/* Top Announcement Banner */}
      <AnnouncementBar />

      {/* Global Top Bar with Sabas Logo & Customer Navigation */}
      <Header />

      {/* Main Storefront View */}
      <main className="flex-1 flex flex-col">
        {/* Hero Showcase with Dynamic Hero Image */}
        <HeroShowcase />

        {/* Product Catalog Grid & Filters in Bangladeshi Taka (৳) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <ProductGrid />
        </div>
      </main>

      {/* Public Storefront Footer */}
      <Footer />

      {/* Storefront Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <CustomerOrdersModal />
      <ExchangeModal />
      <CustomerLoginModal />
      <InvoiceModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
