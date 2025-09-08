'use client';

import { Box, Grid, Typography } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { DeliveryIcon, PaymentIcon, ViberIcon } from '../icons';
import { LogoHome } from '../appBar/AppBarMenu';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function Footer() {
  return (
    <Grid
      size={12}
      container
      sx={{ bgcolor: '#23233fee', p: { xs: '15px 15px 0 15px', sm: '25px 25px 0 25px' } }}
      spacing={2}
    >
      <Grid
        spacing={0}
        size={{ xs: 12, sm: 12, md: 3 }}
        container
        direction={'column'}
        alignItems={'flex-start'}
      >
        <LogoHome />
        <Typography
          sx={{
            fontSize: '14px',
            color: 'white',
            fontWeight: 300,
            lineHeight: '25px',
            m: '17px 0 15px 8px',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida. Sit diam
          duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <PaymentIcon />
          <Typography
            sx={{
              fontSize: '16px',
              color: 'white',
              lineHeight: '25px',
              m: '0 0 2px 15px',
            }}
          >
            Safe Payment
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: '10px' }}>
          <DeliveryIcon />
          <Typography
            sx={{
              fontSize: '16px',
              color: 'white',
              lineHeight: '25px',
              ml: '15px',
            }}
          >
            Fast Deelivery
          </Typography>
        </Box>
      </Grid>

      <Grid
        spacing={0}
        size={{ xs: 12, sm: 12, md: 3 }}
        container
        direction={'column'}
        alignItems={'flex-start'}
        alignContent={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        borderTop={{ xs: 'solid 0.1px #6d6d71ee', sm: 'solid 0px #6d6d71ee' }}
        pt={'10px'}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: 500, mb: '15px', color: 'white' }}>
          About Us
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>Story</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Our Goals
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>Stores</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Terms & Conditions
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Privacy Policy
        </Typography>
      </Grid>
      <Grid
        spacing={0}
        size={{ xs: 12, sm: 12, md: 3 }}
        container
        direction={'column'}
        alignItems={'flex-start'}
        alignContent={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        borderTop={{ xs: 'solid 0.1px #6d6d71ee', sm: 'solid 0px #6d6d71ee' }}
        pt={'10px'}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: 500, mb: '15px', color: 'white' }}>
          Customer Care
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Help Center
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Track Your Order
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>Stores</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>
          Returns & Refunds
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '5px', color: 'white' }}>FAQ</Typography>
      </Grid>
      <Grid
        pt={'10px'}
        spacing={0}
        size={{ xs: 12, sm: 12, md: 3 }}
        container
        direction={'column'}
        alignItems={'flex-start'}
        alignContent={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
        borderTop={{ xs: 'solid 0.1px #6d6d71ee', sm: 'solid 0px #6d6d71ee' }}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: 500, mb: '15px', color: 'white' }}>
          Contact Us
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '10px', color: 'white' }}>
          70 Washington Square South, New York, NY 10012, United States
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 300, mb: '10px', color: 'white' }}>
          Email: info@glowy.am
        </Typography>

        <a
          style={{ padding: 0, height: '20px', textDecoration: 'none', marginBottom: '10px' }}
          href="tel:+37455775311"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 300,

              color: 'white',
            }}
          >
            Phone: +37455775311
          </Typography>
        </a>
        <Grid
          container
          sx={{
            alignItems: 'center',
            // minHeight: '40px',
          }}
        >
          <a
            style={{ padding: 0, height: '20px', textDecoration: 'none', marginRight: '10px' }}
            target="_blank"
            href="viber://chat/?number=37455775311"
          >
            <ViberIcon />
          </a>
          <a
            style={{ padding: 0, height: '20px', textDecoration: 'none', margin: '0 10px' }}
            target="_blank"
            aria-label="Chat on WhatsApp"
            href="https://wa.me/37455775311"
          >
            <WhatsAppIcon sx={{ color: 'white', fontSize: '19px', bgcolor: 'green', borderRadius: '7px' }} />
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
            style={{ padding: 0, height: '20px', marginLeft: '10px' }}
            href="https://www.instagram.com/glowy__cosmetic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon sx={{ color: 'white', fontSize: '19px' }} />
          </a>
        </Grid>
      </Grid>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: '20px 0',
          mt: '30px',
          borderTop: 'solid 0.1px #6d6d71ee',
          // flexWrap: 'nowrap',
        }}
      >
        <CopyrightIcon
          sx={{ color: 'white', fontSize: '11px', m: { xs: '4px 3px 0 0', sm: '6px 3px 0 0' } }}
        />

        <Typography
          sx={{
            fontSize: { xs: '13px', sm: '15px' },
            color: 'white',
            fontWeight: 400,

            textWrap: 'wrap',
            textAlignLast: 'center',
          }}
        >
          2025 www.glowy.am, All rights reserved.
        </Typography>
      </Box>
    </Grid>
  );
}
