'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import { Box, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { images } from '@/components/PopularProducts';
import Image from 'next/image';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Link from 'next/link';
import { decreaseQuantity, deleteItem, increaseQuantity } from '../functions/addDeleteIncDecreaseCart';
import CartItem from './CartItem';

export default function CartPageUi({ items }) {
  const { cart, setCart, handleClickError } = useGlobalContext();
  //   console.log(cart);

  return (
    <Grid
      sx={{
        display: 'flex',
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
        sx={{ fontSize: { xs: '22px', sm: '28px' }, mb: '20px', width: '100%' }}
        fontWeight={700}
        color="#2B3445"
      >
        Cart ({cart.length})
      </Typography>
      <Grid container sx={{ overflow: 'hidden' }} size={{ xs: 12, sm: 8 }} direction={'column'}>
        {Object.keys(cart.items).map((id, index) => {
          return (
            <CartItem check={true} key={index} id={id} image={images[id]} cart={cart} setCart={setCart} />
          );
        })}
      </Grid>
      <Grid size={4} sx={{ border: 'solid 1px #c5c7cc8a', borderRadius: '15px', p: '25px' }}>
        <Typography
          sx={{
            color: '#263045fb',
            // fontSize: '1px',
            fontWeight: 500,
            width: '340px',
          }}
        >
          Summary
        </Typography>
      </Grid>
    </Grid>
  );
}
