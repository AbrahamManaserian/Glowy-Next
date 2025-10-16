'use client';

import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Home() {
  const [suppliers, setSuppliers] = useState();
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/suppliers');
      const data = await res.json();
      setSuppliers(data);
    };

    fetchProducts();
  }, []);
  console.log(suppliers);
  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography>Favorite Page</Typography>
      {suppliers &&
        Object.keys(suppliers).map((key, i) => {
          return <Typography key={i}>{suppliers[key].name}</Typography>;
        })}
    </Grid>
  );
}
