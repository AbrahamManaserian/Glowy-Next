'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavBar() {
  const pathname = usePathname();

  return (
    <>
      <Link
        style={{
          fontFamily: 'roboto',
          padding: '10px',
          margin: '5px',

          textDecoration: 'none',
          borderBottom: pathname.includes('add-product') ? 'solid 1px' : '',
          color: pathname.includes('add-product') ? '#f44336' : '#372f2eff',
        }}
        href="/admin/add-product"
      >
        Add Product
      </Link>
      <Link
        style={{
          textDecoration: 'none',
          color: pathname.includes('edit-product') ? '#f44336' : '#372f2eff',
          borderBottom: pathname.includes('edit-product') ? 'solid 1px' : '',
          fontFamily: 'roboto',
          padding: '10px',
          margin: '5px',
        }}
        href="/admin/edit-product"
      >
        Edit Product
      </Link>
      <Link
        style={{
          color: pathname.includes('manage') ? '#f44336' : '#372f2eff',
          borderBottom: pathname.includes('manage') ? 'solid 1px' : '',
          textDecoration: 'none',
          fontFamily: 'roboto',
          padding: '10px',
          margin: '5px',
        }}
        href="/admin/manage-suppliers"
      >
        Manage Suppliers
      </Link>
    </>
  );
}
