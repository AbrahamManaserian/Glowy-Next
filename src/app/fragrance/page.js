'use client';

import SortBy from '@/components/fragrance/SortBy';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

export default function Page() {
  return (
    <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' } }} item container xs={12}>
      <Typography sx={{ fontSize: { xs: '20px', sm: '30px' }, fontWeight: 600, flexGrow: 1 }}>
        Fragrance
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <SortBy />
      </Box>
    </Grid>
  );
}
