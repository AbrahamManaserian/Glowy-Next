'use client';


import CustumSolutions from '@/components/CustumSolutions';
import FlashDeals from '@/components/FlashDeals';
import HomeSlide from '@/components/HomeSlide';
import PopularProducts from '@/components/PopularProducts';
import SpecialOffer from '@/components/SpecialOffer';
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

      <Link scroll={true} href="/fragrance?category=fragrance&gender=women">
        <Button>About</Button>
      </Link>
      <Link href="/fragrance">
        <Button>About</Button>
      </Link>
    </Box>
  );
}
