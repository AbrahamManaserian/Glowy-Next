'use client';

import { Grid, Typography } from '@mui/material';

export default function SpecialOffer() {
  return (
    <Grid sx={{ m: { xs: '80px 15px', sm: '90px 25px' } }} size={12} container justifyContent="space-between">
      <Typography
        sx={{ fontSize: { xs: '22px', sm: '32px' }, mb: '20px', flexGrow: 1 }}
        fontWeight={700}
        color="#2B3445"
      >
        Special Offer
      </Typography>
    </Grid>
  );
}
