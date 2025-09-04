'use client';

import useSWR from 'swr';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Grid, Typography } from '@mui/material';
import Image from 'next/image';

const fetchOrder = async () => {
  console.log('asd');
  const orderRef = doc(db, 'orders', '39');
  const docSnap = await getDoc(orderRef);
  if (docSnap.exists()) {
    return docSnap.data().items;
  }
  return [];
};

export default function AboutPage() {
  const {
    data: items,
    error,
    isLoading,
  } = useSWR('order-39', fetchOrder, {
    revalidateOnFocus: false, // don’t refetch when tab is focused
    revalidateIfStale: false, // don’t refetch if cached
  });

  if (isLoading && !items) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading data</Typography>;

  return (
    <Grid container xs={12} justifyContent="center" alignItems="center">
      <Typography variant="h5" gutterBottom>
        dfsd sale
      </Typography>

      {items?.map((item, index) => (
        <Image
          key={index}
          src={item.images[0].file}
          width={100}
          height={100}
          alt={item.code || ''}
          style={{
            width: 'calc(50% - 30px)',
            height: 'auto',
            padding: '10px',
            margin: '5px',
            backgroundColor: 'red',
          }}
        />
      ))}
    </Grid>
  );
}
