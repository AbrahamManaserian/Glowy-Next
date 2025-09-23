'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const scrollPositions = {};

export function useScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = pathname + '?' + searchParams.toString();
  const [hydrated, setHydrated] = useState(false);

  // Wait until hydration completes
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Restore scroll only after hydration
  useEffect(() => {
    if (!hydrated) return;
    const pos = scrollPositions[key] ?? 0;
    window.scrollTo({ top: pos, behavior: 'auto' });
  }, [hydrated, key]);

  // Save scroll when leaving page
  useEffect(() => {
    return () => {
      scrollPositions[key] = window.scrollY;
    };
  }, [key]);
}
