export const increaseQuantity = (id, cart, setCart) => {
  console.log(cart.items[id]);
  try {
    let cartItems = {
      ...cart,
      length: cart.length + 1,
      items: { ...cart.items, [id]: { quantity: cart.items[id].quantity + 1 } },
    };
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCart(cartItems);
  } catch (error) {
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));

    setCart({ length: 0, items: {} });
    console.log(error);
  }
};

export const deleteItem = (id, cart, setCart) => {
  try {
    let cartItems = { ...cart, length: cart.length - cart.items[id].quantity };
    delete cartItems.items[id];
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCart(cartItems);
  } catch (error) {
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));

    setCart({ length: 0, items: {} });
    console.log(error);
  }
};

export const decreaseQuantity = (id, cart, setCart) => {
  try {
    if (cart.items[id].quantity < 2) {
      let cartItems = { ...cart, length: cart.length - 1 };
      delete cartItems.items[id];
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    } else {
      let cartItems = {
        ...cart,
        length: cart.length - 1,
        items: { ...cart.items, [id]: { quantity: cart.items[id].quantity - 1 } },
      };
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    }
  } catch (error) {
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));

    setCart({ length: 0, items: {} });
    console.log(error);
  }
};

export const handleAddItemToCart = (id, setCart, setOpenCartAlert, qount = 1, cartItems) => {
  try {
    cartItems.length = cartItems.length + qount;
    cartItems.items[id] = { quantity: qount };
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCart(cartItems);

    setOpenCartAlert(null);
  } catch (error) {
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
    setOpenCartAlert(null);
    setCart({ length: 0, items: {} });
    console.log(error);
  }
};
