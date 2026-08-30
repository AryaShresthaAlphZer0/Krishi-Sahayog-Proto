import { useCallback, useEffect, useMemo, useState } from "react";

import { CartContext } from "./cartContextInstance";


const STORAGE_KEY = "krishi_cart";


function loadInitialCart() {

  if (typeof window === "undefined") {
    return [];
  }

  try {

    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];

  } catch {

    return [];
  }
}


export function CartProvider({ children }) {

  const [items, setItems] = useState(loadInitialCart);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

  }, [items]);


  const addToCart = useCallback((product, quantity = 1) => {

    setItems((current) => {

      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {

        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          icon: product.icon,
          unit: product.unit,
          price: product.basePrice,
          quantity,
        },
      ];
    });

  }, []);


  const removeFromCart = useCallback((id) => {

    setItems((current) =>
      current.filter((item) => item.id !== id)
    );

  }, []);


  const updateQuantity = useCallback((id, quantity) => {

    if (quantity < 1) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

  }, []);


  const clearCart = useCallback(() => {
    setItems([]);
  }, []);


  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);


  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [items]
  );


  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
    totalItems,
    totalPrice,
  };


  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}