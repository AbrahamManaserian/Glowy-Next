'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Box, Button, Grid, Typography, Skeleton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useRouter } from 'next/navigation';

export default function EmblaHomeSlide({ initialSlides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [slides, setSlides] = useState(initialSlides);
  const [loading, setLoading] = useState(initialSlides.length === 0);
  const router = useRouter();

  useEffect(() => {
    if (initialSlides.length > 0) {
      setLoading(false);
      return;
    }

    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/slides');
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [initialSlides.length]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (loading) {
    return (
      <Box sx={{ m: { xs: '15px', sm: '40px 25px' }, borderRadius: '15px', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (slides.length === 0) {
    return null; // Or return a default slide/placeholder
  }

  return (
    <Box sx={{ position: 'relative', m: { xs: '15px', sm: '40px 25px' } }}>
      <div className="embla" ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '15px' }}>
        <div className="embla__container" style={{ display: 'flex' }}>
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index} style={{ flex: '0 0 100%', minWidth: 0 }}>
              <Grid container>
                <Grid
                  p={{ xs: '20px', md: '50px' }}
                  size={{ xs: 12, md: 6 }}
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems={{ xs: 'center', md: 'baseline' }}
                  sx={{
                    order: { xs: 1, md: 0 },
                    bgcolor: '#d2cccc17',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#2B3445',
                      fontSize: { xs: '35px', md: '50px' },
                      fontWeight: 900,
                      maxWidth: '400px',
                      textShadow: '0 0 1px black, 0 0 1px black',
                      lineHeight: { xs: '40px', md: '60px' },
                      textAlign: { xs: 'center', md: 'start' },
                    }}
                  >
                    50% Off For Your First Shopping
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: { xs: 'center', md: 'start' },
                      color: '#2B3445',
                      mt: '15px',
                      fontSize: { xs: '20px', md: '24px' },
                      fontWeight: 700,
                    }}
                  >
                    {slide.fullName || slide.title}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: { xs: 'center', md: 'start' },
                      color: '#2B3445',
                      mt: '5px',
                      fontSize: { xs: '15px', md: '18px' },
                      fontWeight: 100,
                    }}
                  >
                    {slide.description || 'Get Free Shipping on all orders over $99.00'}
                  </Typography>

                  {/* Price Section */}
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#e65100', lineHeight: 1 }}>
                      ֏{(slide.price / 2)?.toLocaleString()}
                    </Typography>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          textDecoration: 'line-through',
                          color: '#9da4b0',
                          mb: -0.5,
                        }}
                      >
                        ֏{slide.price?.toLocaleString()}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#e65100',
                        }}
                      >
                        -50% OFF
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    onClick={() => router.push(`/item/${slide.id}`)}
                    variant="contained"
                    sx={{
                      textTransform: 'capitalize',
                      mt: '25px',
                      px: '30px',
                      bgcolor: '#2B3445',
                      borderRadius: '7px',
                      boxShadow: 'none',
                      ':hover': {
                        bgcolor: '#2B3445',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    View Deal
                  </Button>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: { xs: 'auto', md: 'auto' },
                    order: { xs: 0, md: 1 },
                  }}
                >
                  <Box
                    component="img"
                    src={slide.image || slide.imageUrl}
                    alt={slide.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: { xs: '400px', md: '500px' },
                      objectFit: 'contain',
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        onClick={scrollPrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          minWidth: 'auto',
          p: 1,
          bgcolor: 'rgba(255,255,255,0.5)',
          borderRadius: '50%',
          ':hover': { bgcolor: 'rgba(255,255,255,0.8)' },
          zIndex: 2,
        }}
      >
        <ChevronLeftIcon sx={{ color: '#2B3445' }} />
      </Button>
      <Button
        onClick={scrollNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          minWidth: 'auto',
          p: 1,
          bgcolor: 'rgba(255,255,255,0.5)',
          borderRadius: '50%',
          ':hover': { bgcolor: 'rgba(255,255,255,0.8)' },
          zIndex: 2,
        }}
      >
        <NavigateNextIcon sx={{ color: '#2B3445' }} />
      </Button>
    </Box>
  );
}
