'use client';

import { Grid } from '@mui/material';
import AddSupplier from './components/AddSupplier';
import EditSSupplier from './components/EditSupplier';
import { useEffect, useState } from 'react';

export default function ManageSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/admin');
      const data = await res.json();
      setSuppliers(data);
    };

    fetchProducts();
  }, []);

  console.log(suppliers);
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
