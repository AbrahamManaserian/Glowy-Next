'use client';

import { Box, Button, Grid, Rating, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBasketIcon } from '@/_components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { StyledBadge } from '@/app/(pages)/cart/_components/CartDrawer';
import { handleAddItemToWishList } from '@/_functions/hadleAddItemToWishList';
import { useRouter } from 'next/navigation';

export const handleClickAddToCart = (item, quantity, setCart, cart) => {
  if (cart.items[item.id]) {
    const updatedCart = structuredClone(cart);
    updatedCart.items[item.id].quantity = updatedCart.items[item.id].quantity + quantity;
    updatedCart.length = updatedCart.length + quantity;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    // console.log(updatedCart);
  } else {
    const newItem = {
      id: item.id,
      img: item.smallImage.file,
      quantity: quantity,
      price: item.price,
      name: item.brand + ' - ' + item.model,
    };
    const updatedCart = structuredClone(cart);

    updatedCart.items[item.id] = newItem;
    updatedCart.length = cart.length + quantity;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  }
};

export default function ItemCart({ item }) {
  const router = useRouter();
  let newAdded;

  const { setWishList, wishList, cart, setCart } = useGlobalContext();

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
          NEW
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
      <Typography sx={{ color: '#3c4354fb', fontSize: '13px' }}> {item.model}</Typography>
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
          {item.sold ? `${item.sold} sold` : ''}
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
            onClick={() => handleAddItemToWishList(item.id, setWishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px' }}
          />
        ) : (
          <FavoriteBorderIcon
            onClick={() => handleAddItemToWishList(item.id, setWishList)}
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
          Buy now
        </Button>
        {/* </Link> */}
      </Box>
    </Grid>
  );
}
