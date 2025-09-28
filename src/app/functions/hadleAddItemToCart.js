export const handleAddItemToCart = (id, setCart, setOpenCartAlert) => {
  try {
    let cartItems = JSON.parse(localStorage.getItem('cart'));
    if (Object.keys(cartItems.items).includes(id)) {
      cartItems.items[id].quantity = ++cartItems.items[id].quantity;
      cartItems.length = cartItems.length + 1;
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    } else {
      cartItems.length = cartItems.length + 1;
      cartItems.items[id] = { quantity: 1 };
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setCart(cartItems);
    }
    setOpenCartAlert(null);
  } catch (error) {
    localStorage.setItem('cart', JSON.stringify({ length: 0, items: {} }));
    setOpenCartAlert(null);
    setCart({ length: 0, items: {} });
    console.log(error);
  }
};
