'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CustomScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef(null);

  useEffect(() => {
    // Default scroll restoration to auto
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }

    function handlePopState() {
      var lastUrl = lastUrlRef.current;
      if (lastUrl && lastUrl.includes('?')) {
        // Coming back from a page with search params
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0); // scroll to top

        // Restore auto for future navigations
        requestAnimationFrame(function () {
          window.history.scrollRestoration = 'auto';
        });
      }
    }

    window.addEventListener('popstate', handlePopState);

    return function () {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Track the current URL
  useEffect(() => {
    var paramsString = searchParams.toString();
    lastUrlRef.current = pathname + (paramsString ? '?' + paramsString : '');
  }, [pathname, searchParams]);

  return null;
}
