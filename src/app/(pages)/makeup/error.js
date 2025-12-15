'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PageError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('Page-level error:', error);
    router.replace('/'); // redirect home
  }, [error, router]);

  return null; // nothing visible while redirecting
}
