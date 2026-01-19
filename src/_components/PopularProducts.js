'use client';

import { Box, Grid, Rating, Typography } from '@mui/material';
import { useState, useRef, useEffect, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function PopularProducts({ popularProducts }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabPositions, setTabPositions] = useState([]);
  const [tabWidths, setTabWidths] = useState([]);
  const router = useRouter();
  const t = useTranslations('HomePage.popularProducts');
  const handleClick = (i) => setTabIndex(i);

  const categories = ['fragrance', 'makeup', 'hair'];
  const currentCategory = categories[tabIndex];
  const products = popularProducts?.[currentCategory] || [];

  const tabLabels = useMemo(() => [t('fragrance'), t('makeup'), t('hair')], []);
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    if (tabContainerRef.current) {
      const containerRect = tabContainerRef.current.getBoundingClientRect();
      const positions = tabRefs.current.map((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          return rect.left - containerRect.left;
        }
        return 0;
      });
      const widths = tabRefs.current.map((ref) => (ref ? ref.offsetWidth : 0));
      setTabPositions(positions);
      setTabWidths(widths);
    }
  }, []); // Run only on mount

  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container alignContent={'flex-start'}>
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px', flexGrow: 1 }}
        fontWeight={700}
        color="#2B3445"
      >
        {t('title')}
      </Typography>
      <Grid size={12} container ref={tabContainerRef}>
        {tabLabels.map((item, index) => {
          return (
            <Typography
              key={index}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => handleClick(index)}
              sx={{
                color: index === tabIndex ? '#212122da' : '#21212295',
                fontSize: '14px',
                fontWeight: tabIndex === index ? 500 : 400,
                mr: '10px',
                cursor: 'pointer',
              }}
            >
              {item}
            </Typography>
          );
        })}
      </Grid>
      <Box
        sx={{
          mt: '10px',

          width: '50px',
          borderBottom: 2,
          display: 'block',
          transform: `translateX(${tabPositions[tabIndex] + tabIndex * 10 || 0}px)`,
          transition: 'transform 0.5s ease, width 0.5s ease',
        }}
      ></Box>
      <Grid mt="25px" size={12} container spacing={2}>
        {products.map((item, index) => {
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={item.id || index}
              onClick={() => router.push(`/item/${item.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '110px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  padding: '0px',
                  boxSizing: 'border-box',
                  bgcolor: '#d2cccc30',
                  borderRadius: '10px',
                  width: '90px',
                  height: '90px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.smallImage?.url || item.smallImage?.file || '/images/placeholder.jpg'}
                  alt={item.title || 'Product'}
                  width={200}
                  height={200}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                  height: '80px',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  ml: '15px',
                }}
              >
                <div>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '240px',
                      color: '#191818f6',
                    }}
                  >
                    {item.fullName || item.title}
                  </Typography>
                </div>
                <Rating name="read-only" value={item.rating || 5} readOnly size="small" />
                {/* <Typography sx={{ fontSize: '12px', color: '#19181886' }}>{item.sold || 0} Sold</Typography> */}
                <Typography
                  sx={{
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '220px',
                    fontWeight: 500,
                  }}
                >
                  ֏{item.price?.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}
