'use client';

import { Box, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export const ProductImageComp = ({ images, idNum }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [emblaRefBig, emblaApiBig] = useEmblaCarousel({ loop: false, align: 'center', startIndex: 0 });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center', dragFree: true });

  const scrollPrev = useCallback(() => {
    return emblaApiBig && emblaApiBig.scrollPrev();
  }, [emblaApiBig]);

  useEffect(() => {
    if (!emblaApiBig || !emblaApi) return;
    if (emblaApiBig.selectedScrollSnap() - emblaApi.selectedScrollSnap() > 2) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
  }, [imgIndex]);

  useEffect(() => {
    if (!emblaApiBig) return;
    emblaApiBig.on('select', (EmblaEventType) => {
      // emblaApi.scrollTo(emblaApiBig.selectedScrollSnap());
      setImgIndex(emblaApiBig.selectedScrollSnap());
    });
  }, [emblaApiBig]);

  const scrollNext = useCallback(() => emblaApiBig && emblaApiBig.scrollNext(), [emblaApiBig]);

  const handleClickCarouselScroll = (action, index) => {
    if (index || index === 0) {
      emblaApiBig.scrollTo(index);
      setImgIndex(index);
    } else {
      if (action === 'next') {
        if (imgIndex === images.length - 1) return;

        setImgIndex(imgIndex + 1);
        scrollNext();
      } else {
        if (imgIndex === 0) return;

        setImgIndex(imgIndex - 1);
        scrollPrev();
      }
    }
  };

  return (
    <Grid
      sx={{ borderRadius: '25px', mt: '20px' }}
      size={{ xs: 12, sm: 12, md: 6 }}
      container
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '5px', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <ChevronLeftIcon
            onClick={() => handleClickCarouselScroll()}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              mr: '5px',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              left: '10px',
              WebkitTapHighlightColor: 'transparent',
              zIndex: 10,
            }}
          />
          <NavigateNextIcon
            onClick={() => handleClickCarouselScroll('next')}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              position: 'absolute',
              top: 'calc(50% - 10px)',
              right: '10px',
              zIndex: 10,
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
              ref={emblaRefBig}
              style={{
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                {images.map((img, index) => {
                  //   if (index < 3)
                  return (
                    <div
                      key={index}
                      style={{
                        flex: `0 0 ${100}%`,
                        boxSizing: 'border-box',
                        padding: '5px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          boxSizing: 'border-box', // ✅ keeps padding inside width
                          cursor: 'pointer',
                          borderRadius: '20px',
                          transition: ' all 0.5s ease',
                          backgroundColor: '#98a4cb16',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          width={200}
                          height={200}
                          style={{ width: '100%', height: 'auto' }}
                          src={img.file}
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

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ width: { xs: '95%', sm: '60%' }, position: 'relative' }}>
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
                  //   if (index < 3)
                  return (
                    <div
                      key={index}
                      onClick={() => handleClickCarouselScroll('', index)}
                      style={{
                        flex: `0 0 20%`,
                        boxSizing: 'border-box',
                        padding: '5px',
                      }}
                    >
                      <Box
                        sx={{
                          WebkitTapHighlightColor: 'transparent',
                          boxSizing: 'border-box', // ✅ keeps padding inside width
                          display: 'flex',
                          alignItems: 'center',
                          opacity: imgIndex === index ? 1 : 0.5,
                          border: 1.5,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          borderColor: imgIndex === index ? '#ff3d00' : 'rgba(216, 66, 21, 0)',
                          transition: ' all 0.5s ease',
                          overflow: 'hidden',
                          p: '5px',
                        }}
                      >
                        <Image
                          width={200}
                          height={200}
                          style={{ width: '100%', height: 'auto', overflow: 'hidden', objectFit: 'contain' }}
                          //   src={arr[+product].images[0].file}
                          src={img.file}
                          alt="image"
                        />
                      </Box>
                    </div>
                  );
                })}
              </Box>
            </div>
          </div>
        </Box>
      </Box>
    </Grid>
  );
};
