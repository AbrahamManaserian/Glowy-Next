'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// export default function ScrollToTop() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // useEffect(() => {
//   //   // Disable browser's built-in scroll restoration
//   //   if ('scrollRestoration' in window.history) {
//   //     window.history.scrollRestoration = 'manual';
//   //   }
//   // }, []);
//   // useEffect(() => {
//   //   console.log(window.history);
//   //   if (searchParams.size) {
//   //     // console.log('asd');
//   //     if ('scrollRestoration' in window.history) {
//   //       window.history.scrollRestoration = 'manual';
//   //       // window.scrollTo(0, 0);
//   //     }
//   //   } else {
//   //     if ('scrollRestoration' in window.history) {
//   //       window.history.scrollRestoration = 'auto';
//   //       // window.scrollTo(0, 0);
//   //     }
//   //   }
//   //   // This effect runs on every route change
//   //   // Doing nothing here disables Next.js auto scroll
//   //   // If you want "always scroll to top", uncomment:
//   //   // window.scrollTo(0, 0);
//   // }, [pathname, searchParams]);

//   return null;
// }

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
