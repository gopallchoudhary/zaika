import { MenuItem } from './types';

// Menu items are spread across r1 (Burger Palace), r2 (Spice Garden),
// r3 (Pizza Amore), r9 (Biryani Blues), and r8 (Green Bowl).
// Each screen only shows items filtered by restaurantId.

export const MENU_ITEMS: MenuItem[] = [
  // ── Burger Palace (r1) ────────────────────────────────────────────────────
  {
    id: 'm1',
    restaurantId: 'r1',
    name: 'Classic Smash Burger',
    description:
      'Double smash patty, American cheese, caramelised onions, pickles, house burger sauce in a brioche bun.',
    price: 249,
    imageUrl:
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
    category: 'Burgers',
    dietType: 'non-veg',
    isPopular: true,
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: 'm2',
    restaurantId: 'r1',
    name: 'Crispy Chicken Burger',
    description:
      'Buttermilk-fried chicken thigh, coleslaw, jalapeño mayo, served in a toasted potato bun.',
    price: 229,
    imageUrl:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80',
    category: 'Burgers',
    dietType: 'non-veg',
    isPopular: true,
    isAvailable: true,
    rating: 4.5,
  },
  {
    id: 'm3',
    restaurantId: 'r1',
    name: 'Loaded Cheese Fries',
    description:
      'Thick-cut fries topped with nacho cheese sauce, diced jalapeños, spring onions and sour cream.',
    price: 149,
    imageUrl:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
    category: 'Sides',
    dietType: 'veg',
    isPopular: false,
    isAvailable: true,
    rating: 4.3,
  },

  // ── Spice Garden (r2) ─────────────────────────────────────────────────────
  {
    id: 'm4',
    restaurantId: 'r2',
    name: 'Butter Chicken',
    description:
      'Tender chicken in a rich, velvety tomato-butter gravy simmered with cream and aromatic spices. Best with naan.',
    price: 320,
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80',
    category: 'Mains',
    dietType: 'non-veg',
    isPopular: true,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'm5',
    restaurantId: 'r2',
    name: 'Paneer Tikka Masala',
    description:
      'Char-grilled paneer cubes in a smoky, spiced onion-tomato masala. Served with two butter naans.',
    price: 280,
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    category: 'Mains',
    dietType: 'veg',
    isPopular: true,
    isAvailable: true,
    rating: 4.8,
  },

  // ── Biryani Blues (r9) ────────────────────────────────────────────────────
  {
    id: 'm6',
    restaurantId: 'r9',
    name: 'Hyderabadi Dum Biryani',
    description:
      'Slow-cooked basmati rice layered with marinated mutton, saffron milk and caramelised onions. Served with raita.',
    price: 349,
    imageUrl:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    category: 'Biryani',
    dietType: 'non-veg',
    isPopular: true,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'm7',
    restaurantId: 'r9',
    name: 'Veg Dum Biryani',
    description:
      'Fragrant basmati rice cooked with seasonal vegetables, whole spices and fresh mint. Served with salan.',
    price: 249,
    imageUrl:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    category: 'Biryani',
    dietType: 'veg',
    isPopular: false,
    isAvailable: true,
    rating: 4.6,
  },

  // ── Green Bowl (r8) ───────────────────────────────────────────────────────
  {
    id: 'm8',
    restaurantId: 'r8',
    name: 'Mediterranean Power Bowl',
    description:
      'Quinoa base, roasted chickpeas, avocado, cucumber, cherry tomatoes, feta, olives and lemon-tahini dressing.',
    price: 389,
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    category: 'Bowls',
    dietType: 'vegan',
    isPopular: true,
    isAvailable: true,
    rating: 4.7,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getMenuByRestaurant = (restaurantId: string): MenuItem[] =>
  MENU_ITEMS.filter((item) => item.restaurantId === restaurantId);

export const getMenuItemById = (id: string): MenuItem | undefined =>
  MENU_ITEMS.find((item) => item.id === id);

export const getPopularItemsByRestaurant = (restaurantId: string): MenuItem[] =>
  MENU_ITEMS.filter((item) => item.restaurantId === restaurantId && item.isPopular);

export const getMenuByCategory = (
  restaurantId: string,
  category: string,
): MenuItem[] =>
  MENU_ITEMS.filter(
    (item) => item.restaurantId === restaurantId && item.category === category,
  );

/** All unique categories for a given restaurant */
export const getCategoriesByRestaurant = (restaurantId: string): string[] => [
  ...new Set(
    MENU_ITEMS.filter((item) => item.restaurantId === restaurantId).map(
      (item) => item.category,
    ),
  ),
];