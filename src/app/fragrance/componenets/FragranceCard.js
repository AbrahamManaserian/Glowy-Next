'use client';

import { Box, Grid, Rating, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function FragranceCard({ img, name, id }) {
  return (
    <Grid
      sx={{
        // height: { xs: '65vw', sm: '45vw', md: '30vw', lg: '20vw' },
        overflow: 'hidden',
        // borderBottom: 1,
        flexWrap: 'nowrap',
      }}
      size={{ xs: 6, sm: 4, md: 4, lg: 3 }}
      container
      direction={'column'}
    >
      <Link href={`/fragrance/${id}`}>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            height: { xs: '40vw', sm: '25vw', md: '20vw', lg: '13vw' },
            //   height: '180px',
            bgcolor: '#98a4cb16',
            boxSizing: 'border-box',
            borderRadius: '15px',
            width: '100%',
          }}
        >
          <Image
            width={200}
            height={200}
            style={{ overflow: 'hidden', width: '80%', height: 'auto' }}
            src={img}
            alt="image"
          />
        </Box>
      </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '15px' }}>
        <Typography sx={{ color: '#263045fb', fontSize: '14px', fontWeight: 500 }}>Armani</Typography>
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}> 100ml </Typography>
      </Box>
      <Typography sx={{ color: '#3c4354fb', fontSize: '14px' }}> Stronger With You Absolutely</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '5px' }}>
        <Typography sx={{ color: '#3c4354fb', fontWeight: 600, fontSize: 16 }}>$89</Typography>
        <Typography sx={{ textDecoration: 'line-through', color: 'gray', fontSize: 14 }}>$120</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: '5px' }}>
        <Rating name="read-only" value={1} readOnly size="small" />
        <Typography sx={{ color: '#3c4354a3', fontSize: 12, lineHeight: '12px' }}> 50 Sold </Typography>
      </Box>
    </Grid>
  );
}
