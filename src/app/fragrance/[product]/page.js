// import { images } from '@/components/PopularProducts';
import { Grid } from '@mui/material';
import Image from 'next/image';
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

export default function FragranceProduct({ params }) {
  const { product } = params;
  console.log('images type:', typeof images); // should be object
  console.log('images length:', images.length); // should be 8
  console.log('images[0]:', images[0]);

  return (
    <Grid container size={12}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Image
          width={200}
          height={200}
          style={{ overflow: 'hidden', width: '80%', height: 'auto' }}
          src={images[+product]}
          alt="image"
        />
      </Grid>
    </Grid>
  );
}
