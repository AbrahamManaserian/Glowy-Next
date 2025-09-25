'use client';

import { saveScrollPosition } from '@/app/functions/saveScrollPosition';
import { useEffect } from 'react';

let entryCounter = 0; // global counter to generate unique ids

export default function ScrollManager() {
  useEffect(() => {
    let lastAction = null;
    let previousKey = makeKey(window.location.pathname, window.location.search, entryCounter);
    let previousUrl = window.location.pathname + window.location.search;

    // helper: build key with pathname + search + entryId
    function makeKey(pathname, search, id) {
      return `${pathname}${search}::entry-${id}`;
    }

    // Save original pushState
    const originalPushState = history.pushState;

    // Override pushState to detect push navigations
    history.pushState = function (state, title, url) {
      lastAction = 'push';

      // increment counter for new entry
      entryCounter++;
      const newKey = makeKey(
        new URL(url, window.location.origin).pathname,
        new URL(url, window.location.origin).search,
        entryCounter
      );
      const newState = { ...(state || {}), __entryKey: newKey };

      originalPushState.call(this, newState, title, url);
      window.dispatchEvent(new CustomEvent('custom-pushstate', { detail: { newKey } }));
    };

    // Handle back/forward
    const onPopState = (event) => {
      lastAction = 'back/forward';
      const currentUrl = window.location.pathname + window.location.search;
      const newKey =
        (event.state && event.state.__entryKey) ||
        makeKey(window.location.pathname, window.location.search, entryCounter);

      console.log('Navigation type:', lastAction);
      console.log('from-', previousUrl, 'to-', currentUrl);

      previousKey = newKey;
      previousUrl = currentUrl;
    };

    // Handle push
    const onPushState = (event) => {
      const currentUrl = window.location.pathname + window.location.search;
      const newKey =
        event.detail?.newKey || makeKey(window.location.pathname, window.location.search, entryCounter);

      console.log('Navigation type:', lastAction);

      // save scroll for the previous entry
      saveScrollPosition(previousKey);

      previousKey = newKey;
      previousUrl = currentUrl;

      window.scrollTo({ top: 0, behavior: 'smooth' });
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
