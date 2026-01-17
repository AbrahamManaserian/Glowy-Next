import { auth, db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const persistCart = async (cartItems) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { cart: cartItems });
    } catch (error) {
      console.error('Error updating cart in Firestore:', error);
    }
  } else {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }
};

export const increaseQuantity = (id, cart, setCart, option) => {
  try {
    let cartItems = structuredClone(cart);
    ++cartItems.length;
    ++cartItems.items[id].quantity;
    if (option) {
      ++cartItems.items[id].options[option];
    }

    persistCart(cartItems);
    setCart(cartItems);
  } catch (error) {
    const emptyCart = { length: 0, items: {} };
    persistCart(emptyCart);
    setCart(emptyCart);
    console.log(error);
  }
};

export const deleteItem = (id, cart, setCart, option) => {
  try {
    let cartItems = structuredClone(cart);
    if (option) {
      cartItems.length = cartItems.length - cartItems.items[id].options[option];
      if (cartItems.items[id].quantity - cartItems.items[id].options[option] < 1) {
        delete cartItems.items[id];
      } else {
        cartItems.items[id].quantity = cartItems.items[id].quantity - cartItems.items[id].options[option];
        delete cartItems.items[id].options[option];
      }
    } else {
      cartItems.length = cartItems.length - cartItems.items[id].quantity;
      delete cartItems.items[id];
    }
    persistCart(cartItems);
    setCart(cartItems);
  } catch (error) {
    const emptyCart = { length: 0, items: {} };
    persistCart(emptyCart);
    setCart(emptyCart);
    console.log(error);
  }
};

export const decreaseQuantity = (id, cart, setCart, option) => {
  try {
    let cartItems = structuredClone(cart);
    --cartItems.length;

    if (option) {
      if (cart.items[id].quantity < 2) {
        delete cartItems.items[id];
      } else {
        --cartItems.items[id].quantity;
      }

      if (cart.items[id].options[option] < 2) {
        delete cartItems.items[id].options[option];
      } else {
        --cartItems.items[id].options[option];
      }
      persistCart(cartItems);
      setCart(cartItems);
    } else {
      if (cart.items[id].quantity < 2) {
        delete cartItems.items[id];
      } else {
        --cartItems.items[id].quantity;
      }
      persistCart(cartItems);
      setCart(cartItems);
    }
  } catch (error) {
    const emptyCart = { length: 0, items: {} };
    persistCart(emptyCart);
    setCart(emptyCart);
    console.log(error);
  }
};

export const handleAddItemToCart = (id, setCart, setOpenCartAlert, qount = 1, cartItems) => {
  try {
    cartItems.length = cartItems.length + qount;
    cartItems.items[id] = { quantity: qount };

    persistCart(cartItems);
    setCart(cartItems);

    setOpenCartAlert(null);
  } catch (error) {
    const emptyCart = { length: 0, items: {} };
    setOpenCartAlert(null);
    persistCart(emptyCart);
    setCart(emptyCart);
    console.log(error);
  }
};

export const clearCart = (setCart) => {
  const emptyCart = { length: 0, items: {} };
  persistCart(emptyCart);
  setCart(emptyCart);
};
