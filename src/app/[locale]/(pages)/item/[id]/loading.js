'use client';

import { Box, Grid, Skeleton } from '@mui/material';
import { useEffect } from 'react';

export default function Loading() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid
      sx={{
        m: { xs: '0 15px 60px 15px', sm: '0 25px 60px 25px' },
        minHeight: '100vh', // Ensure it takes full height
      }}
      container
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1150px',
          margin: '0 auto',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column - Image Skeleton */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              height: { xs: '300px', sm: '400px', md: '500px' },
              borderRadius: '10px',
            }}
          />
          <Box sx={{ display: 'flex', gap: '10px', mt: '10px' }}>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={80}
                height={80}
                sx={{ borderRadius: '8px' }}
              />
            ))}
          </Box>
        </Grid>

        {/* Right Column - Details Skeleton */}
        <Grid
          sx={{ mt: '25px', position: 'relative' }}
          pl={{ xs: 0, sm: 0, md: '60px' }}
          size={{ xs: 12, sm: 12, md: 6 }}
          container
          direction={'column'}
          alignItems={'flex-start'}
        >
          {/* In Stock Badge */}
          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '7px', mb: 2 }} />

          {/* Brand */}
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />

          {/* Model/Type */}
          <Skeleton variant="text" width="70%" height={30} sx={{ mb: 2 }} />

          {/* Size */}
          <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />

          {/* Rating */}
          <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />

          {/* Price */}
          <Skeleton variant="text" width={100} height={40} sx={{ mb: 3 }} />

          {/* Description */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="95%" />
          </Box>

          {/* Notes */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>

          {/* Options */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant="rounded" width={80} height={36} sx={{ borderRadius: '8px' }} />
            <Skeleton variant="rounded" width={80} height={36} sx={{ borderRadius: '8px' }} />
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Skeleton variant="rounded" width={120} height={50} sx={{ borderRadius: '10px' }} />
            <Skeleton variant="rounded" width="100%" height={50} sx={{ borderRadius: '10px' }} />
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
}
