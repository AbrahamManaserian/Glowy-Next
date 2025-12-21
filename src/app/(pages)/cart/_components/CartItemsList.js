import { Box, Typography } from '@mui/material';
import DetailedCartItem from './DetailedCartItem';

export default function CartItemsList({
  cart,
  cartDetails,
  setCart,
  subtotal,
  selectedItems,
  toggleItemSelection,
}) {
  return (
    <>
      {Object.keys(cart.items).map((id, index) => {
        return (
          <Box key={index}>
            <DetailedCartItem
              item={cart.items[id]}
              id={id}
              productDetails={cartDetails ? cartDetails[id] : null}
              cart={cart}
              setCart={setCart}
              discountRate={subtotal >= 20000 ? 0.2 : 0}
              isSelected={selectedItems.includes(id)}
              toggleSelection={() => toggleItemSelection(id)}
            />
            {index === 0 && subtotal < 20000 && (
              <Box
                sx={{
                  mb: '20px',
                  mt: '10px',
                  p: '12px',
                  bgcolor: '#fff7ed',
                  borderRadius: '8px',
                  border: '1px dashed #e65100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '14px', color: '#e65100', fontWeight: 600 }}>
                  🔥 Add items worth ֏{(20000 - subtotal).toLocaleString()} more to get 20% discount!
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
}
