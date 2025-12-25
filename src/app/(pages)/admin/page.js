'use client';

import { Grid, Typography } from '@mui/material';

export default function AdminPage() {
  return (
    <Grid size="12" padding={'10px'}>
      <Typography variant="h4" gutterBottom>
        Admin-Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to the admin panel.
      </Typography>
    </Grid>
  );
}
