'use client';

import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import SortBy from './componenets/SortBy';

export default function FragrancePage() {
  return (
    <Grid sx={{ m: { xs: '50px 15px', sm: '90px 35px' } }} size={12}>
      <Box
        sx={{
          display: 'flex',
          maxWidth: '1200px',

          margin: '0 auto', // center horizontally
          px: 2, // optional horizontal padding for small screens
        }}
      >
        <Typography sx={{ fontSize: { xs: '20px', sm: '30px' }, fontWeight: 600, flexGrow: 1 }}>
          Fragrance
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <SortBy />
        </Box>
      </Box>
    </Grid>
  );
}
