'use client';

import CustumSolutions from '@/components/homePage/CustumSolutions';
import FlashDeals from '@/components/homePage/FlashDeals';
import HomeSlide from '@/components/homePage/HomeSlide';
import PopularProducts from '@/components/homePage/PopularProducts';
import SpecialOffer from '@/components/homePage/SpecialOffer';
import { Button, Grid } from '@mui/material';
import Link from 'next/link';


export default function Home() {
  return (
    <Grid minHeight="320vh">
      <Grid sx={{ p: { xs: 0, sm: '10px' } }}>
        <HomeSlide />
        <CustumSolutions />
        <FlashDeals />
        <SpecialOffer />
        <PopularProducts />
      </Grid>
      <Link href="/about">
        <Button>About</Button>
      </Link>
    </Grid>
  );
}
