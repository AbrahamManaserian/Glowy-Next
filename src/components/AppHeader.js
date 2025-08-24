'use client';

import { Box, Collapse, Grid, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';

export default function AppHeader() {
  const [showMore, setShowMore] = useState(true);
  return (
    <Grid
      container
      justifyContent="space-between"
      xs={12} // ✅ use xs instead of size
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: '#2B3445',
        minHeight: '40px',
        alignItems: 'center',
        px: '20px',
      }}
    >
      <Grid
        container
        sx={{
          alignItems: 'center',
          // px: '20px',
          minHeight: '40px',
        }}
      >
        <Box
          sx={{
            height: '24px',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#D23F57',
            color: 'white',
            fontSize: '0.8125rem',
            fontFamily: 'Roboto, sans-serif', // ✅ make sure fallback is same
            px: '12px',
            fontWeight: 400,
            letterSpacing: '1px',
            mr: '10px',
          }}
        >
          HOT
        </Box>
        <Typography
          sx={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 100, // ✅ use 400 (guaranteed Roboto weight)
            letterSpacing: '1px',
          }}
        >
          Free Express Shipping
        </Typography>
      </Grid>
      <IconButton
        sx={{ transition: 'all 1s', display: { sm: 'block', md: 'none' }, p: 0 }}
        onClick={() => setShowMore(!showMore)}
      >
        <ExpandMoreIcon
          sx={{
            color: 'white',
            fontSize: 20,
            transition: 'transform 0.3s ease',
            transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)',
            // flexGrow: 10,
          }}
        />
      </IconButton>
      <Collapse in={showMore} timeout={300}>
        <Grid
          container
          sx={{
            alignItems: 'center',
            minHeight: '40px',
          }}
        >
          <PhoneIphoneIcon sx={{ color: 'white', fontSize: '20px' }} />
          <Typography
            sx={{
              fontSize: '13px',
              color: '#fff',
              fontWeight: 100, // ✅ use 400 (guaranteed Roboto weight)
              letterSpacing: '1px',
              mx: '10px',
            }}
          >
            +37477055777
          </Typography>
          <FacebookIcon sx={{ color: 'white', fontSize: '20px', mx: '10px' }} />
          <InstagramIcon sx={{ color: 'white', fontSize: '20px' }} />
        </Grid>
      </Collapse>
    </Grid>
  );
}
