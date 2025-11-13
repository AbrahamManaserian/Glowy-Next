import { Box, Grid, Rating, Typography } from '@mui/material';
import { Options } from '../components/Options';
import { ProductImageComp } from './ProductImageComp';
// import FragranceCard from '../componenets/FragranceCard';
import Image from 'next/image';
import Link from 'next/link';
import FragranceCard from '../components/FragranceCard';

const giftImage = [
  '/images/giftCollection/491418281_17894849493207296_8185218575935560017_n.jpg',
  '/images/giftCollection/491444976_17895688209207296_701226333239409337_n.jpg',
  '/images/giftCollection/503000504_17899019925207296_2081947318050669149_n.jpg',
  '/images/giftCollection/527451955_17906711424207296_2969023766760293256_n.jpg',
];
export const images = [
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

  return (
    <Grid sx={{ m: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' } }} container size={12}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1150px',
          margin: '0 auto',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <ProductImageComp images={images} idNum={+product} />
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
          <Options id={+product} />
        </Grid>
      </Box>

      <Grid
        alignContent={'flex-start'}
        container
        size={12}
        mt={{ xs: '90px', sm: '120px' }}
        justifyContent={'center'}
      >
        <Grid sx={{ maxWidth: '1100px' }} spacing={'30px'} container>
          <Typography
            sx={{ fontSize: { xs: '18px', sm: '22px' }, width: '100%' }}
            fontWeight={700}
            color="#2B3445"
          >
            You May Also Like
          </Typography>
          {images.map((img, index) => {
            if (index > 3) return null;
            return <FragranceCard img={img} id={index} key={index} />;
          })}
        </Grid>
        <Typography
          sx={{
            fontSize: { xs: '18px', sm: '22px' },
            width: '100%',
            mt: { xs: '100px', sm: '140px' },
            mb: '30px',
          }}
          fontWeight={700}
          color="#2B3445"
        >
          Create Your Gift Box
        </Typography>

        <Link style={{ WebkitTapHighlightColor: 'transparent', width: '100%' }} href={`/gifts`}>
          <Box
            sx={{
              // position: 'relative',
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {giftImage.map((img, index) => {
              return (
                <Box
                  sx={{
                    p: { xs: '5px', sm: '20px' },
                    height: { xs: '150px', sm: '300px' },
                    boxSizing: 'border-box',
                    width: '50%',
                    overflow: 'hidden',
                  }}
                  key={index}
                >
                  <Image
                    src={img}
                    alt="Makeup Remover"
                    width={200}
                    height={200}
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Link>
      </Grid>
    </Grid>
  );
}
