'use client'; // context must be a client component

import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext({
  isSticky: false,
  setIsSticky: () => {},
  cart: { length: 0, items: {} },
  setCart: () => {},
  wishList: [],
  setWishList: () => {},
});

export function GlobalProvider({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const [cart, setCart] = useState({ length: 0, items: {} });
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
        console.log(JSON.parse(savedCart));

        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
        // setCart({ length: 0, items: {} });
      }
    } catch (error) {
      localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
      setCart({ length: 0, items: {} });
      console.log(error);
    }

    try {
      const savedWishList = localStorage.getItem('fav');
      if (savedWishList) {
        setWishList(JSON.parse(savedWishList));
      } else {
        localStorage.setItem('fav', JSON.stringify([]));
      }
    } catch (error) {
      localStorage.setItem('fav', JSON.stringify([]));
      setWishList([]);
      console.log(error);
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isSticky,
        setIsSticky,
        cart,
        setCart,
        wishList,
        setWishList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
