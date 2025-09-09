'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const isPop = useRef(false);
  console.log(isPop);

  useEffect(() => {
    const handlePopState = () => {
      isPop.current = true; // user went back/forward
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!isPop.current) {
      // normal link navigation → scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    isPop.current = false; // reset after each navigation
  }, [pathname]);

  return null;
}
