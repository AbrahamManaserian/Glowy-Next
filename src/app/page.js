import CustumSolutions from '@/_components/CustumSolutions';
import EmblaHomeSlide from '@/_components/EmblaHomeSlide';
import FlashDeals from '@/_components/FlashDeals';
import PopularProducts from '@/_components/PopularProducts';
import SpecialOffer from '@/_components/SpecialOffer';
import { Box } from '@mui/material';
import { getCachedSlides } from '@/_lib/firebase/getCachedSlides';
import { getCachedFlashDeals } from '@/_lib/firebase/getCachedFlashDeals';

export default async function Home() {
  const slides = await getCachedSlides();
  const flashDeals = await getCachedFlashDeals();

  return (
    <Box sx={{ p: { xs: 0, sm: '10px' } }}>
      <EmblaHomeSlide initialSlides={slides} />
      <CustumSolutions />
      <FlashDeals flashDeals={flashDeals} />
      <SpecialOffer />
      <PopularProducts />
    </Box>
  );
}
