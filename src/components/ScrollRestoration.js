'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rafRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // before leaving page → save scroll
    return () => {
      const key = pathname + searchParams;
      console.log(rafRef);
      sessionStorage.setItem('app-scroll:' + key, String(window.scrollY));
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    // after entering page → restore scroll
    const key = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    const saved = sessionStorage.getItem('app-scroll:' + key);

    if (saved !== null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(saved, 10));
        });
      });
    }
  }, [pathname, searchParams]);

  return null;
}
