import { Grid } from '@mui/material';
import CartPageUi from './_components/CartPageUi';

export default async function CartPage({ searchParams }) {
  const { item } = await searchParams;

  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
        // overflow: 'hidden',
        position: 'relative',
      }}
      container
      justifyContent={'center'}
      size={12}
    >
      <CartPageUi />
    </Grid>
  );
}
