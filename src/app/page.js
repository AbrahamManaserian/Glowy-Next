'use client';

import CustumSolutions from '@/components/homePage/CustumSolutions';
import HomeSlide from '@/components/homePage/HomeSlide';
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
    <Grid size={12} minHeight="320vh">
      <div>
        <HomeSlide />
        <CustumSolutions />
      </div>
      <Link href="/about">
        <Button>About</Button>
      </Link>
    </Grid>
  );
}
