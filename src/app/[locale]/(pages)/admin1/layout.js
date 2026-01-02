export const dynamic = 'force-dynamic';

import { Grid } from '@mui/material';
import Link from 'next/link';

import { AdminProvider } from './_components/AdminContext';
import AdminNavBar from './_components/AdminNavBar';

export default async function AddminLayout({ children }) {
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/admin`, {
    cache: 'no-store', // avoids caching issues
    // cache: 'force-cache', // default
    // next: { revalidate: 360 },
  });

  const data = await res.json();
  // const data = {};

  return (
    <Grid alignItems={'flex-start'} justifyContent={'center'} size={12} container>
      <AdminNavBar />
      <AdminProvider data={{ ...data }}>{children}</AdminProvider>
    </Grid>
  );
}
