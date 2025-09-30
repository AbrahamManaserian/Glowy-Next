'use client';

import styled from '@emotion/styled';
import { Badge, Box, Button, Drawer, Grow, IconButton, Menu, Paper, Popper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBasketIcon } from '@/components/icons';
import { usePathname, useSearchParams } from 'next/navigation';
import { images } from '@/app/fragrance/[product]/page';
import { useGlobalContext } from '@/app/GlobalContext';

// const images = [
//   '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
//   '/images/06lT4BbLdxYjqF7EjvbnSXT9ILosjlIZh539zWgD.webp',
//   '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
//   '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
// ];

const StyledBadge = styled(Badge)(({ theme }) => ({
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
  const { cart, setCart, handleClickError } = useGlobalContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  // console.log(cart);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  const increaseQuantity = (id) => {
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

  const deleteItem = (id) => {
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

  const decreaseQuantity = (id) => {
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
            <Typography sx={{ fontSize: '15px' }}>Your Cart ({cart.length || 0})</Typography>
            <CloseIcon sx={{ color: '#8a8c8dff', cursor: 'pointer' }} onClick={() => toggleDrawer(false)} />
          </Box>
          <div style={{}}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {(() => {
                try {
                  return Object.keys(cart.items).map((key, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '140px',
                          borderBottom: '1px dashed #dde2e5ff',
                          overflow: 'hidden',
                          p: { xs: '0 16px', sm: '0 24px' },
                          boxSizing: 'border-box',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            padding: '5px',
                            boxSizing: 'border-box',
                            bgcolor: '#d2cccc30',
                            //   bgcolor: 'red',
                            // m: '10px 15px 10px 25px',
                            borderRadius: '10px',
                            width: '100px',
                            height: '100px',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={images[key]}
                            alt=""
                            width={200}
                            height={200}
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexGrow: 1,
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            height: '100px',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                            ml: '15px',
                          }}
                        >
                          <div>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '240px',
                                color: '#191818f6',
                                fontWeight: 300,
                              }}
                            >
                              Armani Stronger With yuo Absolutely
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '15px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '220px',
                                mt: '2px',
                              }}
                            >
                              $ 230.00
                            </Typography>
                          </div>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'inline-flex',
                                border: 'solid 0.5px #65626263',
                                borderRadius: '10px',
                                justifyContent: 'center',
                                alignContent: 'center',
                                // mr: '15px',
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => decreaseQuantity(key)}
                                aria-label="delete"
                                // sx={{ cursor: quantity < 2 ? 'not-allowed' : 'pointer' }}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography sx={{ bgcolor: '#6562620f', p: '6px 15px', fontSize: '14px' }}>
                                {cart.items[key].quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => increaseQuantity(key)}
                                aria-label="delete"
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>

                            <DeleteOutlinedIcon
                              onClick={() => deleteItem(key)}
                              sx={{ fontSize: '28px', color: '#ca4d4df6', cursor: 'pointer' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    );
                  });
                } catch (error) {
                  handleClickError();
                  console.log(error);
                }
              })()}
            </Box>

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
              <Link scroll={true} href="/cart">
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
                  Procced To Checkout
                </Button>
              </Link>
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
                  View Cart
                </Button>
              </Link>
            </Box>
          </div>
        </Box>
      </Drawer>
    </div>
  );
}
