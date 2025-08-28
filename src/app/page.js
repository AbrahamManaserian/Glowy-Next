'use client';

import { Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Link href="/about">
        <Button>About</Button>
      </Link>
    </Grid>
  );
}
