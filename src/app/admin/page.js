'use client';

import { Grid } from '@mui/material';

export default function AdminPage() {
  return (
    <Grid
      sx={{
        p: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        boxSizing: 'border-box',
      }}
      container
      size={12}
    >
      {/* <Link href="/admin/add-product">Add Product</Link> */}
    </Grid>
  );
}
