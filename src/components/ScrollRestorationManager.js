'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function ScrollRestorationManager({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Save current scroll position for this route
    const saveScrollPosition = () => {
      const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      positions[pathname + searchParams.toString()] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
    };

    // Restore scroll position if available
    const restoreScrollPosition = () => {
      const positions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      const savedPosition = positions[pathname + searchParams.toString()];

      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', saveScrollPosition);
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [pathname, searchParams]);

  return <> {children} </>;
}
