'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function CustomScrollREstoration1() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const position = JSON.parse(sessionStorage.getItem('app-scroll:'));
    const index = JSON.parse(sessionStorage.getItem('index'));
    // console.log(position);
    // console.log(index);
    // if (position !== null) {
    //   setScrollY(Number(saved));
    //   window.scrollTo(0, Number(saved));
    // }
    // Scroll to top on every navigation (path or query change)
    // window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
