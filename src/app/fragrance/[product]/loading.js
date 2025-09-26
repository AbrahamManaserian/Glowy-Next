import { Box, LinearProgress } from '@mui/material';

export default function Loading() {
  return (
    <div style={{ minHeight: '30vh' }}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    </div>
  );
}
