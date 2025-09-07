'use client';

import { Box, Grid, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { DeliveryIcon, PaymentIcon } from '../icons';
import { LogoHome } from '../appBar/AppBarMenu';

export default function Footer() {
  return (
    <Grid mb="100px" size={12} container sx={{ bgcolor: '#23233fee', p: { xs: '15px', sm: '25px' } }}>
      <Grid
        size={{ xs: 12, sm: 3 }}
        container
        direction={'column'}
        alignItems={'flex-start'}
        alignContent={'flex-end'}
      >
        <LogoHome />
        <Typography
          sx={{
            fontSize: '14px',
            color: 'white',
            fontWeight: 300,
            lineHeight: '25px',
            my: '15px',
            ml: '8px',
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
              ml: '15px',
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
    </Grid>
  );
}
