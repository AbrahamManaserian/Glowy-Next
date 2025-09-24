'use client';

import { Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Grid container xs={12} direction="column" minHeight="320vh">
      <Typography>User Page</Typography>
      <Link href="/user/1">
        <Button>1</Button>
      </Link>
      <Link href="/user/2">
        <Button>2</Button>
      </Link>
      <Link href="/user/3">
        <Button>2</Button>
      </Link>
      <Link href="/user/4/4">
        <Button>4</Button>
      </Link>
    </Grid>
  );
}
