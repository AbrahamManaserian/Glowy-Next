'use client';

import { Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Grid container xs={12} direction="column">
      <Link href="/about">
        <Button>About</Button>
      </Link>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
      <Typography fontSize={60}>Home Page</Typography>
    </Grid>
  );
}
