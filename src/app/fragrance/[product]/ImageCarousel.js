'use client';

import { Box, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useEmblaCarousel from 'embla-carousel-react';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export const ProductImageComp = ({ images, idNum }) => {
  const [imgIndex, setImgIndex] = useState(idNum);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: 'center' }
    //   [Autoplay({ delay: 3000, align: 'start' })] // autoplay every 3s
  );

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 400) {
        setItemsPerView(3); // mobile
      } else if (window.innerWidth >= 400 && window.innerWidth < 800) {
        setItemsPerView(4); // tablet
        //   } else if (window.innerWidth >= 750 && window.innerWidth < 1000) {
        //     setItemsPerView(3); // tablet
      } else {
        setItemsPerView(5); // desktop
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  return (
    <Grid
      sx={{ borderRadius: '25px', mt: '50px' }}
      size={{ xs: 12, sm: 12, md: 6 }}
      container
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Image
        width={200}
        height={200}
        style={{
          borderRadius: '25px',
          overflow: 'hidden',
          width: '90%',
          height: 'auto',
          backgroundColor: '#98a4cb16',
          WebkitTapHighlightColor: 'transparent',
        }}
        //   src={arr[+product].images[0].file}
        src={images[imgIndex]}
        alt="image"
      />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '80%', position: 'relative' }}>
          <ChevronLeftIcon
            onClick={scrollPrev}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              mr: '5px',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              left: '-30px',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
          <NavigateNextIcon
            onClick={scrollNext}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              right: '-30px',
            }}
          />
          <div
            style={{
              position: 'relative',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div
              ref={emblaRef}
              style={{
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', p: '20px 0' }}>
                {images.map((img, index) => {
                  //   if (index < 3)
                  return (
                    <div
                      key={index}
                      style={{
                        flex: `0 0 ${100 / itemsPerView}%`,
                        boxSizing: 'border-box',
                        padding: '5px',
                      }}
                    >
                      <Box
                        onClick={() => setImgIndex(index)}
                        sx={{
                          WebkitTapHighlightColor: 'transparent',
                          //   flex: `0 0 ${100 / itemsPerView}%`, // responsive width
                          //   minWidth: '0',
                          padding: '5px',
                          boxSizing: 'border-box', // ✅ keeps padding inside width
                          opacity: imgIndex === index ? 1 : 0.5,
                          border: 2,
                          cursor: 'pointer',
                          borderRadius: '10px',
                          borderColor: imgIndex === index ? '#ff3d00' : 'rgba(216, 66, 21, 0)',
                          transition: ' all 0.5s ease',
                          // m: '5px',
                        }}
                      >
                        <Image
                          width={200}
                          height={200}
                          style={{ width: '100%', height: 'auto' }}
                          //   src={arr[+product].images[0].file}
                          src={img}
                          alt="image"
                        />
                      </Box>
                    </div>
                  );
                })}
              </Box>
            </div>
          </div>
        </div>
      </Box>
    </Grid>
  );
};

const ImageCarousel = ({ images, idNum }) => {
  const [itemsPerView, setItemsPerView] = useState(5);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' }
    //   [Autoplay({ delay: 3000, align: 'start' })] // autoplay every 3s
  );
  return (
    <div
      style={{
        position: 'relative',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        ref={emblaRef}
        style={{
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {images.map((img, index) => {
            // if (index < 3)
            return (
              <Box
                key={index}
                sx={{
                  flex: `0 0 ${100 / itemsPerView}%`, // responsive width
                  minWidth: '0',
                  padding: '10px',
                  boxSizing: 'border-box', // ✅ keeps padding inside width
                  opacity: idNum === index ? 1 : 0.5,
                }}
              >
                <Image
                  width={200}
                  height={200}
                  style={{ width: '100%', height: 'auto' }}
                  //   src={arr[+product].images[0].file}
                  src={img}
                  alt="image"
                />
              </Box>
            );
          })}
        </Box>
      </div>
    </div>
  );
};
