'use client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Grid item container xs={12}>
      <Typography fontSize={30}>Home Page</Typography>
      <Link style={{ padding: '10px' }} href="/about">
        About
      </Link>
    </Grid>
  );
}
