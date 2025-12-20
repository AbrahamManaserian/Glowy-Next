'use client';

import { Box, Grid, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const images = [
  '/images/giftCollection/491418281_17894849493207296_8185218575935560017_n.jpg',
  '/images/giftCollection/491444976_17895688209207296_701226333239409337_n.jpg',
  '/images/giftCollection/503000504_17899019925207296_2081947318050669149_n.jpg',
  '/images/giftCollection/527451955_17906711424207296_2969023766760293256_n.jpg',
  '/images/giftCollection/491415702_17894775201207296_2836718220170321531_n.jpg',
];

const arr = [
  { path: '/fragrance?subCategory=fragrance', name: 'Fragrance', image: images[0] },
  { path: '/makeup', name: 'Makeup', image: images[1] },
  { path: '/skincare', name: 'Skincare', image: images[2] },
  { path: '/hair', name: 'Haircare', image: images[3] },
  { path: '/bathBody', name: 'Bath & Body', image: images[4] },
];

export default function CustumSolutions() {
  const router = useRouter();
  const mainItem = arr[1]; // Makeup
  const subItems = [arr[0], arr[2], arr[3], arr[4]]; // Fragrance, Skincare, Haircare, Bath & Body

  return (
    <Grid
      size={12}
      alignContent="flex-start"
      container
      sx={{ borderRadius: '15px', m: { xs: '80px 15px', sm: '90px 25px' }, position: 'relative' }}
    >
      <Typography
        width={'100%'}
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px' }}
        fontWeight={700}
        color="#2B3445"
      >
        Custom solutions for your needs
      </Typography>

      {/* Main Item (Left/Top Large Item) */}
      <Grid
        size={{ xs: 12, sm: 12, md: 4 }}
        sx={{
          p: { xs: '10px 0 10px 0', sm: '10px 0 10px 0', md: '10px 10px 10px 0' },
        }}
      >
        <Box
          onClick={() => router.push(mainItem.path)}
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 205, sm: 275, md: '810px' },
            borderRadius: '15px',
            overflow: 'hidden',
            cursor: 'pointer',
            transform: 'translateZ(0)', // Fix for Safari border-radius clipping
            backfaceVisibility: 'hidden', // Fix for Safari corner aliasing
            WebkitTapHighlightColor: 'transparent',
            '&:hover p': {
              textDecoration: 'underline',
            },
          }}
        >
          <Image
            src={mainItem.image}
            alt={mainItem.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
            className="hover-scale"
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(4px)',
              borderRadius: '8px',
              padding: '6px 14px',
              pointerEvents: 'none',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '14px', sm: '20px' },
                fontWeight: 700,
                color: '#2B3445',
              }}
            >
              {mainItem.name}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              height: '35px',
              width: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          >
            <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
          </Box>
        </Box>
      </Grid>

      {/* Sub Items Grid (Right/Bottom) */}
      <Grid size={{ xs: 12, sm: 12, md: 8 }} container>
        {subItems.map((item, index) => (
          <Grid
            key={index}
            sx={{
              p:
                index % 2 === 0
                  ? { xs: '10px 0 10px 0', sm: '10px 10px 10px 0', md: '10px' }
                  : { xs: '10px 0 10px 0', sm: '10px 0 10px 10px', md: '10px 0 10px 10px' },
            }}
            size={{ xs: 12, sm: 6 }}
          >
            <Box
              onClick={() => router.push(item.path)}
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '205px', sm: '275px', md: '395px' },
                borderRadius: '15px',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: 'translateZ(0)', // Fix for Safari border-radius clipping
                backfaceVisibility: 'hidden', // Fix for Safari corner aliasing
                WebkitTapHighlightColor: 'transparent',
                '&:hover p': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                }}
                className="hover-scale"
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '40px',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  pointerEvents: 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '20px' },
                    fontWeight: 700,
                    color: '#2B3445',
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '40px',
                  right: '40px',
                  height: '35px',
                  width: '35px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'white',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              >
                <ArrowRightAltIcon sx={{ color: '#2B3445' }} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
