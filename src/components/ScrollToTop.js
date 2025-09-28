'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   // Disable browser's built-in scroll restoration
  //   if ('scrollRestoration' in window.history) {
  //     window.history.scrollRestoration = 'manual';
  //   }
  // }, []);
  useEffect(() => {
    if (searchParams.size) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      // const params = Object.fromEntries(searchParams.entries());
      // console.log(params);
      // console.log(searchParams.size);
    }
    // This effect runs on every route change
    // Doing nothing here disables Next.js auto scroll
    // If you want "always scroll to top", uncomment:
    // window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}
// export default function ScrollToTop() {
//   const pathname = usePathname();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }
