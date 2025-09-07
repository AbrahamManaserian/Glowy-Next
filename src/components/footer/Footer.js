'use client';

import { Grid } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export default function Footer() {
  return (
    <Grid mb="100px" size={12} container>
      <Grid sx={{ p: { xs: '80px 15px', sm: '35px 65px' }, bgcolor: '#ceced11e' }} size={12} container>
        <LocalShippingOutlinedIcon sx={{ fontSize: '30px' }} />
      </Grid>
    </Grid>
  );
}
