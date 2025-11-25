'use client';



import CustumSolutions from '@/_components/CustumSolutions';
import FlashDeals from '@/_components/FlashDeals';
import HomeSlide from '@/_components/HomeSlide';
import PopularProducts from '@/_components/PopularProducts';
import SpecialOffer from '@/_components/SpecialOffer';
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ p: { xs: 0, sm: '10px' } }}>
      <HomeSlide />
      <CustumSolutions />
      <FlashDeals />
      <SpecialOffer />
      <PopularProducts />
    </Box>
  );
}
