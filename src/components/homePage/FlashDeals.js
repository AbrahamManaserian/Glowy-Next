'use client';

import { Box, Grid, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

import useEmblaCarousel from 'embla-carousel-react';

export const images = [
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/06lT4BbLdxYjqF7EjvbnSXT9ILosjlIZh539zWgD.webp',
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/06lT4BbLdxYjqF7EjvbnSXT9ILosjlIZh539zWgD.webp',
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
];

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' }
    //   [Autoplay({ delay: 3000, align: 'start' })] // autoplay every 3s
  );

  const [itemsPerView, setItemsPerView] = useState(); // default desktop

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 550) {
        setItemsPerView(1); // mobile
      } else if (window.innerWidth >= 550 && window.innerWidth < 750) {
        setItemsPerView(2); // tablet
      } else if (window.innerWidth >= 750 && window.innerWidth < 1000) {
        setItemsPerView(3); // tablet
      } else {
        setItemsPerView(4); // desktop
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const slides = images;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  if (!itemsPerView) return null;
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Carousel viewport */}
      <div
        ref={emblaRef}
        style={{
          overflow: 'hidden',

          //   borderRadius: '12px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {slides.map((src, index) => (
            <Box
              key={index}
              sx={{
                flex: `0 0 ${100 / itemsPerView}%`, // responsive width
                minWidth: '0',
                padding: '10px',
                boxSizing: 'border-box', // ✅ keeps padding inside width
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: '400px', sm: '470px' },
                  overflow: 'hidden',
                  bgcolor: '#d2cccc17',
                  p: '10px',
                  borderRadius: '15px',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    // height: '250px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={200}
                    height={200}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    // overflow: 'hidden',
                    my: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '13px', sm: '14px' },
                      textTransform: 'uppercase',
                      color: '#b3acaaff',
                      textAlign: 'center',
                      fontWeight: 100,
                    }}
                  >
                    Fragrance
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '15px', sm: '17px' },
                      color: '##2B3445',
                      textAlign: 'center',
                      lineHeight: '22px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Armani Stronger With yuo Absolutely
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '15px', sm: '17px' },
                      color: '##2B3445',
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    $ 250.00
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </div>

      <ChevronLeftIcon
        onClick={scrollPrev}
        sx={{
          color: '#747982ff',
          position: 'absolute',
          top: { xs: '-52px', sm: '-68px' },
          right: '30px',
          fontSize: '30px',
          cursor: 'pointer',
          mr: '5px',
        }}
      />
      <NavigateNextIcon
        onClick={scrollNext}
        sx={{
          color: '#747982ff',
          right: '10px',
          fontSize: '30px',
          cursor: 'pointer',
          position: 'absolute',
          top: { xs: '-52px', sm: '-68px' },
          right: 0,
        }}
      />
    </div>
  );
}

export default function FlashDeals() {
  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container justifyContent="space-between">
      <Typography
        width={'50%'}
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px' }}
        fontWeight={700}
        color="#2B3445"
      >
        Flash Deals
      </Typography>

      <EmblaCarousel />
    </Grid>
  );
}
