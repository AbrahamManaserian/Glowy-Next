'use client'; // context must be a client component

import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext({
  user: null,
  setUser: () => {},
  cart: { length: 0, items: {} },
  setCart: () => {},
  openCartAlert: null,
  setOpenCartAlert: () => {},
  isSticky: false,
  setIsSticky: () => {},
  wishList: [],
  setWishList: () => {},
});

export function GlobalProvider({ children }) {
  // console.log('asd');
  const [isSticky, setIsSticky] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ length: 0, items: {} });
  const [openCartAlert, setOpenCartAlert] = useState(null);
  const [wishList, setWishList] = useState([]);

  const handleClickError = () => {
    setCart({ length: 0, items: {} });
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
  };
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
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
        user,
        setUser,
        cart,
        setCart,
        openCartAlert,
        setOpenCartAlert,
        handleClickError,
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
