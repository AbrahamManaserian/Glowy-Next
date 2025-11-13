'use client';

import { Box, Button, Grid, Rating, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBasketIcon } from '@/components/icons';
import { useGlobalContext } from '@/app/GlobalContext';
import { handleAddItemToWishList } from '@/app/functions/hadleAddItemToWishList';
import { handleAddItemToCart } from '@/app/cart/functions/addDeleteIncDecreaseCart';
import { useRouter } from 'next/navigation';

export default function FragranceCard({ img, height, id, brand, model, size, price }) {
  const router = useRouter();

  const { setCart, setOpenCartAlert, setOpenItemAddedAlert, setWishList, wishList, cart } =
    useGlobalContext();

  const handleClickAddToCart = (id) => {
    if (cart.items[id]) {
      setOpenItemAddedAlert(id);
    } else {
      setOpenCartAlert({ id: id, qount: 1 });
    }
  };

  const handelClickBuyNow = (id) => {
    if (cart.items[id]) {
      router.push(`/cart?item=${id}`);
    } else {
      handleAddItemToCart(id, setCart, setOpenCartAlert, 1, cart);
      router.push(`/cart?item=${id}`);
    }
  };

  return (
    <Grid
      sx={{
        // height: { xs: '65vw', sm: '45vw', md: '30vw', lg: '20vw' },
        overflow: 'hidden',
        // borderBottom: 1,
        flexWrap: 'nowrap',
        position: 'relative',
      }}
      size={{ xs: 6, sm: 4, md: 4, lg: 3 }}
      container
      direction={'column'}
    >
      {id % 2 === 0 ? (
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
          {/* NEW */}
          {id}
        </Typography>
      ) : (
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
          {/* SALE */}
          {id}
        </Typography>
      )}
      <Link style={{ WebkitTapHighlightColor: 'transparent' }} href={`/fragrance/${id}`}>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            height: height,
            height: '180px',
            bgcolor: '#98a4cb16',
            boxSizing: 'border-box',
            borderRadius: '15px',
            width: '100%',
            // py: '20px',
          }}
        >
          <Image
            width={200}
            height={200}
            style={{ overflow: 'hidden', width: '80%', height: 'auto' }}
            src={img}
            alt="image"
          />
        </Box>
      </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '15px' }}>
        <Typography sx={{ color: '#263045fb', fontSize: '14px', fontWeight: 500 }}>{brand} </Typography>
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}> {size}ml </Typography>
      </Box>
      <Typography sx={{ color: '#3c4354fb', fontSize: '14px' }}> {model}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '5px' }}>
        <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: 16 }}>$89</Typography>
        <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: 14 }}>${price}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
        <Rating name="read-only" value={1} readOnly size="small" />
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}> 50 Sold </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mt: '10px', alignItems: 'flex-end' }}>
        <div
          style={{ cursor: 'pointer', WebkitTapHighlightColor: 'Background' }}
          onClick={() => handleClickAddToCart(id)}
        >
          <ShoppingBasketIcon size={'25'} />
        </div>
        {wishList.includes(id) ? (
          <FavoriteIcon
            onClick={() => handleAddItemToWishList(id, setWishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px' }}
          />
        ) : (
          <FavoriteBorderIcon
            onClick={() => handleAddItemToWishList(id, setWishList)}
            sx={{ color: '#ff3d00', ml: '5px', mb: '2px', cursor: 'pointer' }}
          />
        )}
        {/* <Link
          style={{ WebkitTapHighlightColor: 'transparent', marginLeft: 'auto' }}
          href={`/cart?item=${id}`}
        > */}
        <Button
          onClick={() => handelClickBuyNow(id)}
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
