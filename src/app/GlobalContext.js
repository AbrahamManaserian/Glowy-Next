'use client'; // context must be a client component

import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext({
  isSticky: false,
  setIsSticky: () => {},
  cart: { length: 0, items: {} },
  setCart: () => {},
  cartDetails: [],
  setCartDetails: () => {},
  wishList: [],
  setWishList: () => {},
});

export function GlobalProvider({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const [cart, setCart] = useState({ length: 0, items: {} });
  const [cartDetails, setCartDetails] = useState([]);
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');

      if (savedCart) {
        const data = JSON.parse(savedCart);
        if (data.items) {
          setCart(data);
        } else {
          localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
          setCart({ length: 0, items: {} });
        }
      } else {
        localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
        setCart({ length: 0, items: {} });
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

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (cart && cart.items) {
        const ids = Object.keys(cart.items);
        if (ids.length > 0) {
          try {
            const response = await fetch(`/api/cart?ids=${ids.join(',')}`);
            if (response.ok) {
              const data = await response.json();
              console.log(data);
              setCartDetails(data);
            }
          } catch (error) {
            console.error('Failed to fetch cart details:', error);
          }
        } else {
          setCartDetails([]);
        }
      }
    };

    fetchCartDetails();
  }, [cart]);

  return (
    <GlobalContext.Provider
      value={{
        isSticky,
        setIsSticky,
        cart,
        setCart,
        cartDetails,
        setCartDetails,
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
