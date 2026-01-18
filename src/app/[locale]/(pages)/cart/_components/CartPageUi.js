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
import LoginIcon from '@mui/icons-material/Login';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

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
  console.log(cart);
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
      const allKeys = [];
      Object.keys(cart.items).forEach((id) => {
        const item = cart.items[id];
        if (item.options && Object.keys(item.options).length > 0) {
          Object.keys(item.options).forEach((optKey) => {
            allKeys.push(`${id}-${optKey}`);
          });
        } else {
          allKeys.push(id);
        }
      });
      setSelectedItems(allKeys);
      if (allKeys.length > 0) {
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
    const item = cart.items[id];
    if (item.options && Object.keys(item.options).length > 0) {
      return (
        acc +
        Object.entries(item.options).reduce((sum, [optKey, qty]) => {
          if (!selectedItems.includes(`${id}-${optKey}`)) return sum;
          return sum + qty;
        }, 0)
      );
    }

    if (!selectedItems.includes(id)) return acc;
    return acc + (item.quantity ?? 1);
  }, 0);

  const subtotal = Object.keys(cart.items).reduce((acc, id) => {
    const item = cart.items[id];
    const details = cartDetails ? cartDetails[id] : null;

    if (item.options && Object.keys(item.options).length > 0) {
      return (
        acc +
        Object.entries(item.options).reduce((sum, [optKey, qty]) => {
          if (!selectedItems.includes(`${id}-${optKey}`)) return sum;

          let price = details?.price ?? item.price ?? 0;

          if (details) {
            // Check if matches main item option
            if (details.optionKey && details[details.optionKey] === optKey) {
              price = details.price;
            }
            // Check availableOptions
            else if (details.availableOptions) {
              const matchedOption = details.availableOptions.find((opt) => opt[details.optionKey] === optKey);
              if (matchedOption && matchedOption.price !== undefined) {
                price = matchedOption.price;
              }
            }
          }
          return sum + price * qty;
        }, 0)
      );
    }

    if (!selectedItems.includes(id)) return acc;
    // Fallback for items without options object
    const price = details?.price || item.price || 0;
    const quantity = item.quantity ?? 1;
    return acc + price * quantity;
  }, 0);

  const savedFromOriginalPrice = Object.keys(cart.items).reduce((acc, id) => {
    const item = cart.items[id];
    const details = cartDetails ? cartDetails[id] : null;

    if (item.options && Object.keys(item.options).length > 0) {
      return (
        acc +
        Object.entries(item.options).reduce((sum, [optKey, qty]) => {
          if (!selectedItems.includes(`${id}-${optKey}`)) return sum;

          let price = details?.price ?? item.price ?? 0;
          let previousPrice = details?.previousPrice ?? item.previousPrice ?? 0;

          if (details) {
            if (details.optionKey && details[details.optionKey] === optKey) {
              price = details.price;
              previousPrice = details.previousPrice || 0;
            } else if (details.availableOptions) {
              const matchedOption = details.availableOptions.find((opt) => opt[details.optionKey] === optKey);
              if (matchedOption) {
                if (matchedOption.price !== undefined) price = matchedOption.price;
                if (matchedOption.previousPrice !== undefined) previousPrice = matchedOption.previousPrice;
              }
            }
          }

          if (previousPrice > price) {
            return sum + (previousPrice - price) * qty;
          }
          return sum;
        }, 0)
      );
    }

    if (!selectedItems.includes(id)) return acc;

    const price = details?.price ?? item.price ?? 0;
    const previousPrice = details?.previousPrice ?? item?.previousPrice ?? 0;
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

    const orderItems = [];

    Object.keys(cart.items).forEach((id) => {
      const item = cart.items[id];
      const details = cartDetails ? cartDetails[id] : {};

      if (item.options && Object.keys(item.options).length > 0) {
        Object.entries(item.options).forEach(([optKey, qty]) => {
          if (selectedItems.includes(`${id}-${optKey}`)) {
            let price = details?.price ?? item.price ?? 0;
            let variantImage = details?.images?.[0] || item.img || item.image || '';

            if (details) {
              if (details.optionKey && details[details.optionKey] === optKey) {
                price = details.price;
              } else if (details.availableOptions) {
                const matchedOption = details.availableOptions.find(
                  (opt) => opt[details.optionKey] === optKey
                );
                if (matchedOption) {
                  if (matchedOption.price !== undefined) price = matchedOption.price;
                }
              }
            }

            const { options, quantity, ...restItem } = item; // exclude options and main quantity
            const cleanRestItem = Object.fromEntries(
              Object.entries(restItem).filter(([_, v]) => v !== undefined)
            );

            orderItems.push({
              id,
              ...cleanRestItem,
              name: details.name || item.name || '',
              image: variantImage,
              price,
              quantity: qty,
              selectedOption: optKey,
              selectedOptionKey: details.optionKey || item.optionKey,
            });
          }
        });
      } else {
        if (selectedItems.includes(id)) {
          const { options, ...restItem } = item;
          const cleanRestItem = Object.fromEntries(
            Object.entries(restItem).filter(([_, v]) => v !== undefined)
          );
          orderItems.push({
            id,
            ...cleanRestItem,
            name: details.name || item.name || '',
            image: details.images?.[0] || item.img || item.image || '',
            price: details.price || item.price || 0,
            quantity: item.quantity || 1,
          });
        }
      }
    });

    if (orderItems.length === 0) {
      setSnackbar({
        open: true,
        message: t('emptyCart') || 'Cart is empty',
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
          // px: 2,
          my: 2,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
          {t('orderSuccessTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 2, fontSize: '18px' }}>
          {t('orderSuccessMessage')} <strong>#{orderSuccess}</strong>.
        </Typography>
        {!user && (
          <Typography
            sx={{ color: '#666', mb: 4, fontSize: { xs: '14px', sm: '16px' }, textAlign: 'center' }}
          >
            {t('orderSuccessUnsignedPrefix')}{' '}
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                ml: 1,
                px: 1,
                py: '2px',
                bgcolor: '#fff7ed',
                color: '#e65100',
                fontWeight: 800,
                borderRadius: '6px',
                fontSize: { xs: '13px', sm: '15px' },
              }}
            >
              #{orderSuccess}
            </Box>{' '}
            {t('orderSuccessUnsignedSuffix')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/shop">
            <Button variant="contained" sx={{ bgcolor: '#2B3445', textTransform: 'none', px: '5px' }}>
              {t('continueShopping')}
            </Button>
          </Link>
          <Link href="/user/orders">
            <Button
              variant="outlined"
              sx={{ color: '#2B3445', borderColor: '#2B3445', textTransform: 'none', px: '5px' }}
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
      {bonus > 0 && (
        <Box
          sx={{
            width: '100%',
            // mb: '20px',
            p: '10px',
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
              {t('bonusAvailable')}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 400,
              }}
            >
              {t('bonusUseMessage', { amount: bonus.toLocaleString() })}
            </Typography>
          </Box>
        </Box>
      )}
      {!user && (
        <Box sx={{ width: '100%', mb: { xs: '18px', sm: '28px' } }}>
          <Link
            href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                p: { xs: 1, sm: 2 },
                bgcolor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid rgba(230,81,0,0.06)',
                boxShadow: '0 10px 30px rgba(16,24,40,0.04)',
                cursor: 'pointer',
                transition: 'transform .12s ease, box-shadow .12s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 40px rgba(16,24,40,0.06)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0 }}>
                <Box
                  sx={{
                    width: { xs: 44, sm: 56 },
                    height: { xs: 44, sm: 56 },
                    borderRadius: 2,
                    bgcolor: 'linear-gradient(135deg, #fff8f3, #fff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                >
                  <LoginIcon sx={{ color: '#e65100', fontSize: { xs: 18, sm: 26 } }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: { xs: '15px', sm: '16px' }, fontWeight: 700, color: '#1a1a1a' }}
                  >
                    {t('signInDiscount')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, sm: 0 } }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: '#e65100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
            </Box>
          </Link>
        </Box>
      )}
      <Box sx={{ width: '100%', my: '40px' }}>
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
          {!params.has('checkout') ? t('shoppingCartTitle', { count: cart.length }) : t('checkoutTitle')}
        </Typography>

        {!params.has('checkout') && (
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => clearCart(setCart)}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            {t('clearCart')}
          </Button>
        )}
      </Box>
      {subtotal > 5000 && (
        <Box
          sx={{
            mb: '12px',
            width: '100%',
            p: { xs: '10px', sm: '12px' },
            bgcolor: 'linear-gradient(180deg, rgba(240,249,255,0.95), rgba(250,255,255,0.95))',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            border: '1px solid rgba(25,118,210,0.06)',
            boxShadow: '0 6px 14px rgba(16,24,40,0.03)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box
              sx={{
                width: { xs: 36, sm: 44 },
                height: { xs: 36, sm: 44 },
                borderRadius: '50%',
                bgcolor: '#eef7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                flexShrink: 0,
              }}
            >
              <LocalShippingIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: '#1976d2' }} />
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography sx={{ fontSize: { xs: '14px', sm: '15px' }, color: '#0f3b66', fontWeight: 700 }}>
                {t('freeShippingTitle')}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'rgba(15,59,102,0.85)', fontWeight: 500 }}>
                {t('freeShippingMessage')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: { xs: 1.5, sm: 0 }, alignSelf: { xs: 'center', sm: 'auto' } }}>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                bgcolor: '#e8f4ff',
                color: '#0f4ea8',
                fontWeight: 700,
                fontSize: '13px',
                border: '1px solid rgba(15,78,168,0.06)',
              }}
            >
              {t('freeShippingBadge')}
            </Box>
          </Box>
        </Box>
      )}
      {subtotal > 20000 && (
        <Box
          sx={{
            mb: '18px',
            width: '100%',
            p: { xs: '10px', sm: '14px' },
            bgcolor: 'linear-gradient(180deg, rgba(245,251,245,0.9), rgba(250,255,250,0.9))',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            border: '1px solid rgba(30,120,60,0.06)',
            boxShadow: '0 6px 18px rgba(16,24,40,0.04)',
            transition: 'transform .14s ease, box-shadow .14s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(16,24,40,0.06)' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: '50%',
                bgcolor: '#ecf7ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                flexShrink: 0,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: { xs: 18, sm: 22 }, color: '#2e7d32' }} />
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography sx={{ fontSize: { xs: '14px', sm: '15px' }, color: '#163f2b', fontWeight: 700 }}>
                {t('discountTitle')}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'rgba(22,63,43,0.85)', fontWeight: 500 }}>
                {t('discountMessage', {
                  percent: user ? (userData?.firstShopp ? '5%' : '10%') : '10%',
                })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: { xs: 1.5, sm: 0 }, alignSelf: { xs: 'center', sm: 'auto' } }}>
            <Box
              sx={{
                bgcolor: '#e8f5e8',
                color: '#2e7d32',
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: { xs: '13px', sm: '14px' },
                boxShadow: 'inset 0 -6px 12px rgba(46,125,50,0.02)',
              }}
            >
              10%
            </Box>
          </Box>
        </Box>
      )}
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
          {t('summaryTitle', { count: totalSelectedQuantity })}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '15px' }}>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 300,
            }}
          >
            {t('subtotal')}
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
            {t('shipping')}
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            {shippingCost === 0 ? t('free') : `֏${shippingCost.toLocaleString()}`}
          </Typography>
        </Box>
        {shippingCost > 0 && subtotal < 5000 && (
          <Box sx={{ mb: '15px' }}>
            <Typography sx={{ fontSize: '13px', color: '#e65100', fontWeight: 500 }}>
              {t('addMoreForFreeShipping', { amount: (5000 - subtotal).toLocaleString() })}
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
              {t('firstShopDiscount')}
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
              {t('extraDiscount', {
                percent: user ? (userData?.firstShopp ? '5%' : '10%') : '10%',
              })}
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
              {t('addMoreForExtraDiscount', {
                amount: (20000 - subtotal).toLocaleString(),
                percent: user ? (userData?.firstShopp ? '5%' : '10%') : '10%',
              })}
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
              {t('useBonus', { amount: bonus.toLocaleString() })}
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
                {t('totalSavings')}
              </Typography>
              <Typography sx={{ color: '#e65100', fontSize: '15px', fontWeight: 700 }}>
                ֏{totalSaved.toLocaleString()}
              </Typography>
            </Box>
            {savedFromOriginalPrice > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • {t('productMarkdowns')}
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{savedFromOriginalPrice.toLocaleString()}
                </Typography>
              </Box>
            )}
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • {t('extraDiscountLabel')}
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{discount.toLocaleString()}
                </Typography>
              </Box>
            )}
            {firstShopDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • {t('firstShopDiscountLabel')}
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{firstShopDiscount.toLocaleString()}
                </Typography>
              </Box>
            )}
            {shippingSavings > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • {t('freeShippingLabel')}
                </Typography>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 500 }}>
                  ֏{shippingSavings.toLocaleString()}
                </Typography>
              </Box>
            )}
            {applyBonus && appliedBonus > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#e65100', fontSize: '13px', fontWeight: 300 }}>
                  • {t('bonusApplied')}
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
            {t('orderTotal')}
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
        <Box
          sx={{
            mb: '15px',
            p: '12px',
            bgcolor: '#f0f8ff',
            borderRadius: '8px',
            border: '1px solid #b3d9ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <RedeemIcon sx={{ fontSize: '20px', color: '#1976d2' }} />
          <Typography
            sx={{
              fontSize: '14px',
              color: '#1976d2',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {t('bonusEarnMessage', { amount: Math.floor(total * 0.03).toLocaleString() })}
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
                  {/* {t('checkout')} */}
                  {t('continue')}
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
                {/* {t('checkout')} */}
                {t('continue')}
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
                {t('continueShopping')}
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
                t('submitOrder')
              ) : (
                t('goToPayment')
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
                {t('backToCart')}
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
