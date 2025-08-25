'use client';

import { Box, Collapse, Grid, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareSharpIcon from '@mui/icons-material/ShareSharp';
import { useState } from 'react';
import useGetWindowDimensions from '@/hooks/useGetWindowSize';
import { ViberIcon } from './icons';

const hotBoxStyle = {
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
};

export default function AppHeader() {
  const [showMore, setShowMore] = useState(false);
  const windowDimensions = useGetWindowDimensions();
  console.log(windowDimensions);
  if (!windowDimensions)
    return (
      <Grid
        container
        justifyContent="space-between"
        xs={12}
        sx={{
          bgcolor: '#2B3445',
          minHeight: '40px',
          alignItems: 'center',
          minHeight: '40px',
          px: '15px',
        }}
      ></Grid>
    );

  return (
    <Grid
      container
      justifyContent="space-between"
      xs={12}
      sx={{
        bgcolor: '#2B3445',
        minHeight: '40px',
        alignItems: 'center',
        px: windowDimensions.width < 700 ? '10px' : '25px',
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
        <Box sx={hotBoxStyle}>HOT</Box>
        <Typography
          sx={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 100,
            letterSpacing: '1px',
          }}
        >
          Free Express Shipping
        </Typography>
      </Grid>
      <IconButton
        sx={{ transition: 'all 1s', display: windowDimensions.width < 700 ? 'block' : 'none', p: 0 }}
        onClick={() => setShowMore(!showMore)}
      >
        <ShareSharpIcon
          sx={{
            color: 'white',
            fontSize: 19,
            transition: 'transform 0.3s ease',
            transform: showMore ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </IconButton>
      <Collapse
        sx={{ width: windowDimensions.width < 700 ? '100%' : 'block' }}
        in={showMore || windowDimensions.width >= 700}
        timeout={300}
      >
        <Grid
          container
          sx={{
            alignItems: 'center',
            minHeight: '40px',
          }}
        >
          <a
            style={{ padding: 0, height: '20px', textDecoration: 'none', margin: '0 5px' }}
            target="_blank"
            href="viber://chat/?number=37455775311"
          >
            <ViberIcon />
          </a>
          <a
            style={{ padding: 0, height: '20px', textDecoration: 'none', margin: '0 5px' }}
            target="_blank"
            aria-label="Chat on WhatsApp"
            href="https://wa.me/37455775311"
          >
            <WhatsAppIcon sx={{ color: 'white', fontSize: '19px', bgcolor: 'green', borderRadius: '7px' }} />
          </a>
          <PhoneIphoneIcon sx={{ color: 'white', fontSize: '18px' }} />

          <a
            style={{ padding: 0, height: '20px', textDecoration: 'none', margin: '0 2px' }}
            href="tel:+37455775311"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#fff',
                fontWeight: 100, // ✅ use 400 (guaranteed Roboto weight)
                letterSpacing: '1px',

                // mx: '10px',
              }}
            >
              +37455775311
            </Typography>
          </a>
          <a
            style={{ padding: 0, height: '20px', margin: '0 10px' }}
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon sx={{ color: 'white', fontSize: '19px' }} />
          </a>
          <a
            style={{ padding: 0, height: '20px' }}
            href="https://www.instagram.com/glowy__cosmetic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon sx={{ color: 'white', fontSize: '19px' }} />
          </a>
        </Grid>
      </Collapse>
    </Grid>
  );
}
