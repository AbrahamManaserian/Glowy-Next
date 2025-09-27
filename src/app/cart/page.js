'use client';

import { Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useGlobalContext } from '../GlobalContext';

export default function Home() {
  const { user, setUser, cart, setCart } = useGlobalContext();
  // console.log(cart);
  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography>Cart Page</Typography>
    </Grid>
  );
}
