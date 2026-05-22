import { Order } from './types';

export const ORDERS: Order[] = [
  // ── Delivered – yesterday ──────────────────────────────────────────────────
  {
    id: 'ord1',
    restaurantId: 'r9',
    restaurantName: 'Biryani Blues',
    restaurantImage:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    items: [
      { menuItemId: 'm6', name: 'Hyderabadi Dum Biryani', quantity: 2, price: 349 },
      { menuItemId: 'm7', name: 'Veg Dum Biryani',        quantity: 1, price: 249 },
    ],
    subtotal: 947,
    deliveryFee: 0,
    total: 947,
    status: 'delivered',
    placedAt: '2026-05-21T19:15:00.000Z',
    deliveredAt: '2026-05-21T19:58:00.000Z',
    deliveryAddress: '14 Sunshine Apartments, Wright Town, Jabalpur 482002',
    paymentMethod: 'UPI',
  },

  // ── Out for delivery – active order ────────────────────────────────────────
  {
    id: 'ord2',
    restaurantId: 'r1',
    restaurantName: 'Burger Palace',
    restaurantImage:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    items: [
      { menuItemId: 'm1', name: 'Classic Smash Burger',  quantity: 1, price: 249 },
      { menuItemId: 'm2', name: 'Crispy Chicken Burger', quantity: 1, price: 229 },
      { menuItemId: 'm3', name: 'Loaded Cheese Fries',   quantity: 2, price: 149 },
    ],
    subtotal: 776,
    deliveryFee: 29,
    total: 805,
    status: 'out_for_delivery',
    placedAt: '2026-05-22T12:05:00.000Z',
    deliveryAddress: '14 Sunshine Apartments, Wright Town, Jabalpur 482002',
    paymentMethod: 'Credit Card',
  },

  // ── Preparing – active order ───────────────────────────────────────────────
  {
    id: 'ord3',
    restaurantId: 'r2',
    restaurantName: 'Spice Garden',
    restaurantImage:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    items: [
      { menuItemId: 'm4', name: 'Butter Chicken',        quantity: 1, price: 320 },
      { menuItemId: 'm5', name: 'Paneer Tikka Masala',   quantity: 1, price: 280 },
    ],
    subtotal: 600,
    deliveryFee: 0,
    total: 600,
    status: 'preparing',
    placedAt: '2026-05-22T13:30:00.000Z',
    deliveryAddress: '14 Sunshine Apartments, Wright Town, Jabalpur 482002',
    paymentMethod: 'Cash on Delivery',
  },

  // ── Delivered – 3 days ago ─────────────────────────────────────────────────
  {
    id: 'ord4',
    restaurantId: 'r8',
    restaurantName: 'Green Bowl',
    restaurantImage:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    items: [
      { menuItemId: 'm8', name: 'Mediterranean Power Bowl', quantity: 2, price: 389 },
    ],
    subtotal: 778,
    deliveryFee: 0,
    total: 778,
    status: 'delivered',
    placedAt: '2026-05-19T11:00:00.000Z',
    deliveredAt: '2026-05-19T11:28:00.000Z',
    deliveryAddress: 'Office – 5th Floor, Magneto Mall, Jabalpur 482003',
    paymentMethod: 'UPI',
  },

  // ── Cancelled ─────────────────────────────────────────────────────────────
  {
    id: 'ord5',
    restaurantId: 'r3',
    restaurantName: 'Pizza Amore',
    restaurantImage:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    items: [
      { menuItemId: 'mA', name: 'Margherita Pizza (Large)', quantity: 1, price: 399 },
      { menuItemId: 'mB', name: 'Garlic Bread',             quantity: 1, price: 129 },
    ],
    subtotal: 528,
    deliveryFee: 39,
    total: 567,
    status: 'cancelled',
    placedAt: '2026-05-18T20:45:00.000Z',
    deliveryAddress: '14 Sunshine Apartments, Wright Town, Jabalpur 482002',
    paymentMethod: 'Credit Card',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getOrderById = (id: string): Order | undefined =>
  ORDERS.find((o) => o.id === id);

export const getActiveOrders = (): Order[] =>
  ORDERS.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status),
  );

export const getPastOrders = (): Order[] =>
  ORDERS.filter((o) => ['delivered', 'cancelled'].includes(o.status));

/** Sort by most recent first */
export const getSortedOrders = (): Order[] =>
  [...ORDERS].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  );

export const getOrdersByRestaurant = (restaurantId: string): Order[] =>
  ORDERS.filter((o) => o.restaurantId === restaurantId);

/** Human-readable status labels for the UI */
export const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
  placed:            'Order Placed',
  confirmed:         'Confirmed',
  preparing:         'Preparing',
  out_for_delivery:  'Out for Delivery',
  delivered:         'Delivered',
  cancelled:         'Cancelled',
};

/** Colour intent for each status (map to your theme tokens) */
export const ORDER_STATUS_COLOR: Record<Order['status'], string> = {
  placed:            '#F59E0B',  // amber
  confirmed:         '#3B82F6',  // blue
  preparing:         '#8B5CF6',  // purple
  out_for_delivery:  '#10B981',  // green
  delivered:         '#6B7280',  // gray
  cancelled:         '#EF4444',  // red
};