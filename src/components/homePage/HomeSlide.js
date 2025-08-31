'use client';

import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';

const images = [
  '/images/ov4x8tqv11m5xi1kcm868rz43f7isui0.webp',
  '/images/06lT4BbLdxYjqF7EjvbnSXT9ILosjlIZh539zWgD.webp',
  '/images/w536b1l7mqqhu3f49c175z70yk5ld05f.webp',
  '/images/w33w5wkxtoc8ine2mnc4pbfwqt40rfsh.webp',
];

export default function HomeSlide() {
  const [item, setitem] = useState(0);
  const handleClick = (index) => {
    setitem(index);
  };

  return (
    <div>
      {images.map((image, index) => {
        return (
          <div
            key={index}
            style={{
              opacity: index === item ? 1 : 0,
              visibility: index === item ? 'visible' : 'hidden',
              position: index === item ? 'relative' : 'absolute',
              transition: 'opacity 1.5s ease',
              width: '100%',
            }}
          >
            <Grid
              size={12}
              container
              sx={{ bgcolor: '#d2cccc17', borderRadius: '15px', m: { xs: '10px', sm: '40px 25px' } }}
            >
              <Grid
                // alignItems="baseline"
                p={{ xs: '20px', sm: '50px' }}
                size={{ xs: 12, sm: 6 }}
                container
                direction="column"
                justifyContent="center"
                alignItems={{ xs: 'center', sm: 'baseline' }}
                sx={{ order: { xs: 1, sm: 0 } }}
              >
                <Typography
                  sx={{
                    color: '#2B3445',
                    fontSize: { xs: '35px', sm: '50px' },
                    fontWeight: 900,
                    maxWidth: '400px',
                    textShadow: '0 0 1px black, 0 0 1px black',
                    lineHeight: { xs: '40px', sm: '60px' },
                    textAlign: { xs: 'center', sm: 'start' },
                    // fontVariationSettings: "'wght' 1000",
                  }}
                >
                  50% Off For Your First Shopping
                </Typography>
                <Typography
                  sx={{
                    textAlign: { xs: 'center', sm: 'start' },
                    color: '#2B3445',
                    mt: '15px',
                    fontSize: { xs: '15px', sm: '18px' },
                    fontWeight: 100,
                  }}
                >
                  Get Free Shipping on all orders over $99.00
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'capitalize',
                    mt: '25px',
                    px: '30px',
                    bgcolor: '#2B3445',
                    borderRadius: '7px',
                  }}
                >
                  Buy Now
                </Button>
              </Grid>
              <Grid
                sx={{ order: { xs: 0, sm: 1 }, overflow: 'hidden', height: '55vh' }}
                // pb={{ xs: 0, sm: '50px' }}
                size={{ xs: 12, sm: 6 }}
                container
                alignItems="center"
                justifyContent="center"
                alignContent="center"
              >
                <Box sx={{ width: { xs: '85%', sm: '65%' } }}>
                  <img src={image} style={{ width: '100%', height: 'auto' }} />
                </Box>
              </Grid>
              <Grid
                p={{ xs: '0 20px 20px 20px', sm: '0 50px 50px 50px' }}
                sx={{ order: { xs: 3, sm: 1 } }}
                size={12}
                container
                // alignContent="center"
                justifyContent="center"
              >
                <Box sx={{ display: 'flex' }}>
                  {images.map((it, index) => (
                    <Box
                      onClick={() => handleClick(index)}
                      sx={{
                        flexShrink: 0,
                        height: '10px',
                        width: item === index ? '20px' : '10px',
                        bgcolor: '#f44336',
                        borderRadius: '20px', // pill look when stretched
                        transition: 'width 0.5s ease',
                        mr: '10px',
                        cursor: 'pointer',
                      }}
                      key={index}
                    ></Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </div>
        );
      })}
    </div>
  );
}
