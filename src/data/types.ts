// ─── Restaurant ───────────────────────────────────────────────────────────────

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;        // 1.0 – 5.0
  reviewCount: number;
  deliveryTime: string;  // e.g. "20–30 min"
  deliveryFee: number;   // in ₹
  priceRange: PriceRange;
  imageUrl: string;
  isOpen: boolean;
  isFeatured: boolean;
  tags: string[];        // e.g. ["Spicy", "Veg Friendly"]
  address: string;
}

// ─── Menu Item ────────────────────────────────────────────────────────────────

export type DietType = 'veg' | 'non-veg' | 'vegan';

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;         // in ₹
  imageUrl: string;
  category: string;      // e.g. "Starters", "Mains", "Drinks"
  dietType: DietType;
  isPopular: boolean;
  isAvailable: boolean;
  rating: number;
}

// ─── Cart Item ────────────────────────────────────────────────────────────────

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;      // ISO date string
  deliveredAt?: string;
  deliveryAddress: string;
  paymentMethod: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  label: string;         // "Home", "Work", "Other"
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  addresses: Address[];
  savedRestaurantIds: string[];
  joinedAt: string;
}