'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import {
  Box,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  Switch,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RedeemIcon from '@mui/icons-material/Redeem';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { clearCart } from '../functions/addDeleteIncDecreaseCart';
import CartItemsList from './CartItemsList';
import CheckoutForm from './CheckoutForm';
import { db } from '@/firebase';
import { runTransaction, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

export default function CartPageUi() {
  const t = useTranslations('CartPage');
  const { cart, setCart, cartDetails, user, setOrders, userData, setUserData, initializeData } =
    useGlobalContext();
  const [cartState, setCartState] = useState({
    shippingMethod: 'free',
    paymentMethod: 'cash',
    fullName: '',
    phoneNumber: '',
    address: '',
    email: '',
    note: '',
    saveUserInfo: false,
  });
  const [applyBonus, setApplyBonus] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (userData) {
      setCartState((prev) => ({
        ...prev,
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        email: user?.email || '',
      }));
    }
  }, [userData]);

  useEffect(() => {
    setApplyBonus(false);
  }, [user, userData]);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const redirectUrl =
    searchParams.get('redirect') ||
    (pathname.startsWith('/auth')
      ? '/'
      : pathname + (searchParams.toString() ? '?' + searchParams.toString() : ''));
  const [selectedItems, setSelectedItems] = useState([]);
  const isInitialized = useRef(false);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (cart?.items && !isInitialized.current) {
      setSelectedItems(Object.keys(cart.items));
      if (Object.keys(cart.items).length > 0) {
        isInitialized.current = true;
      }
    }
  }, [cart]);

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCartState((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
  };

  const handleInputBlur = (name, value) => {
    setCartState((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [searchParams]);

  // Calculate totals
  const totalSelectedQuantity = Object.keys(cart.items).reduce((acc, id) => {
    if (!selectedItems.includes(id)) return acc;
    const item = cart.items[id];
    return acc + (item.quantity ?? 1);
  }, 0);

  const subtotal = Object.keys(cart.items).reduce((acc, id) => {
    if (!selectedItems.includes(id)) return acc;
    const item = cart.items[id];
    const details = cartDetails ? cartDetails[id] : null;
    const price = details?.price ?? details?.amount ?? item.price ?? 0;
    const quantity = item.quantity ?? 1;
    return acc + price * quantity;
  }, 0);

  const savedFromOriginalPrice = Object.keys(cart.items).reduce((acc, id) => {
    if (!selectedItems.includes(id)) return acc;
    const item = cart.items[id];
    const details = cartDetails ? cartDetails[id] : null;
    const price = details?.price ?? details?.amount ?? item.price ?? 0;
    const previousPrice = details?.previousPrice ?? 0;
    const quantity = item.quantity ?? 1;

    if (previousPrice > price) {
      return acc + (previousPrice - price) * quantity;
    }
    return acc;
  }, 0);

  useEffect(() => {
    const isFreeAvailable = subtotal >= 5000;
    if (isFreeAvailable) {
      if (cartState.shippingMethod === 'standart') {
        setCartState((prev) => ({ ...prev, shippingMethod: 'free' }));
      }
    } else {
      if (cartState.shippingMethod === 'free') {
        setCartState((prev) => ({ ...prev, shippingMethod: 'standart' }));
      }
    }
  }, [subtotal, cartState.shippingMethod]);

  let shippingCost;
  if (cartState.shippingMethod === 'express') {
    shippingCost = 3000;
  } else if (cartState.shippingMethod === 'standart') {
    shippingCost = 1000;
  } else {
    shippingCost = 0;
  }

  const shippingSavings = subtotal >= 5000 && shippingCost === 0 ? 1000 : 0;
  const discount =
    subtotal >= 20000
      ? user
        ? userData?.firstShopp
          ? subtotal * 0.05
          : subtotal * 0.1
        : subtotal * 0.1
      : 0;
  const firstShopDiscount = user && userData?.firstShopp ? subtotal * 0.2 : 0;
  const totalDiscount = discount + firstShopDiscount;
  const bonus = user && userData ? Math.floor((userData.totalSpent - (userData.bonusUsed || 0)) * 0.03) : 0;
  const appliedBonus = applyBonus ? Math.min(bonus, subtotal + shippingCost - totalDiscount) : 0;
  const total = subtotal + shippingCost - totalDiscount - appliedBonus;
  const totalSaved = savedFromOriginalPrice + totalDiscount + shippingSavings + appliedBonus;

  const handleCreateOrder = async () => {
    if (!cartState.fullName || !cartState.phoneNumber || !cartState.address) {
      setSnackbar({
        open: true,
        message: t('fillRequiredFields'),
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const newOrderNumber = await runTransaction(db, async (transaction) => {
        const projectDetailsRef = doc(db, 'details', 'projectDetails');
        const projectDetailsDoc = await transaction.get(projectDetailsRef);

        if (!projectDetailsDoc.exists()) {
          throw 'Document details/projectDetails does not exist!';
        }

        const lastOrderNumber = projectDetailsDoc.data().lastOrderNumber || 0;
        const newOrderNumber = lastOrderNumber + 1;
        const formattedOrderNumber = newOrderNumber.toString().padStart(7, '0');

        transaction.update(projectDetailsRef, { lastOrderNumber: newOrderNumber });

        const orderRef = doc(db, 'orders', formattedOrderNumber);

        const orderItems = Object.keys(cart.items)
          .filter((id) => selectedItems.includes(id))
          .map((id) => {
            const item = cart.items[id];
            const details = cartDetails ? cartDetails[id] : {};
            const { options, ...restItem } = item;
            const flattenedOptions = options ? { ...options } : {};

            // Sanitize restItem and flattenedOptions to remove undefined values
            const cleanRestItem = Object.fromEntries(
              Object.entries(restItem).filter(([_, v]) => v !== undefined)
            );
            const cleanOptions = Object.fromEntries(
              Object.entries(flattenedOptions).filter(([_, v]) => v !== undefined)
            );

            return {
              id,
              ...cleanRestItem,
              ...cleanOptions,
              price: details.price || item.price || 0,
              name: details.name || item.name || '',
              image: details.images?.[0] || item.image || '',
            };
          });

        const newOrder = {
          orderNumber: formattedOrderNumber,
          status: 'pending',
          createdAt: new Date(),
          userId: user?.uid || null,
          customer: {
            fullName: cartState.fullName || '',
            phoneNumber: cartState.phoneNumber || '',
            address: cartState.address || '',
            email: cartState.email || '',
            note: cartState.note || '',
          },
          items: orderItems,
          financials: {
            subtotal: subtotal || 0,
            shippingCost: shippingCost || 0,
            extraDiscount: discount || 0,
            firstShopDiscount: firstShopDiscount || 0,
            bonusApplied: appliedBonus,
            total: total || 0,
            savedFromOriginalPrice: savedFromOriginalPrice || 0,
            shippingSavings: shippingSavings || 0,
            totalSaved: totalSaved || 0,
          },
          paymentMethod: cartState.paymentMethod || 'cash',
          shippingMethod: cartState.shippingMethod || 'standart',
        };

        const firestoreOrder = { ...newOrder, createdAt: serverTimestamp() };

        transaction.set(orderRef, firestoreOrder);
        setOrders((prev) => [{ id: formattedOrderNumber, ...newOrder }, ...prev]);

        return formattedOrderNumber;
      });

      // Update user data based on checkbox and existing profile fields
      if (user) {
        const shouldUpdate = cartState.saveUserInfo || (!userData?.address && !userData?.phoneNumber);
        if (shouldUpdate) {
          const userRef = doc(db, 'users', user.uid);
          const updates = {};
          if (cartState.address) updates.address = cartState.address;
          if (cartState.phoneNumber) updates.phoneNumber = cartState.phoneNumber;
          if (Object.keys(updates).length > 0) {
            try {
              await updateDoc(userRef, updates);
              setUserData((prev) => ({ ...prev, ...updates }));
            } catch (error) {
              console.error('Failed to update user data:', error);
            }
          }
        }
        // Update firstShopp to false after first order
        if (userData?.firstShopp) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { firstShopp: false });
            setUserData((prev) => ({ ...prev, firstShopp: false }));
          } catch (error) {
            console.error('Failed to update firstShopp:', error);
          }
        }
        // Update bonusUsed if bonus applied
        if (applyBonus && appliedBonus > 0) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const newBonusUsed = (userData.bonusUsed || 0) + appliedBonus / 0.03;
            await updateDoc(userRef, { bonusUsed: newBonusUsed });
            setUserData((prev) => ({ ...prev, bonusUsed: newBonusUsed }));
          } catch (error) {
            console.error('Failed to update bonusUsed:', error);
          }
        }
      }

      // Save order ID in localStorage for unsigned users
      if (!user) {
        try {
          const key = 'guestOrderIds';
          const existing = localStorage.getItem(key);
          let arr = [];
          if (existing) {
            arr = JSON.parse(existing);
            if (!Array.isArray(arr)) arr = [];
          }
          if (!arr.includes(newOrderNumber)) {
            arr.push(newOrderNumber);
            localStorage.setItem(key, JSON.stringify(arr));
          }
        } catch (err) {
          // Ignore localStorage errors
          console.error('Failed to update guestOrderIds in localStorage', err);
        }
      }

      // Send Notification
      try {
        await fetch('/api/admin/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrderNumber,
            customerName: cartState.fullName,
            total: total,
            phoneNumber: cartState.phoneNumber,
          }),
        });
      } catch (notifyError) {
        console.error('Notification failed:', notifyError);
      }

      clearCart(setCart);
      setOrderSuccess(newOrderNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Transaction failed: ', e);
      setSnackbar({
        open: true,
        message: t('orderFailed') + e,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
          {t('orderSuccessTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 4, fontSize: '18px' }}>
          {t('orderSuccessMessage')} <strong>#{orderSuccess}</strong>.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/shop">
            <Button variant="contained" sx={{ bgcolor: '#2B3445', textTransform: 'none' }}>
              {t('continueShopping')}
            </Button>
          </Link>
          <Link href="/user?tab=orders">
            <Button
              variant="outlined"
              sx={{ color: '#2B3445', borderColor: '#2B3445', textTransform: 'none' }}
            >
              {t('viewOrders')}
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }

  if (!cart || cart.length === 0 || Object.keys(cart.items).length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: '100px' }}>
        <Typography variant="h5">{t('emptyCart')}</Typography>
        <Link href="/shop">
          <Button variant="contained" sx={{ mt: 2, bgcolor: '#2B3445' }}>
            {t('goShopping')}
          </Button>
        </Link>
      </Box>
    );
  }

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
      {' '}
      {!params.has('checkout') && !user && (
        <Box
          sx={{
            width: '100%',
            mb: '40px',
            p: '16px',
            bgcolor: 'white',
            borderRadius: '12px',
            border: '1px solid #e65100',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Link
            href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`}
            style={{ textDecoration: 'none' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: '#e65100',
                  fontWeight: 500,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {t('signInDiscount')}
              </Typography>
              <ArrowForwardIcon sx={{ ml: 1, fontSize: '18px', color: '#e65100' }} />
            </Box>
          </Link>
        </Box>
      )}{' '}
      <Box sx={{ width: '100%', mb: '40px' }}>
        <Stepper
          activeStep={!params.has('checkout') ? 0 : 1}
          alternativeLabel
          sx={{
            '& .MuiStepIcon-root.Mui-active': { color: '#e65100' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#e65100' },
          }}
        >
          {[t('stepper.shoppingCart'), t('stepper.checkoutDetails'), t('stepper.completeOrder')].map(
            (label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          )}
        </Stepper>
      </Box>
      {bonus > 0 && (
        <Box
          sx={{
            width: '100%',
            mb: '20px',
            p: '20px',
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            color: 'white',
          }}
        >
          <RedeemIcon sx={{ fontSize: '28px' }} />
          <Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Bonus Available!
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
              }}
            >
              You have ֏{bonus.toLocaleString()} to use on this order.
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: '20px',
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '26px', sm: '32px' },
            fontWeight: 800,
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
          }}
        >
          {!params.has('checkout') ? `Shopping Cart (${cart.length})` : 'Checkout'}
        </Typography>
        {!params.has('checkout') && (
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => clearCart(setCart)}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Clear Cart
          </Button>
        )}
      </Box>
      {!params.has('checkout') ? (
        <Grid
          sx={{ overflow: 'hidden', boxSizing: 'border-box', mt: '20px' }}
          size={{ xs: 12, sm: 8 }}
          direction={'column'}
        >
          <CartItemsList
            cart={cart}
            cartDetails={cartDetails}
            setCart={setCart}
            subtotal={subtotal}
            selectedItems={selectedItems}
            toggleItemSelection={toggleItemSelection}
            user={user}
            userData={userData}
          />
        </Grid>
      ) : (
        <Grid sx={{ overflow: 'hidden', boxSizing: 'border-box', mt: '40px' }} size={{ xs: 12, sm: 8 }}>
          <CheckoutForm
            cartState={cartState}
            setCartState={setCartState}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            isFreeShippingAvailable={subtotal >= 5000}
            userData={userData}
          />
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
          Summary - ({totalSelectedQuantity}) items
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
            ֏{subtotal.toLocaleString()}
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
            {shippingCost === 0 ? 'Free' : `֏${shippingCost.toLocaleString()}`}
          </Typography>
        </Box>
        {shippingCost > 0 && subtotal < 5000 && (
          <Box sx={{ mb: '15px' }}>
            <Typography sx={{ fontSize: '13px', color: '#e65100', fontWeight: 500 }}>
              Add items worth ֏{(5000 - subtotal).toLocaleString()} to get free shipping
            </Typography>
          </Box>
        )}
        {firstShopDiscount > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
            <Typography
              sx={{
                color: '#e65100',
                fontSize: '15px',
                fontWeight: 300,
              }}
            >
              First Shop Discount (20%)
            </Typography>
            <Typography
              sx={{
                color: '#e65100',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              -֏{firstShopDiscount.toLocaleString()}
            </Typography>
          </Box>
        ) : null}
        {discount > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
            <Typography
              sx={{
                color: '#e65100',
                fontSize: '15px',
                fontWeight: 300,
              }}
            >
              Extra Discount ({user ? (userData?.firstShopp ? '5%' : '10%') : '10%'})
            </Typography>
            <Typography
              sx={{
                color: '#e65100',
                fontSize: '15px',
                fontWeight: 500,
              }}
            >
              -֏{discount.toLocaleString()}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mb: '15px' }}>
            <Typography sx={{ fontSize: '13px', color: '#e65100', fontWeight: 500 }}>
              Add items worth ֏{(20000 - subtotal).toLocaleString()} to get{' '}
              {user ? (userData?.firstShopp ? '5%' : '10%') : '10%'} extra discount
            </Typography>
          </Box>
        )}
        {bonus > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '15px' }}>
            <Typography
              sx={{
                color: '#e65100',
                fontSize: '15px',
                fontWeight: 300,
              }}
            >
              Use bonus (֏{bonus.toLocaleString()})
            </Typography>
            <Switch
              checked={applyBonus}
              onChange={(e) => setApplyBonus(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4caf50',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#4caf50',
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#ccc',
                },
              }}
            />
          </Box>
        )}
        {totalSaved > 0 && (
          <Box
            sx={{
              mb: '15px',
              p: '12px',
              bgcolor: '#fff7ed',
              borderRadius: '8px',
              border: '1px dashed #e65100',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '5px' }}>
              <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 600 }}>
                Total Savings
              </Typography>
              <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 700 }}>
                ֏{totalSaved.toLocaleString()}
              </Typography>
            </Box>
            {savedFromOriginalPrice > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • Product markdowns
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{savedFromOriginalPrice.toLocaleString()}
                </Typography>
              </Box>
            )}
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • Extra discount
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{discount.toLocaleString()}
                </Typography>
              </Box>
            )}
            {firstShopDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • First shop discount
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{firstShopDiscount.toLocaleString()}
                </Typography>
              </Box>
            )}
            {shippingSavings > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • Free shipping
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{shippingSavings.toLocaleString()}
                </Typography>
              </Box>
            )}
            {applyBonus && appliedBonus > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • Bonus applied
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{appliedBonus.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: '25px',
            borderTop: 'solid 1px #c5c7cc8a',
            pt: '15px',
          }}
        >
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Order total
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            ֏{total.toLocaleString()}
          </Typography>
        </Box>
        {!params.has('checkout') ? (
          <>
            {subtotal > 0 ? (
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

                    mb: '10px',
                  }}
                >
                  Order now
                </Button>
              </Link>
            ) : (
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

                  mb: '10px',
                }}
                disabled
              >
                Order now
              </Button>
            )}
            <Link href="/shop">
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'capitalize',
                  width: '100%',
                  p: '10px 35px',
                  borderColor: '#2B3445',
                  color: '#2B3445',
                  borderRadius: '8px',
                  fontWeight: 400,
                  textWrap: 'nowrap',
                  mb: '10px',
                  ':hover': {
                    borderColor: '#2B3445',
                    bgcolor: 'rgba(43, 52, 69, 0.04)',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={handleCreateOrder}
              disabled={loading}
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
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : cartState.paymentMethod === 'cash' ? (
                'Submit order'
              ) : (
                'Go to payment'
              )}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
