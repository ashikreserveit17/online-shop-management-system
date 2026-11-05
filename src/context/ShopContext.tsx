import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  CategoryId,
  CartItem,
  Order,
  ExchangeRequest,
  StoreSettings,
  OrderStatus,
  ExchangeStatus,
  UserAccount,
} from '../types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_EXCHANGES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '../data/initialCatalog';
import { resolveImageUrl } from '../data/assets';

interface ShopContextType {
  // Navigation & Views
  currentView: 'storefront' | 'admin';
  setCurrentView: (view: 'storefront' | 'admin') => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Admin & User Authentication
  isAdminAuthenticated: boolean;
  adminUser: UserAccount | null;
  adminLogin: (idOrEmail: string, pass: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  customerUser: UserAccount | null;
  customerLogin: (email: string, name?: string) => void;
  customerLogout: () => void;
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUserRole: (id: string, role: UserAccount['role']) => void;
  deleteUser: (id: string) => void;

  // Catalog State & Actions (Full Admin Edit Access)
  products: Product[];
  categories: typeof CATEGORIES;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetCatalogToDefault: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Cart State & Actions
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders State & Actions
  orders: Order[];
  myOrders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;

  // Exchange State & Actions
  exchanges: ExchangeRequest[];
  createExchangeRequest: (request: Omit<ExchangeRequest, 'id' | 'requestedDate' | 'status'>) => ExchangeRequest;
  updateExchangeStatus: (exchangeId: string, status: ExchangeStatus, resolutionNotes?: string, pickupDate?: string) => void;
  selectedOrderForExchange: Order | null;
  setSelectedOrderForExchange: (order: Order | null) => void;

  // Store Settings (Admin Keeps Full Interface & Banner Control)
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isExchangeModalOpen: boolean;
  setIsExchangeModalOpen: (open: boolean) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  isCustomerLoginOpen: boolean;
  setIsCustomerLoginOpen: (open: boolean) => void;

  // Currency helper
  formatTaka: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'greencart_products_v9',
  ORDERS: 'greencart_orders_v9',
  EXCHANGES: 'greencart_exchanges_v9',
  SETTINGS: 'greencart_settings_v9',
  CART: 'greencart_cart_v9',
  USERS: 'greencart_users_v9',
  ADMIN_AUTH: 'greencart_admin_auth_v9',
  CUST_AUTH: 'greencart_cust_auth_v9',
};

// Helper to sanitize product image paths using product name
function sanitizeProduct(p: Product): Product {
  const safeImage = p.image?.startsWith('data:') ? p.image : resolveImageUrl(p.image, p.name);
  return {
    ...p,
    image: safeImage,
    gallery: (p.gallery && p.gallery.length > 0 ? p.gallery : [p.image]).map((img) =>
      img?.startsWith('data:') ? img : resolveImageUrl(img, p.name)
    ),
  };
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isUrlAdmin = () => {
    try {
      const search = window.location.search;
      const hash = window.location.hash;
      return (
        search.includes('portal=admin') ||
        search.includes('admin=true') ||
        hash === '#admin' ||
        hash === '#admin-portal'
      );
    } catch {
      return false;
    }
  };

  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>(() => {
    return isUrlAdmin() ? 'admin' : 'storefront';
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<UserAccount | null>(() => {
    return INITIAL_USERS[0];
  });

  const [customerUser, setCustomerUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUST_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Products with full realistic photo sanitization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeProduct);
        }
      }
      return INITIAL_PRODUCTS.map(sanitizeProduct);
    } catch {
      return INITIAL_PRODUCTS.map(sanitizeProduct);
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((o: Order) => ({
          ...o,
          items: o.items.map((it) => ({
            ...it,
            product: sanitizeProduct(it.product),
          })),
        }));
      }
      return INITIAL_ORDERS.map((o) => ({
        ...o,
        items: o.items.map((it) => ({
          ...it,
          product: sanitizeProduct(it.product),
        })),
      }));
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Exchanges
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((e: ExchangeRequest) => ({
          ...e,
          productImage: resolveImageUrl(e.productImage, e.productName),
        }));
      }
      return INITIAL_EXCHANGES.map((e) => ({
        ...e,
        productImage: resolveImageUrl(e.productImage, e.productName),
      }));
    } catch {
      return INITIAL_EXCHANGES;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          heroImage: resolveImageUrl(parsed.heroImage || INITIAL_SETTINGS.heroImage),
        };
      }
      return {
        ...INITIAL_SETTINGS,
        heroImage: resolveImageUrl(INITIAL_SETTINGS.heroImage),
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((it: CartItem) => ({
          ...it,
          product: sanitizeProduct(it.product),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Modals & Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForExchange, setSelectedOrderForExchange] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);

  // Sync to URL listener
  useEffect(() => {
    const handlePopState = () => {
      if (isUrlAdmin()) {
        setCurrentView('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save to persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(exchanges));
    } catch (e) {
      console.warn(e);
    }
  }, [exchanges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  }, [users]);

  // Admin Login Handler: supports 'admin' / 'admin123', 'tanvir' / 'sabas2026', and more
  const adminLogin = (idOrEmail: string, pass: string): { success: boolean; error?: string } => {
    const trimmedId = idOrEmail.trim().toLowerCase();
    const trimmedPass = pass.trim();

    const validIds = [
      'admin',
      'greencart',
      'admin@greencart.com',
      'tanvir',
      'ishaat',
      'admin@ishaatonlineshop.com',
      'ishaat.vectorenterprise7@gmail.com',
      'admin@sabas.com.bd',
    ];
    const validPass = ['admin123', 'greencart123', 'sabas2026', 'admin', 'sabas', '123456', 'ishaat123'];

    if (!validIds.includes(trimmedId)) {
      return { success: false, error: 'Invalid Administrator Login ID. Use "admin" or "admin@greencart.com".' };
    }

    if (!validPass.includes(trimmedPass)) {
      return { success: false, error: 'Incorrect Administrator Password. Use "admin123".' };
    }

    setIsAdminAuthenticated(true);
    setAdminUser(INITIAL_USERS[0]);
    try {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch (e) {
      console.warn(e);
    }

    return { success: true };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch (e) {
      console.warn(e);
    }
  };

  // Customer Login Handler
  const customerLogin = (email: string, name?: string) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCustomerUser(existing);
      localStorage.setItem(STORAGE_KEYS.CUST_AUTH, JSON.stringify(existing));
    } else {
      const newUser: UserAccount = {
        id: `usr-cust-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: 'customer',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setCustomerUser(newUser);
      setUsers((prev) => [...prev, newUser]);
      localStorage.setItem(STORAGE_KEYS.CUST_AUTH, JSON.stringify(newUser));
    }
    setIsCustomerLoginOpen(false);
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem(STORAGE_KEYS.CUST_AUTH);
  };

  // User accounts management
  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUserRole = (id: string, role: UserAccount['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Product CRUD actions - Full Admin Editing Access
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = sanitizeProduct({
      ...productData,
      id: `prod-${Date.now()}`,
    });
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return sanitizeProduct({ ...item, ...updates });
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetCatalogToDefault = () => {
    const fresh = INITIAL_PRODUCTS.map(sanitizeProduct);
    setProducts(fresh);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(fresh));
    } catch (e) {
      console.warn(e);
    }
  };

  // Cart actions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    const safeProduct = sanitizeProduct(product);
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.product.id === safeProduct.id &&
          JSON.stringify(ci.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product: safeProduct, quantity, selectedVariants }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], quantity };
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );

  // Customer-specific orders (strictly orders belonging to current logged in customer)
  const myOrders = useMemo(() => {
    if (!customerUser) return [];
    return orders.filter((o) => {
      const emailMatches =
        o.shippingAddress?.email &&
        customerUser.email &&
        o.shippingAddress.email.toLowerCase() === customerUser.email.toLowerCase();
      const userMatches = o.userId && o.userId === customerUser.id;
      return Boolean(emailMatches || userMatches);
    });
  }, [orders, customerUser]);

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const timestamp = Date.now();
    const orderNumber = `GC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      userId: customerUser?.id,
      items: orderData.items.map((it) => ({
        ...it,
        product: sanitizeProduct(it.product),
      })),
      id: `ord-${timestamp}`,
      orderNumber,
      date: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Decrement stock
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderData.items.find((item) => item.product.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity),
          };
        }
        return prod;
      })
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Exchanges
  const createExchangeRequest = (
    requestData: Omit<ExchangeRequest, 'id' | 'requestedDate' | 'status'>
  ): ExchangeRequest => {
    const newExchange: ExchangeRequest = {
      ...requestData,
      productImage: resolveImageUrl(requestData.productImage, requestData.productName),
      id: `exc-${Date.now()}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending_review',
    };

    setExchanges((prev) => [newExchange, ...prev]);
    updateOrderStatus(requestData.orderId, 'exchange_requested');
    return newExchange;
  };

  const updateExchangeStatus = (
    exchangeId: string,
    status: ExchangeStatus,
    resolutionNotes?: string,
    pickupDate?: string
  ) => {
    setExchanges((prev) =>
      prev.map((exc) => {
        if (exc.id === exchangeId) {
          return {
            ...exc,
            status,
            adminResolutionNotes: resolutionNotes || exc.adminResolutionNotes,
            scheduledPickupDate: pickupDate || exc.scheduledPickupDate,
          };
        }
        return exc;
      })
    );

    if (status === 'approved') {
      const targetExc = exchanges.find((e) => e.id === exchangeId);
      if (targetExc) {
        updateOrderStatus(targetExc.orderId, 'exchange_approved');
      }
    }
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.heroImage) {
        updated.heroImage = resolveImageUrl(newSettings.heroImage);
      }
      return updated;
    });
  };

  // Format Bangladeshi Taka
  const formatTaka = (amount: number): string => {
    return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        customerUser,
        customerLogin,
        customerLogout,
        users,
        addUser,
        updateUserRole,
        deleteUser,
        products,
        categories: CATEGORIES,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalogToDefault,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        orders,
        myOrders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,
        exchanges,
        createExchangeRequest,
        updateExchangeStatus,
        selectedOrderForExchange,
        setSelectedOrderForExchange,
        settings,
        updateSettings,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isExchangeModalOpen,
        setIsExchangeModalOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        isCustomerLoginOpen,
        setIsCustomerLoginOpen,
        formatTaka,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
