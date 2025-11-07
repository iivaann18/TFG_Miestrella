// Producto - AÑADIR rating y corregir
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  handle: string;
  sku?: string;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  rating?: number; // AÑADIDO
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

// Imagen de producto
export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  availableForSale: boolean;
  quantityAvailable?: number;
}

// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  role: 'customer' | 'admin' | 'employee';
  permissions?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeePermissions {
  can_edit_products: boolean;
  can_delete_products: boolean;
  can_view_orders: boolean;
  can_edit_orders: boolean;
  can_manage_users: boolean;
  can_create_coupons: boolean;
  can_edit_coupons: boolean;
  can_delete_coupons: boolean;
  can_view_analytics: boolean;
}

// Cart Types
export interface CartItem {
  variantId: string;
  productId: number;
  title: string;
  price: string;
  quantity: number;
  image: string;
  handle: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

// Order Types - AÑADIR itemsCount
export interface Order {
  id: number;
  orderNumber: string;
  userId?: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentIntentId?: string; 
  shippingAddress: Address; 
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  items?: OrderItem[];
  itemsCount?: number; // AÑADIDO - para mostrar el número de items
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId?: number;
  productTitle: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
}

// Coupon Types
export interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount: number;
  maxUses?: number;
  currentUses: number;
  isPermanent: boolean;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdBy?: number;
  createdByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

// Shipping Address
export interface ShippingAddress {
  id?: number;
  userId?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Payment Types - AÑADIDO
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Checkout Types - AÑADIDO
export interface CheckoutData {
  amount: number;
  currency: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  billingAddress: Address;
  shippingAddress: Address;
  items: Array<{
    productId: number;
    title: string;
    quantity: number;
    price: number;
  }>;
  couponCode?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}