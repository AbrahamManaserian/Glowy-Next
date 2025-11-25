'use client';

import { Box, Grid, Rating, Typography } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';


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

export default function PopularProducts() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleClick = (i) => setTabIndex(i);
  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container alignContent={'flex-start'}>
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px', flexGrow: 1 }}
        fontWeight={700}
        color="#2B3445"
      >
        Popular Products
      </Typography>
      <Grid size={12} container>
        {['Fragrance', 'Makeup', 'Brands'].map((item, index) => {
          return (
            <Typography
              key={index}
              onClick={() => handleClick(index)}
              sx={{
                color: index === tabIndex ? '#212122da' : '#21212295',
                fontSize: '14px',
                fontWeight: tabIndex === index ? 500 : 400,
                // mr: '35px',
                cursor: 'pointer',
                width: '100px',
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
          transform: `translateX(${tabIndex * 100}px)`,
          transition: 'transform 0.5s ease',
        }}
      ></Box>
      <Grid mt="25px" size={12} container spacing={2}>
        {images.map((item, index) => {
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '110px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  padding: '5px',
                  boxSizing: 'border-box',
                  bgcolor: '#d2cccc30',
                  borderRadius: '10px',
                  width: '90px',
                  height: '90px',
                  overflow: 'hidden',
                }}
              >
                <Image src={item} alt="" width={200} height={200} style={{ width: '100%', height: 'auto' }} />
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
                    Armani Stronger With yuo Absolutely
                  </Typography>
                </div>
                <Rating name="read-only" value={5} readOnly size="small" />
                <Typography sx={{ fontSize: '12px', color: '#19181886' }}>50 Sold</Typography>
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
                  $ 230.00
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}
