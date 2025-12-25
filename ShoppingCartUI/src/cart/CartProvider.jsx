import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";

const STORAGE_KEY = "shopping_cart_v1";

export function CartProvider({ children }) {

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / private mode errors
    }
  }, [items]);

  function addToCart(product) {
    setItems(prev => {
      const found = prev.find(x => x.product.id === product.id);
      return found
        ? prev.map(x =>
          x.product.id === product.id
            ? { ...x, qty: x.qty + 1 }
            : x
        )
        : [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(x => x.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function increment(productId) {
    setItems(prev =>
      prev.map(x =>
        x.product.id === productId
          ? { ...x, qty: x.qty + 1 }
          : x
      )
    );
  }

  function decrement(productId) {
    setItems(prev =>
      prev
        .map(x =>
          x.product.id === productId
            ? { ...x, qty: x.qty - 1 }
            : x
        )
        .filter(x => x.qty > 0)
    );
  }

  const totals = useMemo(() => ({
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
  }), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        totals,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
