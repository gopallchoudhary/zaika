import React, { createContext, useContext, useState } from "react";
import { MenuItem, CartItem, Order, OrderItem } from "../data/types";
import { ORDERS } from "../data/orders";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (address: string, paymentMethod: string) => Order | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prevItems.map((item) =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (address: string, paymentMethod: string): Order | null => {
    if (cartItems.length === 0) return null;

    // Pick details from the first item to represent the restaurant
    const firstItem = cartItems[0].menuItem;
    
    // We can mock restaurant details or fetch if needed. Let's assume we map the restaurant id to some images
    const restaurantName = firstItem.restaurantId === 'r1' ? 'Burger Palace' 
      : firstItem.restaurantId === 'r2' ? 'Spice Garden'
      : firstItem.restaurantId === 'r8' ? 'Green Bowl'
      : firstItem.restaurantId === 'r9' ? 'Biryani Blues'
      : 'Specialty Kitchen';
      
    const restaurantImage = firstItem.imageUrl;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.menuItem.price,
    }));

    const subtotal = cartTotal;
    const deliveryFee = subtotal > 300 ? 0 : 29; // Free delivery over 300
    const total = subtotal + deliveryFee;

    const newOrder: Order = {
      id: "ord" + Math.floor(Math.random() * 100000),
      restaurantId: firstItem.restaurantId,
      restaurantName,
      restaurantImage,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: "placed",
      placedAt: new Date().toISOString(),
      deliveryAddress: address,
      paymentMethod,
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
