import { Box, LinearProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 10000 }}>
      <Box sx={{ width: '100%', position: 'absolute', top: 0 }}>
        <LinearProgress />
      </Box>
    </div>
  );
}
