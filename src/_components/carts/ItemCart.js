'use client';

import { useState } from 'react';
import { Box, Button, Grid, Rating, Typography, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
// import Link from 'next/link';
import { Link } from '@/i18n/routing';
import { ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { StyledBadge } from '@/app/[locale]/(pages)/cart/_components/CartDrawer';
import { handleAddItemToWishList } from '@/_functions/hadleAddItemToWishList';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

export const handleClickAddToCart = async (item, quantity, setCart, cart) => {
  const user = auth.currentUser;
  let updatedCart;

  if (cart.items[item.id]) {
    updatedCart = structuredClone(cart);
    updatedCart.items[item.id].quantity = updatedCart.items[item.id].quantity + quantity;
    updatedCart.length = updatedCart.length + quantity;
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
  console.log('Rendering ItemCart for item:', item);
  const t = useTranslations('ShopPage');
  const router = useRouter();
  let newAdded;

  const { setWishList, wishList, cart, setCart } = useGlobalContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedOption, setSelectedOption] = useState(item?.[item.optionKey] || '');

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSelectOption = (value) => {
    setSelectedOption(value);
    setAnchorEl(null);
  };

  const handelClickBuyNow = (item) => {
    handleClickAddToCart(item, 1, setCart, cart);
    router.push('/cart');
  };

  return (
    <Grid
      sx={{
        // height: { xs: '65vw', sm: '45vw', md: '30vw', lg: '20vw' },
        overflow: 'hidden',
        // border: 1,
        flexWrap: 'nowrap',
        position: 'relative',
      }}
      size={12}
      container
      direction={'column'}
    >
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
      {item.previousPrice && (
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
          href={`/item/${item.id}`}
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
            <Image
              width={200}
              height={200}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                overflow: 'hidden',
              }}
              src={item.smallImage.file}
              alt="image"
            />
          </Box>
        </Link>
      </div>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '10px' }}>
        <Typography sx={{ color: '#263045fb', fontSize: '15px', fontWeight: 500 }}>{item.brand} </Typography>
        <Typography sx={{ color: '#3c4354a3', fontSize: '12px' }}>
          {item.size}
          {item.unit}
        </Typography>
      </Box>

      {/* menu moved below model */}

      <Typography sx={{ color: '#3c4354fb', fontSize: '13px' }}> {item.model}</Typography>
      <Box sx={{ mt: 1 }}>
        <Button
          onClick={handleMenuOpen}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            textTransform: 'none',
            p: 0,
            minWidth: 'auto',
            cursor: 'pointer',
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
            display: 'inline-flex',
            alignItems: 'center',

            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(120px)',
              textWrap: 'nowrap',
            }}
          >
            {item.optionKey}: {selectedOption || 'Select'}
          </Typography>
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {item.availableOptions.map((option, index) => (
            <MenuItem
              key={index}
              selected={option[item.optionKey] === selectedOption}
              onClick={() => handleSelectOption(option[item.optionKey])}
            >
              {option[item.optionKey]}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '5px' }}>
        <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: 16 }}>
          ${item.price.toLocaleString()}
        </Typography>
        <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: 14 }}>
          {item.previousPrice ? `$${item.previousPrice.toLocaleString()}` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
        <Rating name="read-only" value={5} readOnly size="small" />
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}>
          {item.sold ? `${item.sold} ${t('sold')}` : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: '10px', alignItems: 'flex-end' }}>
        <div
          style={{ cursor: 'pointer', WebkitTapHighlightColor: 'Background', marginBottom: '5px' }}
          onClick={() => handleClickAddToCart(item, 1, setCart, cart)}
        >
          <StyledBadge badgeContent={cart.items ? cart.items[item.id]?.quantity : 0}>
            <ShoppingBasketIcon size={'25'} />
          </StyledBadge>
        </div>
        {wishList.includes(item.id) ? (
          <FavoriteIcon
            onClick={() => handleAddItemToWishList(item.id, setWishList, wishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px' }}
          />
        ) : (
          <FavoriteBorderIcon
            onClick={() => handleAddItemToWishList(item.id, setWishList, wishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px', cursor: 'pointer' }}
          />
        )}

        <Button
          onClick={() => handelClickBuyNow(item)}
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
