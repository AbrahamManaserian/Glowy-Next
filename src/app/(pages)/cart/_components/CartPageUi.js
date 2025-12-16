'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import { Box, Button, Grid, InputBase, Typography } from '@mui/material';
import { images } from '@/_components/PopularProducts';
import Link from 'next/link';
import DetailedCartItem from './DetailedCartItem';
import { useSearchParams } from 'next/navigation';
import DoneIcon from '@mui/icons-material/Done';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import { useEffect, useRef, useState } from 'react';

const inputTextGroupObj = {
  fullName: 'Full name',
  phoneNumber: 'Phone number',
  address: 'Shipping address',
  email: 'Email address',
  note: 'Notes',
};

const shippingMethodObj = {
  free: {
    type: 'Free',
    deliveryDuration: '5-7 days delivery',
    icon: <DirectionsBikeIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '$0',
  },
  standart: {
    type: 'Standart',
    deliveryDuration: '3-5 days delivery',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '$10',
  },
  express: {
    type: 'Express',
    deliveryDuration: '1 day delivery',
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '$15',
  },
};

const ShippingMethod = ({ checked, icon, type, duration, price }) => {
  return (
    <Box
      sx={{
        borderRadius: '10px',
        display: 'flex',
        border: 'solid 0.5px #c5c7cc91',
        boxSizing: 'border-box',
        p: '15px',
        m: 0,
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: checked ? '#e65100' : 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: !checked ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
          mr: '15px',
        }}
      >
        <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex' }}>
          {icon}
          <Typography>{type}</Typography>
        </Box>
        <Typography>{price}</Typography>
        <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
          {duration}
        </Typography>
      </Box>
    </Box>
  );
};

export default function CartPageUi() {
  const [cartState, setCartState] = useState({
    shippingMethod: 'free',
    paymentMethod: 'cash',
    fullName: '',
    phoneNumber: '',
    address: '',
    email: '',
    note: '',
  });
  const { cart, setCart, cartDetails } = useGlobalContext();
  console.log(cartDetails);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleInputChange = (event) => {
    if (!event.nativeEvent.data && event.nativeEvent.data !== null) {
      setCartState({ ...cartState, [event.target.name]: event.target.value });
    }
  };

  const handleInputBlur = (name, value) => {
    setCartState({ ...cartState, [name]: value });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [searchParams]);

  return (
    <Grid
      sx={{
        width: '100%',
        maxWidth: '1150px',
        margin: '0 auto',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        mt: '40px',
      }}
      container
      columnSpacing={5}
    >
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '28px' }, width: '100%' }}
        fontWeight={700}
        color="#2B3445"
      >
        {!params.has('checkout') ? `Cart (${cart.length})` : 'Checkout'}
      </Typography>
      {!params.has('checkout') ? (
        <Grid
          sx={{ overflow: 'hidden', boxSizing: 'border-box', mt: '20px' }}
          size={{ xs: 12, sm: 8 }}
          direction={'column'}
        >
          {Object.keys(cart.items).map((id, index) => {
            return <DetailedCartItem key={index} item={cart.items[id]} cart={cart} setCart={setCart} />;
          })}
        </Grid>
      ) : (
        <Grid sx={{ overflow: 'hidden', boxSizing: 'border-box', mt: '40px' }} size={{ xs: 12, sm: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: '30px' }}>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                bgcolor: '#e65100',
                width: '30px',
                height: '30px',
                color: 'white',
                mr: '15px',
              }}
            >
              1
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Personal details</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.keys(inputTextGroupObj).map((key, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: { xs: '100%', sm: 'calc(50% - 8px)' },
                    mr: { xs: 0, sm: index % 2 !== 0 ? 0 : '8px' },
                    ml: { xs: 0, sm: index % 2 == 0 ? 0 : '8px' },
                    mb: '20px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: '3px', ml: '3px', fontSize: '13px', fontWeight: 500, color: '#333' }}
                  >
                    {inputTextGroupObj[key]}
                  </Typography>
                  <InputBase
                    defaultValue={cartState[key]}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    type={key === 'phoneNumber' ? 'number' : ''}
                    onKeyDown={(e) => {
                      if (key === 'phoneNumber' && ['e', 'E', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    multiline={key === 'note' ? true : false}
                    name={key}
                    onBlur={(e) => handleInputBlur(e.target.name, e.target.value, e)}
                    sx={{
                      minHeight: '50px',
                      fontSize: '14px',

                      bgcolor: '#d2cccc17',
                      borderRadius: '8px',
                      p: '4px 20px',
                      border: 'solid 1px #ffffffff',
                      '&.Mui-focused': {
                        border: 'solid 1px #030303dd',
                      },
                      flexGrow: 1,
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                        {
                          WebkitAppearance: 'none', // Chrome, Safari, Edge
                        },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '35px', mb: '15px' }}>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                bgcolor: '#e65100',
                width: '30px',
                height: '30px',
                color: 'white',
                mr: '15px',
              }}
            >
              2
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Shipping method</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.keys(shippingMethodObj).map((key, index) => {
              return (
                <Box
                  key={index}
                  onClick={() => setCartState({ ...cartState, shippingMethod: key })}
                  sx={{
                    borderRadius: '11px',
                    width: { xs: '100%', sm: 'calc(50% - 5px)' },
                    my: '10px',
                    p: 0,
                    cursor: 'pointer',
                    border:
                      key === cartState.shippingMethod ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
                    boxSizing: 'border-box',
                    mr: { xs: 0, sm: index % 2 !== 0 ? 0 : '5px' },
                    ml: { xs: 0, sm: index % 2 == 0 ? 0 : '5px' },
                    transition: ' all 0.2s ease',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <ShippingMethod
                    icon={shippingMethodObj[key].icon}
                    type={shippingMethodObj[key].type}
                    duration={shippingMethodObj[key].deliveryDuration}
                    price={shippingMethodObj[key].price}
                    checked={key === cartState.shippingMethod}
                  />
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: '35px', mb: '15px' }}>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                bgcolor: '#e65100',
                width: '30px',
                height: '30px',
                color: 'white',
                mr: '15px',
              }}
            >
              3
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Payment method</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box
              onClick={() => setCartState({ ...cartState, paymentMethod: 'card' })}
              sx={{
                borderRadius: '11px',
                width: { xs: '100%', sm: 'calc(50% - 5px)' },
                my: '10px',
                p: 0,
                cursor: 'pointer',
                border:
                  cartState.paymentMethod === 'card' ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
                boxSizing: 'border-box',
                mr: { xs: 0, sm: '5px' },

                transition: ' all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Box
                sx={{
                  borderRadius: '10px',
                  display: 'flex',
                  border: 'solid 0.5px #c5c7cc91',
                  boxSizing: 'border-box',
                  p: '15px',
                  m: 0,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: cartState.paymentMethod === 'card' ? '#e65100' : 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: cartState.paymentMethod !== 'card' ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
                    mr: '15px',
                  }}
                >
                  <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
                  <Typography>With bank card</Typography>
                  <CreditCardIcon sx={{ mr: '8px' }} />
                  <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
                    Secure checkout
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => setCartState({ ...cartState, paymentMethod: 'cash' })}
              sx={{
                borderRadius: '11px',
                width: { xs: '100%', sm: 'calc(50% - 5px)' },
                my: '10px',
                p: 0,
                cursor: 'pointer',
                border:
                  cartState.paymentMethod === 'cash' ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
                boxSizing: 'border-box',
                ml: { xs: 0, sm: '5px' },

                transition: ' all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Box
                sx={{
                  borderRadius: '10px',
                  display: 'flex',
                  border: 'solid 0.5px #c5c7cc91',
                  boxSizing: 'border-box',
                  p: '15px',
                  m: 0,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: cartState.paymentMethod === 'cash' ? '#e65100' : 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: cartState.paymentMethod !== 'cash' ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
                    mr: '15px',
                  }}
                >
                  <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
                  <Typography>Pay by cash</Typography>
                  <LocalAtmRoundedIcon sx={{ mr: '8px' }} />
                  <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
                    Secure checkout
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      )}
      <Grid
        size={{ xs: 12, sm: 4 }}
        sx={{
          border: 'solid 1px #c5c7cc8a',
          borderRadius: '15px',
          p: '25px',
          position: 'sticky',
          top: '80px',
          mt: '20px',
        }}
      >
        <Typography
          sx={{
            color: '#263045fb',
            fontSize: '18px',
            fontWeight: 500,
            mb: '20px',
          }}
        >
          Summary - ({cart.length}) items
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 300,
            }}
          >
            Subtotal
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            $89.90
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 300,
            }}
          >
            Shipping
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            $0.00
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pb: '20px',
            borderBottom: '1px dashed #dde2e5ff',
          }}
        >
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 300,
            }}
          >
            Discount (15%)
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            $12.60
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: '15px' }}>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            $212.00
          </Typography>
        </Box>
        {!params.has('checkout') ? (
          <Link scroll={true} href={`/cart?checkout`}>
            <Button
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
              Checkout
            </Button>
          </Link>
        ) : (
          <>
            <Button
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
              Go to payment
            </Button>
            <Link scroll={true} href={`/cart`}>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'capitalize',
                  width: '100%',
                  p: '10px 35px',
                  bgcolor: '#e65100',
                  // color: '#2B3445',
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
                Back to cart
              </Button>
            </Link>
          </>
        )}
      </Grid>
    </Grid>
  );
}
