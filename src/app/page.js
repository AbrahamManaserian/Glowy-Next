'use client';

import CustumSolutions from '@/components/homePage/CustumSolutions';
import FlashDeals from '@/components/homePage/FlashDeals';
import HomeSlide from '@/components/homePage/HomeSlide';
import PopularProducts from '@/components/homePage/PopularProducts';
import SpecialOffer from '@/components/homePage/SpecialOffer';
import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const images = [
  '/images/1000018500.png',
  '/images/1080_0000s_0095_D_eaubonneVSOPBrandy-removebg-preview.png',
  '/images/Courvoisier-VS-Cognac-750-ml_1-removebg-preview.png',
  '/images/Hennessy_Cognac_VS_70cl__16968-removebg-preview.png',
  '/images/wp-image31533636649143-removebg-preview.png',
  '/images/1000018500.png',
  '/images/1080_0000s_0095_D_eaubonneVSOPBrandy-removebg-preview.png',
  '/images/Courvoisier-VS-Cognac-750-ml_1-removebg-preview.png',
  '/images/Hennessy_Cognac_VS_70cl__16968-removebg-preview.png',
  '/images/wp-image31533636649143-removebg-preview.png',
];

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
