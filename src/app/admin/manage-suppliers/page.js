'use client';

import { Grid } from '@mui/material';
import AddSupplier from './components/AddSupplier';
import EditSSupplier from './components/EditSupplier';

export default function ManageSuppliersPage() {
  return (
    <Grid
      minHeight={'100vh'}
      size={12}
      container
      alignContent={'flex-start'}
      mt={'20px'}
      justifyContent={'center'}
      p={{ xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' }}
      spacing={10}
    >
      <AddSupplier />
      <EditSSupplier />
    </Grid>
  );
}
