'use client';

import { Box, Button, Grid, Typography, Rating } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ShoppingBasketIcon } from '@/_components/icons';
import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { useGlobalContext } from '@/app/GlobalContext';
import { handleClickAddToCart } from '@/_components/carts/ItemCart';
import { useTranslations } from 'next-intl';

export default function FlashDeals({ flashDeals = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [itemsPerView, setItemsPerView] = useState(4);
  const router = useRouter();
  const { cart, setCart } = useGlobalContext();
  const t = useTranslations('HomePage.flashDeals');

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 550) {
        setItemsPerView(1);
      } else if (window.innerWidth >= 550 && window.innerWidth < 750) {
        setItemsPerView(2);
      } else if (window.innerWidth >= 750 && window.innerWidth < 1000) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  if (!flashDeals || flashDeals.length === 0) return null;

  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container justifyContent="space-between">
      <div
        style={{
          position: 'relative',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography
            sx={{ fontSize: { xs: '22px', sm: '32px' }, flexGrow: 1 }}
            fontWeight={700}
            color="#2B3445"
          >
            {t('title')}
          </Typography>
          <ChevronLeftIcon
            onClick={scrollPrev}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
              mr: '5px',
            }}
          />
          <NavigateNextIcon
            onClick={scrollNext}
            sx={{
              color: '#747982ff',
              fontSize: '30px',
              cursor: 'pointer',
            }}
          />
        </Box>

        <div ref={emblaRef} style={{ overflow: 'hidden' }}>
          <Box sx={{ display: 'flex' }}>
            {flashDeals.map((item, index) => (
              <Box
                key={item.id || index}
                sx={{
                  flex: `0 0 ${100 / itemsPerView}%`,
                  minWidth: '0',
                  padding: '10px',
                  boxSizing: 'border-box',
                }}
              >
                <Box
                  onClick={() => router.push(`/item/${item.id}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: { xs: '400px', sm: '470px' },
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    border: '1px solid #e0e0e0',
                    p: '10px',
                    borderRadius: '15px',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s ease',
                    ':hover': {
                      boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '250px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.mainImage?.url || item.mainImage?.file || '/images/placeholder.jpg'}
                      alt={item.fullName || item.title}
                      width={300}
                      height={300}
                      style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      my: '10px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '15px', sm: '17px' },
                        color: '#2B3445',
                        textAlign: 'center',
                        lineHeight: '22px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        my: 1,
                      }}
                    >
                      {item.fullName || item.title}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: { xs: '15px', sm: '17px' },
                          color: '#e65100',
                          textAlign: 'center',
                          fontWeight: 700,
                        }}
                      >
                        ֏{item.price?.toLocaleString()}
                      </Typography>
                      {/* If you have a discount price, show it here */}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <Rating value={5} readOnly size="small" />
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingBasketIcon size={20} color="white" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickAddToCart(item, 1, setCart, cart);
                    }}
                    sx={{
                      textTransform: 'none',
                      width: '100%',
                      bgcolor: '#2B3445',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      py: 1,
                      mt: 1,
                      transition: 'all 0.2s ease',
                      ':hover': {
                        bgcolor: '#1a202c',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {t('addToCart')}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      </div>
    </Grid>
  );
}
