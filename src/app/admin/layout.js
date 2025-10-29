export const dynamic = 'force-dynamic';

import { Grid } from '@mui/material';
import Link from 'next/link';

import { AdminProvider } from './components/AdminContext';
import AdminNavBar from './components/AdminNavBar';

export default async function AddminLayout({ children }) {
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  
  const res = await fetch(`${baseUrl}/api/admin`, {
    cache: 'no-store', // avoids caching issues
  });

  const data = await res.json();

  return (
    <Grid alignItems={'flex-start'} justifyContent={'center'} size={12} container>
      <AdminNavBar />
      <AdminProvider data={{ ...data }}>{children}</AdminProvider>
    </Grid>
  );
}
