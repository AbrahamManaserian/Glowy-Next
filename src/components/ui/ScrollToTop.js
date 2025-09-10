'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const isPop = useRef(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'; // let browser restore on refresh/back/forward
    }

    const handlePopState = () => {
      isPop.current = true; // back/forward navigation
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      // First render after refresh → do nothing
      isInitialLoad.current = false;
      return;
    }

    if (!isPop.current) {
      // Link navigation only → scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    isPop.current = false; // reset flag
  }, [pathname]);

  return null;
}
