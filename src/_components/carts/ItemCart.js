'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Grid, Rating, Typography, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from '@/i18n/routing';
import { ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { StyledBadge } from '@/app/[locale]/(pages)/cart/_components/CartDrawer';
import { handleAddItemToWishList } from '@/_functions/hadleAddItemToWishList';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

export const handleClickAddToCart = async (item, quantity, setCart, cart, option) => {
  const user = auth.currentUser;
  let updatedCart;

  if (cart.items[item.id]) {
    updatedCart = structuredClone(cart);

    if (!item.optionHasId && item.availableOptions.length > 0) {
      updatedCart.items[item.id].quantity = updatedCart.items[item.id].quantity + quantity;
      updatedCart.items[item.id].options[option] =
        (updatedCart.items[item.id].options[option] || 0) + quantity;
      updatedCart.length = updatedCart.length + quantity;
    } else {
      updatedCart.items[item.id].quantity = updatedCart.items[item.id].quantity + quantity;
      updatedCart.length = updatedCart.length + quantity;
    }
  } else {
    if (!item.optionHasId && item.availableOptions.length > 0) {
      const newItem = {
        id: item.id,
        img: item.smallImage.file,
        quantity: quantity,
        price: item.price,
        name: item.brand + ' - ' + item.model,
        options: { [item[item.optionKey]]: quantity },
      };

      updatedCart = structuredClone(cart);
      updatedCart.items[item.id] = newItem;
      updatedCart.length = cart.length + quantity;
    } else {
      const newItem = {
        id: item.id,
        img: item.smallImage.file,
        quantity: quantity,
        price: item.price,
        name: item.brand + ' - ' + item.model,
      };

      updatedCart = structuredClone(cart);
      updatedCart.items[item.id] = newItem;
      updatedCart.length = cart.length + quantity;
    }
  }

  setCart(updatedCart);

  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { cart: updatedCart }, { merge: true });
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  } else {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }
};

export default function ItemCart({ item }) {
  // console.log(item);
  const t = useTranslations('ShopPage');
  const tProduct = useTranslations('ProductPage');
  const router = useRouter();
  let newAdded;

  const { setWishList, wishList, cart, setCart } = useGlobalContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedOption, setSelectedOption] = useState('');
  const [menuMinWidth, setMenuMinWidth] = useState(null);
  const [selectedItem, setSelectedItem] = useState(item);
  const [isFetching, setIsFetching] = useState(false);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
    try {
      const w = e.currentTarget.clientWidth;
      setMenuMinWidth(w);
    } catch (err) {
      setMenuMinWidth(null);
    }
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleSelectOption = async (value, id) => {
    setSelectedOption(value);
    setAnchorEl(null);

    // If an id is provided, fetch the full product (cached) and set it as selected
    if (selectedItem.optionHasId) {
      try {
        setIsFetching(true);
        await fetchProductById(id);
      } catch (e) {
        console.log(e);
      } finally {
        setIsFetching(false);
      }
    } else if (id === 'parent') {
      setSelectedItem(item);
    } else {
      setSelectedItem((prev) => ({ ...prev, ...prev.availableOptions[id], id: prev.id, selectedOption: id }));
    }
  };

  const fetchProductById = async (id) => {
    try {
      const res = await fetch(`/api/product?id=${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      setSelectedItem(data);
      return data;
    } catch (error) {
      console.error('Error fetching product by id via API:', error);
      return null;
    }
  };

  const handelClickBuyNow = (item) => {
    handleClickAddToCart(item, 1, setCart, cart, selectedOption);
    router.push('/cart');
  };

  useEffect(() => {
    if (item) {
      setSelectedOption(item?.[item.optionKey] || '');
      setSelectedItem(item);
    }
  }, [item]);

  const displayItem = selectedItem || item;

  const badgeContent =
    cart?.items[selectedItem.id] && cart?.items[selectedItem.id]?.options
      ? cart?.items[selectedItem.id]?.options?.[selectedOption]
      : cart?.items[selectedItem.id]
        ? cart.items[selectedItem.id]?.quantity
        : 0;
  // console.log(num);

  return (
    <Grid
      sx={{
        // height: { xs: '65vw', sm: '45vw', md: '30vw', lg: '20vw' },
        overflow: 'hidden',
        // border: 1,
        flexWrap: 'nowrap',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
      }}
      size={12}
      container
      direction={'column'}
    >
      {/* <Button onClick={() => console.log(cart)}>aas</Button> */}
      {isFetching && (
        <div
          style={{
            position: 'absolute', // relative to the parent
            inset: 0,
            backdropFilter: 'blur(0.5px)',
            background: 'rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            zIndex: 10,
          }}
        >
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <div
            style={{
              width: 40,
              height: 40,
              border: '4px solid rgba(0,0,0,0.08)',
              borderTop: '4px solid rgba(33,150,243,1)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
      {newAdded && (
        <Typography
          sx={{
            position: 'absolute',
            fontSize: '13px',
            lineHeight: '13px',
            fontWeight: 500,
            top: '10px',
            right: '10px',
            bgcolor: '#d4e7f7ff',
            borderRadius: '7px',
            color: '#1565c0',
            p: '5px 8px',
            zIndex: 1,
          }}
        >
          {t('new')}
        </Typography>
      )}
      {displayItem.previousPrice && (
        <Typography
          sx={{
            position: 'absolute',
            fontSize: '13px',
            lineHeight: '13px',
            fontWeight: 500,
            top: '10px',
            right: '10px',
            bgcolor: '#f1ddd7fe',
            borderRadius: '7px',
            color: '#dd2c00',
            p: '5px 8px',
            zIndex: 1,
          }}
        >
          SALE
        </Typography>
      )}

      <div
        style={{
          borderRadius: '15px',
          overflow: 'hidden',
        }}
      >
        <Link
          style={{
            WebkitTapHighlightColor: 'rgba(182, 212, 238, 0.11)',
          }}
          href={`/item/${displayItem?.id || item.id}?option=${
            !selectedItem.optionHasId ? encodeURIComponent(selectedOption) : ''
          }`}
        >
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              // bgcolor: 'red',
              aspectRatio: '1 / 1',
              boxSizing: 'border-box',
              borderRadius: '15px',

              // p: '10px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <img
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                overflow: 'hidden',
              }}
              src={displayItem?.smallImage?.file}
              alt="image"
            />
          </Box>
        </Link>
      </div>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '10px' }}>
        <Typography sx={{ color: '#263045fb', fontSize: '15px', fontWeight: 500 }}>
          {displayItem?.brand}{' '}
        </Typography>
        <Typography sx={{ color: '#3c4354a3', fontSize: '12px' }}>
          {displayItem?.size}
          {displayItem?.unit}
        </Typography>
      </Box>

      {/* menu moved below model */}

      <Typography sx={{ color: '#3c4354fb', fontSize: '13px' }}> {displayItem?.model}</Typography>
      {item.optionKey && (
        <Box sx={{ display: 'flex', flexGrow: 20, alignItems: 'flex-end' }}>
          <Button
            onClick={handleMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              p: '5px 0',
              minWidth: '0',
              width: '100%',
              cursor: 'pointer',
              color: 'text.secondary',
              // '&:hover': { bgcolor: 'action.hover' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.5,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 0.5, minWidth: 0 }}>
              <Typography component="span" sx={{ fontSize: 13, color: 'text.secondary', flex: '0 0 auto' }}>
                {tProduct(`optionKeys.${displayItem?.optionKey || item.optionKey}`) ||
                  displayItem?.optionKey ||
                  item.optionKey}{' '}
                ({item.availableOptions.length + 1}) :
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  // flex: 1,
                  minWidth: 0,
                  display: 'block',
                }}
              >
                {selectedOption || 'Select'}
              </Typography>
            </Box>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { minWidth: menuMinWidth ? `${menuMinWidth}px` : '100%' } }}
          >
            <MenuItem
              selected={item[item.optionKey] === selectedOption}
              onClick={() => handleSelectOption(item[item.optionKey], 'parent')}
            >
              {item[item.optionKey]}
            </MenuItem>
            {item.availableOptions.map((option, index) => (
              <MenuItem
                key={option.id ?? index}
                selected={option[item.optionKey] === selectedOption}
                onClick={() => handleSelectOption(option[item.optionKey], option.id)}
              >
                {option[item.optionKey]}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',

          gap: 1,
          mt: '5px',
          flexGrow: 1,
          alignItems: 'flex-end',
        }}
      >
        <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: 16 }}>
          ${displayItem?.price?.toLocaleString()}
        </Typography>
        <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: 14 }}>
          {displayItem?.previousPrice ? `$${displayItem.previousPrice.toLocaleString()}` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
        <Rating name="read-only" value={5} readOnly size="small" />
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}>
          {displayItem?.sold ? `${displayItem.sold} ${t('sold')}` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: '10px', alignItems: 'flex-end' }}>
        <div
          style={{ cursor: 'pointer', WebkitTapHighlightColor: 'Background', marginBottom: '5px' }}
          onClick={() => handleClickAddToCart(displayItem, 1, setCart, cart, selectedOption)}
        >
          {/* <StyledBadge badgeContent={cart.items ? cart.items[displayItem.id]?.quantity : 0}> */}
          <StyledBadge badgeContent={badgeContent}>
            <ShoppingBasketIcon size={'25'} />
          </StyledBadge>
        </div>
        {wishList.includes(displayItem.id) ? (
          <FavoriteIcon
            onClick={() => handleAddItemToWishList(displayItem.id, setWishList, wishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px' }}
          />
        ) : (
          <FavoriteBorderIcon
            onClick={() => handleAddItemToWishList(displayItem.id, setWishList, wishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px', cursor: 'pointer' }}
          />
        )}

        <Button
          onClick={() => handelClickBuyNow(displayItem)}
          size="small"
          sx={{
            bgcolor: '#2B3445',
            borderRadius: '10px',
            mb: '3px',
            fontSize: '13px',
            textTransform: 'none',
            p: '2px 10px',
          }}
          variant="contained"
        >
          {t('orderNow')}
        </Button>
        {/* </Link> */}
      </Box>
    </Grid>
  );
}
