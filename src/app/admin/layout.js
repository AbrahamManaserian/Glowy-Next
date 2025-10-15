import { Button, Grid } from '@mui/material';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { AdminProvider } from './components/AdminContext';

const getSuppliers = async () => {
  console.log('🔥 Fetching suppliers from Firestore...');
  try {
    const docRef = doc(db, 'details', 'suppliers');
    const docSnap = await getDoc(docRef);

    const data = docSnap.data().suppliers;

    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default async function AddminLayout({ children }) {
  const suppliers = await getSuppliers();

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
