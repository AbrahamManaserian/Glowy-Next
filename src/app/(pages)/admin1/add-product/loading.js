import { Box, LinearProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    </div>
  );
}
