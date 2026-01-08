import { Box, Dialog, LinearProgress } from '@mui/material';

export default function Loading() {
  return (
    <Dialog
      fullScreen
      open={true}
      // onClose={handleClose}
    >
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    </Dialog>
  );
}
