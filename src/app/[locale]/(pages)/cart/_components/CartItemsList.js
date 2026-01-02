import { Box, Typography } from '@mui/material';
import DetailedCartItem from './DetailedCartItem';
import { useTranslations } from 'next-intl';

export default function CartItemsList({
  cart,
  cartDetails,
  setCart,
  subtotal,
  selectedItems,
  toggleItemSelection,
  user,
  userData,
}) {
  const t = useTranslations('CartPage');
  const firstShopRate = userData?.firstShopp ? 0.2 : 0;
  const extraRate = subtotal >= 20000 ? (user ? (userData?.firstShopp ? 0.05 : 0.1) : 0.1) : 0;
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
              firstShopRate={firstShopRate}
              extraRate={extraRate}
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
                  {t('addMoreForDiscount', {
                    amount: (20000 - subtotal).toLocaleString(),
                    percent: user ? (userData?.firstShopp ? '5%' : '10%') : '10%',
                  })}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
}
