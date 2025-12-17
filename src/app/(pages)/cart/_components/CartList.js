'use client';

import { Box } from '@mui/material';
import CartItemView from './CartItemView';

export default function CartList({ cartDetails, cart, setCart, padding = { xs: '0 16px', sm: '0 24px' } }) {
  if (!cart || !cart.items || Object.keys(cart.items).length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {Object.keys(cart.items).map((key) => (
        <CartItemView
          padding={padding}
          item={cart.items[key]}
          productDetails={cartDetails ? cartDetails[key] : null}
          id={key}
          key={key}
          cart={cart}
          setCart={setCart}
        />
      ))}
    </Box>
  );
}
