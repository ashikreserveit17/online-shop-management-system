export type CategoryId =
  | 'all'
  | 'home_appliances'
  | 'mens_wardrobe'
  | 'womens_wardrobe'
  | 'office_equipment'
  | 'automobiles'
  | 'phones_telecom';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortDesc: string;
  iconName: string;
  image: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  image: string;
  gallery: string[];
  multimediaType: 'video_preview' | '360_view' | 'audio_demo';
  multimediaTitle: string;
  multimediaSnippet: string;
  variants: ProductVariant[];
  warranty: string;
  exchangeEligible: boolean;
  exchangePeriodDays: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export type PaymentMethodType = 'credit_card' | 'upi_netbanking' | 'digital_wallet' | 'cash_on_delivery';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  upiId?: string;
  walletName?: string;
  transactionId: string;
  paidAt: string;
  amount: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes?: string;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'exchange_requested' | 'exchange_approved' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  payment: PaymentDetails;
  trackingNumber: string;
  estimatedDelivery: string;
  userId?: string;
}

export type ExchangeStatus = 'pending_review' | 'approved' | 'rejected' | 'pickup_scheduled' | 'completed';

export interface ExchangeRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  requestedDate: string;
  reason: 'size_fit' | 'defective' | 'damaged_transit' | 'color_style' | 'upgrade_model';
  customerNotes: string;
  status: ExchangeStatus;
  preferredReplacement: string;
  adminResolutionNotes?: string;
  scheduledPickupDate?: string;
  proofImageUrl?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  heroImage: string;
  currencySymbol: string;
  currencyCode: string;
  announcementBar: {
    enabled: boolean;
    text: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  highlightedCategories: CategoryId[];
  exchangeGuaranteeDays: number;
  freeShippingThreshold: number;
  supportEmail: string;
  supportPhone: string;
}

export type UserRole = 'admin' | 'store_manager' | 'customer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarText?: string;
  createdAt: string;
  lastActive?: string;
  status: 'active' | 'suspended';
}

