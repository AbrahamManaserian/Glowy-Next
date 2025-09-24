'use client';

import { useEffect } from 'react';

export default function HistoryNavigationListener() {
  useEffect(() => {
    let lastAction = null; // "push" | "back/forward" | "reload"

    // Save original pushState
    const originalPushState = history.pushState;

    // Override pushState to detect push navigations
    history.pushState = function () {
      lastAction = 'push';
      originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event('custom-pushstate'));
    };

    // Handle back/forward
    const onPopState = () => {
      lastAction = 'back/forward';
      console.log('Navigation type:', lastAction);
    };

    // Handle push
    const onPushState = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('Navigation type:', lastAction);
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
