import { db } from '@/firebase';
import { Box, Grid, LinearProgress, Rating, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Options } from '../componenets/Options';

const images = [
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/12.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
  '/images/12.webp',
];

export default async function FragranceProduct({ params }) {
  const { product } = await params;
  //   let arr = [];

  //   const orderRef = doc(db, 'orders', '38');

  //   const docSnap = await getDoc(orderRef);
  //   if (docSnap.data()) {
  //     arr = docSnap.data().items;
  //   }
  //   console.log(arr);

  return (
    <Grid sx={{ m: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' } }} container size={12}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1150px',
          margin: '0 auto',
          flexWrap: 'wrap',
        }}
      >
        <Grid
          sx={{ bgcolor: '#98a4cb16', borderRadius: '25px', mt: '50px' }}
          size={{ xs: 12, sm: 12, md: 6 }}
          container
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Image
            width={200}
            height={200}
            style={{ overflow: 'hidden', width: '90%', height: 'auto' }}
            //   src={arr[+product].images[0].file}
            src={images[+product]}
            alt="image"
          />
        </Grid>
        <Grid
          sx={{ mt: '50px' }}
          pl={{ xs: 0, sm: 0, md: '60px' }}
          size={{ xs: 12, sm: 12, md: 6 }}
          container
          direction={'column'}
          alignItems={'flex-start'}
        >
          <Typography
            sx={{
              color: '#04903eff',
              bgcolor: '#c8e6c97e',
              borderRadius: '7px',
              p: '3px 7px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            In Stock
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '25px',
              fontWeight: 500,
              mt: '25px',
            }}
          >
            Armani Brand
          </Typography>
          <Typography
            sx={{
              color: '#263045fb',
              fontSize: '18px',
              //   fontWeight: 500,
              mt: '5px',
            }}
          >
            Stronger With You Absolutely
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
            <Rating name="read-only" value={1} readOnly size="larg" />
            <Typography sx={{ color: '#3c4354a3', fontSize: '14px', lineHeight: '12px' }}>50 Sold</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '20px' }}>
            <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: '19px' }}>$89</Typography>
            <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: '16px' }}>
              $120
            </Typography>
          </Box>
          <Typography sx={{ color: '#3c4354f2', mt: '15px', fontSize: '15px' }}>
            Discover Emporio Armani STRONGER WITH YOU INTENSELY, a vibrant and audacious fragrance for men,
            inspired by the unbreakable strength of togetherness. Engagingly masculine STRONGER WITH YOU
            INTENSELY reflect the personality of a young man empowered by an
          </Typography>
          <Options />
        </Grid>
      </Box>
    </Grid>
  );
}
