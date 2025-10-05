'use client';

import { useGlobalContext } from '@/app/GlobalContext';
import { Box, Button, Grid, Typography } from '@mui/material';
import { images } from '@/components/PopularProducts';
import Link from 'next/link';
import DetailedCartItem from './DetailedCartItem';

export default function CartPageUi() {
  const { cart, setCart } = useGlobalContext();

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
        Cart ({cart.length})
      </Typography>
      <Grid
        sx={{ overflow: 'hidden', boxSizing: 'border-box', mt: '20px' }}
        size={{ xs: 12, sm: 8 }}
        direction={'column'}
      >
        {Object.keys(cart.items).map((id, index) => {
          return (
            <DetailedCartItem
              check={false}
              key={index}
              id={id}
              image={images[id]}
              cart={cart}
              setCart={setCart}
            />
          );
        })}
      </Grid>
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
          Summary
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
        <Link scroll={true} href="/cart">
          <Button
            // onClick={() => toggleDrawer(false)}
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
      </Grid>
    </Grid>
  );
}
