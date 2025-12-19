import CustumSolutions from '@/_components/CustumSolutions';
import EmblaHomeSlide from '@/_components/EmblaHomeSlide';
import FlashDeals from '@/_components/FlashDeals';
import PopularProducts from '@/_components/PopularProducts';
import SpecialOffer from '@/_components/SpecialOffer';
import { Box } from '@mui/material';
import { getCachedSlides } from '@/_lib/firebase/getCachedSlides';

export default async function Home() {
  const slides = await getCachedSlides();

  return (
    <Box sx={{ p: { xs: 0, sm: '10px' } }}>
      <EmblaHomeSlide initialSlides={slides} />
      <CustumSolutions />
      <FlashDeals />
      <SpecialOffer />
      <PopularProducts />
    </Box>
  );
}
