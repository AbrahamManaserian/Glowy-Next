'use client'; // context must be a client component

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export const GlobalContext = createContext({
  isSticky: false,
  setIsSticky: () => {},
  cart: { length: 0, items: {} },
  setCart: () => {},
  cartDetails: {},
  setCartDetails: () => {},
  wishList: [],
  setWishList: () => {},
  wishListDetails: [],
  setWishListDetails: () => {},
  wishListLoading: false,
  user: null,
  loading: true,
});

export function GlobalProvider({ children }) {
  const [isSticky, setIsSticky] = useState(false);
  const [cart, setCart] = useState({ length: 0, items: {} });
  const [cartDetails, setCartDetails] = useState({});
  const [wishList, setWishList] = useState([]);
  const [wishListDetails, setWishListDetails] = useState([]);
  const [wishListLoading, setWishListLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const initializeData = async () => {
      if (user) {
        // User is signed in: Fetch from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.cart) {
              setCart(userData.cart);
            } else {
              setCart({ length: 0, items: {} });
            }

            if (userData.wishList) {
              setWishList(userData.wishList);
            } else {
              setWishList([]);
            }
          } else {
            // New user or no data yet
            setCart({ length: 0, items: {} });
            setWishList([]);
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      } else {
        // User is not signed in: Fetch from LocalStorage
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
      }
    };

    initializeData();
  }, [user, loading]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (cart && cart.items) {
        const ids = Object.keys(cart.items);
        // console.log('Cart IDs to fetch:', ids);
        if (ids.length > 0) {
          try {
            // Create a unique URL based on the specific combination of IDs
            // Sort them so ?ids=A,B is the same as ?ids=B,A (better caching)
            const sortedIds = ids.sort().join(',');
            const url = `/api/cart?ids=${sortedIds}`;

            // console.log('Fetching URL:', url);

            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              // console.log('Fetched Cart Data:', data);
              setCartDetails(data);
            }
          } catch (error) {
            console.error('Failed to fetch cart details:', error);
          }
        } else {
          setCartDetails({});
        }
      }
    };

    fetchCartDetails();
  }, [cart]);

  useEffect(() => {
    const fetchWishListDetails = async () => {
      if (wishList && wishList.length > 0) {
        setWishListLoading(true);
        try {
          const sortedIds = [...wishList].sort().join(',');
          const response = await fetch(`/api/cart?ids=${sortedIds}`);
          if (response.ok) {
            const data = await response.json();
            const validItems = Object.values(data);
            setWishListDetails(validItems);

            // Sync local wishlist with valid items from DB
            const validIds = Object.keys(data);
            if (validIds.length !== wishList.length) {
              const newWishList = wishList.filter((id) => validIds.includes(id));
              setWishList(newWishList);

              if (user) {
                const userRef = doc(db, 'users', user.uid);
                setDoc(userRef, { wishList: newWishList }, { merge: true }).catch((err) =>
                  console.error('Error syncing wishlist:', err)
                );
              } else {
                localStorage.setItem('fav', JSON.stringify(newWishList));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist items:', error);
        } finally {
          setWishListLoading(false);
        }
      } else {
        setWishListDetails([]);
        setWishListLoading(false);
      }
    };
    fetchWishListDetails();
  }, [wishList, user]);

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
        wishListDetails,
        setWishListDetails,
        wishListLoading,
        user,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
