'use client';

import ImageCarousel from '@/components/ImageCarousel';
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
    <Grid container xs={12} minHeight="320vh" alignContent="flex-start">
      {/* {images.map((im, index) => {
        return <img key={index} src={im} alt="Logo" width={200} height="auto" />;
      })} */}

      <Box sx={{ p: '20px 10px', overflow: 'hidden' }}>
        <ImageCarousel images={images} />
      </Box>
      <Link href="/about">
        <Button>About</Button>
      </Link>
    </Grid>
  );
}
