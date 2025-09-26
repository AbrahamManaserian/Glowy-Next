'use client';

import { saveScrollPosition } from '@/app/functions/saveScrollPosition';

import { useEffect } from 'react';

export default function HistoryNavigationListener() {
  useEffect(() => {
    // Disable native browser scroll restoration
    history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    let lastAction = null; // "push" | "back/forward" | "reload"
    let previousUrl = window.location.pathname + window.location.search; // start with current page

    // Save original pushState
    const originalPushState = history.pushState;

    // Override pushState to detect push navigations
    history.pushState = function () {
      lastAction = 'push';
      originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event('custom-pushstate'));
    };

    // Handle back/forward

    const onPopState = (e) => {
      console.log(e.target);
      lastAction = 'back/forward';
      saveScrollPosition(previousUrl);
      const currentUrl = window.location.pathname + window.location.search;

      console.log('Navigation type:', lastAction);
      console.log('from-', previousUrl, 'to-', currentUrl);
      // console.log('Went to:', currentUrl);

      previousUrl = currentUrl; // update tracker
    };

    // Handle push
    const onPushState = () => {
      const currentUrl = window.location.pathname + window.location.search;
      console.log('Navigation type:', lastAction);

      saveScrollPosition(previousUrl);
      previousUrl = currentUrl;
      const tryScroll = () => {
        console.log('asd');
        // Use a selector that exists on the real page, e.g., main content
        const pageReady = document.querySelector('main'); // adjust to your page wrapper
        if (pageReady) {
          window.scrollTo({ top: 500, behavior: 'auto' });
        } else {
          requestAnimationFrame(tryScroll);
        }
      };

      tryScroll();
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('custom-pushstate', onPushState);

    return () => {
      history.pushState = originalPushState; // restore original
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('custom-pushstate', onPushState);
    };
  }, []);

  return null;
}
