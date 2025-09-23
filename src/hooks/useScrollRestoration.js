// useScrollRestoration.js
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const scrollPositions = {};

export function useScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = pathname + searchParams.toString(); // unique per path + query

  // Restore scroll on mount
  useEffect(() => {
    const pos = scrollPositions[key] ?? 0;
    window.scrollTo({ top: pos });
  }, [key]);

  // Save scroll on unmount
  useEffect(() => {
    return () => {
      scrollPositions[key] = window.scrollY;
    };
  }, [key]);
}
