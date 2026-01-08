'use client';

import styled from '@emotion/styled';
import { Badge, Box, Button, Drawer, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { ShoppingBasketIcon } from '@/_components/icons';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
// import { images } from '@/app/fragrance1/[product]/page';
import { useGlobalContext } from '@/app/GlobalContext';
import CartList from './CartList';

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -1,
    top: 0,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: '#f44336',
    color: 'white',
    height: '20px',
    width: '20px',
    borderRadius: '13px',
  },
}));

export default function CartDrawer() {
  const t = useTranslations('CartPage');
  const { cart, setCart, cartDetails } = useGlobalContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  useEffect(() => {
    toggleDrawer(false);
  }, [searchParams, pathname]);


  return (
    <div>
      <div
        style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        onClick={() => toggleDrawer(true)}
      >
        <StyledBadge badgeContent={cart.length || 0}>
          <ShoppingBasketIcon />
        </StyledBadge>
      </div>
      <Drawer
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 'auto' } } }}
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        anchor="right"
      >
        <Box
          sx={{ width: { xs: '100%', sm: '380px' }, height: '100vh' }}
          //   role="presentation"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: { xs: '16px', sm: '24px' },
              borderBottom: '0.5px solid #dde2e5ff',
              position: 'sticky',
              top: 0,
              bgcolor: 'white',
            }}
          >
            <Typography sx={{ fontSize: '15px' }}>
              {t('yourCart')} ({cart.length || 0})
            </Typography>
            <CloseIcon sx={{ color: '#8a8c8dff', cursor: 'pointer' }} onClick={() => toggleDrawer(false)} />
          </Box>
          <div>
            {/* Render cart items via CartList; empty state handled below */}
            <CartList
              cartDetails={cartDetails}
              cart={cart}
              setCart={setCart}
              padding={{ xs: '0 16px', sm: '0 24px' }}
            />

            {!cart || cart.length === 0 || Object.keys(cart.items).length === 0 ? (
              <Box sx={{ textAlign: 'center', p: '40px 24px' }}>
                <ShoppingBasketIcon sx={{ fontSize: 60, color: '#d1d1d1', mb: 2 }} />
                <Typography sx={{ fontSize: '16px', mb: 1 }}>{t('cartEmpty')}</Typography>
                <Typography sx={{ color: '#7b7b7b', fontSize: '14px', mb: 2 }}>
                  {t('cartEmptyDesc')}
                </Typography>

                <Link href="/shop">
                  <Button variant="contained" sx={{ mt: 2, bgcolor: '#2B3445' }}>
                    {t('goShopping')}
                  </Button>
                </Link>
              </Box>
            ) : null}

            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                width: '100%',
                padding: { xs: '15px', sm: '20px' },
                boxSizing: 'border-box',
                bgcolor: 'white',
              }}
            >
              {cart.length > 0 && (
                <Link scroll={true} href="/cart?checkout">
                  <Button
                    onClick={() => toggleDrawer(false)}
                    variant="contained"
                    sx={{
                      textTransform: 'capitalize',
                      width: '100%',
                      p: '10px 35px',
                      bgcolor: '#2B3445',
                      borderRadius: '8px',
                      fontWeight: 400,
                      textWrap: 'nowrap',
                      boxShadow: '0px 3px 1px -2px rgba(246, 243, 243, 0.2)',
                      ':hover': {
                        boxShadow: '0px 3px 1px -2px rgba(246, 243, 243, 0.2)',
                      },
                      mb: '10px',
                    }}
                  >
                    {t('orderNow')}
                  </Button>
                </Link>
              )}
              <Link scroll={true} href="/cart">
                <Button
                  onClick={() => toggleDrawer(false)}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    textTransform: 'capitalize',

                    p: '10px 35px',
                    bgcolor: '#ffffffff',
                    borderRadius: '8px',
                    fontWeight: 400,
                    color: '#2B3445',
                    ':hover': {
                      //   border: 'solid 0.5px rgba(17, 17, 17, 0.96)',
                      bgcolor: '#f8f8f8ff',
                    },
                    border: 'solid 0.5px rgba(44, 43, 43, 0.79)',
                    textWrap: 'nowrap',
                  }}
                >
                  {t('viewCart')}
                </Button>
              </Link>
            </Box>
          </div>
        </Box>
      </Drawer>
    </div>
  );
}
