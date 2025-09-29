// app/ScrollRestorationClient.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ScrollRestoration } from 'next-scroll-restoration';

export default function ClientSideScrollRestorer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // On every search param change, scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, searchParams.toString()]);

  return <ScrollRestoration />;
}
