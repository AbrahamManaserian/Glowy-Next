export const dynamic = 'force-dynamic';

import { Grid } from '@mui/material';
import Link from 'next/link';

import { AdminProvider } from './components/AdminContext';

export default async function AddminLayout({ children }) {
  // const suppliers = await getSuppliers();
  const res = await fetch('https://glowy-store-next.netlify.app/api/admin');
  const suppliers = await res.json();
  // console.log(resData);
  // console.log(suppliers);

  return (
    <Grid alignItems={'flex-start'} justifyContent={'center'} size={12} container>
      <Link className="bar-link" href="/admin/add-product">
        Add Product
      </Link>
      <Link className="bar-link" href="/admin/change-product">
        Change Product
      </Link>
      <Link className="bar-link" href="/admin/manage-suppliers">
        Manage Suppliers
      </Link>
      <AdminProvider data={{ suppliers }}>{children}</AdminProvider>
    </Grid>
  );
}
