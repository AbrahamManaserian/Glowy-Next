'use client';

import CustumSolutions from '@/components/homePage/CustumSolutions';
import FlashDeals from '@/components/homePage/FlashDeals';
import HomeSlide from '@/components/homePage/HomeSlide';
import PopularProducts from '@/components/homePage/PopularProducts';
import SpecialOffer from '@/components/homePage/SpecialOffer';
import { Box, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ p: { xs: 0, sm: '10px' } }}>
      <HomeSlide />
      <CustumSolutions />
      <FlashDeals />
      <SpecialOffer />
      <PopularProducts />
      <Link href="/about">
        <Button>About</Button>
      </Link>
    </Box>
  );
}
