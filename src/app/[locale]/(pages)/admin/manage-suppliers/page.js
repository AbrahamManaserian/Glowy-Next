'use client';

import { db } from '@/firebase';
import { Grid, Typography } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';

export default function ManageSuppliersPage() {
  async function name(params) {
    const docRef = doc(db, 'allProducts', '000001');
    const docSnap = await getDoc(docRef);
    console.log('docSnap.data()', docSnap.data());
  }

  return (
    <Grid size="12" padding={'10px'}>
      <Typography onClick={name}>Manage suppliers</Typography>
    </Grid>
  );
}

