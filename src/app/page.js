import CustumSolutions from '@/_components/CustumSolutions';
import EmblaHomeSlide from '@/_components/EmblaHomeSlide';
import FlashDeals from '@/_components/FlashDeals';
import PopularProducts from '@/_components/PopularProducts';
import SpecialOffer from '@/_components/SpecialOffer';
import { Box } from '@mui/material';
import { getCachedSlides } from '@/_lib/firebase/getCachedSlides';
import { getCachedFlashDeals } from '@/_lib/firebase/getCachedFlashDeals';
import { getCachedSpecialOffer } from '@/_lib/firebase/getCachedSpecialOffer';
import { getCachedCategoryProducts } from '@/_lib/firebase/getCachedCategoryProducts';

export default async function Home() {
  const [slides, flashDeals, specialOffer, fragrance, makeup, hair] = await Promise.all([
    getCachedSlides(),
    getCachedFlashDeals(),
    getCachedSpecialOffer(),
    getCachedCategoryProducts('fragrance'),
    getCachedCategoryProducts('makeup'),
    getCachedCategoryProducts('hair'),
  ]);

  return (
    <Box sx={{ p: { xs: 0, sm: '10px' } }}>
      <EmblaHomeSlide initialSlides={slides} />
      <CustumSolutions />
      <FlashDeals flashDeals={flashDeals} />
      <SpecialOffer specialOffer={specialOffer} />
      <PopularProducts popularProducts={{ fragrance, makeup, hair }} />
    </Box>
  );
}
