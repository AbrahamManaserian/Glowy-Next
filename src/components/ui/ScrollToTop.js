'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if navigation was back/forward
    const navEntries = performance.getEntriesByType('navigation');
    const navType = navEntries[0]?.type;
    // console.log(navEntries[0]);
    if (navType !== 'back_forward' && navType !== 'reload') {
      // Only scroll on fresh navigation (Link click, reload, etc.)
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  return null;
}
