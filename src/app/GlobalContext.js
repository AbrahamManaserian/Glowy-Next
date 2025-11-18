'use client'; // context must be a client component

import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext({
  user: null,
  setUser: () => {},
  cart: { length: 0, items: {} },
  setCart: () => {},
  openCartAlert: null,
  setOpenCartAlert: () => {},
  openItemAddedAlert: null,
  setOpenItemAddedAlert: () => {},
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
  const [openItemAddedAlert, setOpenItemAddedAlert] = useState(null);
  const [wishList, setWishList] = useState([]);

  const handleClickError = () => {
    setCart({ length: 0, items: {} });
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
  };
  useEffect(() => {
    // const getCartFreshData = async () => {
    //   try {
    //     const savedCart = JSON.parse(localStorage.getItem('cart'));
    //     if (savedCart) {
    //       const items = { ...savedCart.items };

    //       await Promise.all(
    //         Object.keys(savedCart.items).map(async (id, index) => {
    //           const productRef = doc(db, 'glowy-products', id);
    //           const docSnap = await getDoc(productRef);
    //           if (docSnap.exists()) {
    //             const productData = docSnap.data();
    //             const availableOptionIndex = items[id].option;

    //             // console.log(productData);

    //             items[id].image = productData.mainImage.file;
    //             items[id].name = `${productData.brand} - ${productData.model}`;
    //             items[id].price = availableOptionIndex
    //               ? productData.availableOptions[availableOptionIndex].optionPrice
    //               : productData.price;
    //             items[id].previousPrice = availableOptionIndex
    //               ? productData.availableOptions[availableOptionIndex].optionPreviousPrice
    //               : productData.previousPrice;
    //             // console.log(items[id]);
    //           } else {
    //             // docSnap.data() will be undefined in this case
    //             console.log('No such document!');
    //           }
    //         })
    //       );
    //       setCart({ ...savedCart, items: items });
    //       localStorage.setItem('cart', JSON.stringify({ ...savedCart, items: items }));
    //       // console.log(items);
    //     }
    //   } catch (e) {
    //     localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
    //     setCart({ length: 0, items: {} });
    //     console.log(e);
    //   }
    // };
    // getCartFreshData();
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
        setOpenItemAddedAlert,
        openItemAddedAlert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
