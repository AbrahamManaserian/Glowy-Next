'use client';

import { saveScrollPosition } from '@/app/functions/saveScrollPosition';

import { useEffect } from 'react';

export default function HistoryNavigationListener() {
  useEffect(() => {
    // Disable native browser scroll restoration
    history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    let num1 = 0;
    let num2 = 0;
    let arr = [];
    let lastAction = null; // "push" | "back/forward" | "reload"
    let previousUrl = window.location.pathname + window.location.search; // start with current page
    let previousUrl1 = window.location.pathname + window.location.search; // start with current page

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
      // console.log(e.target);
      lastAction = 'back/forward';
      saveScrollPosition(previousUrl);
      const currentUrl = window.location.pathname + window.location.search;
      console.log(arr[num2 - 1]);
      console.log(num2);
      console.log(arr);
      if (arr[num2 - 1] === currentUrl) {
        arr.push(currentUrl);
        num2 = num2 - 1;
      } else {
        console.log(num2);
        arr.push(currentUrl);
        num2 = num2 + 1;
      }

      // if (previousUrl1 === currentUrl) {
      //   num = num - 1;
      // }
      // console.log(previousUrl1);
      // console.log(previousUrl);
      // console.log('Navigation type:', lastAction);
      // console.log('from-', previousUrl, 'to-', currentUrl);
      // console.log('Went to:', currentUrl);

      previousUrl = currentUrl; // update tracker
    };

    // Handle push
    const onPushState = () => {
      const currentUrl = window.location.pathname + window.location.search;
      console.log('Navigation type:', lastAction);

      saveScrollPosition(previousUrl);
      num1 = num1 + 1;
      num2 = num2 + 1;
      arr.push(previousUrl);
      // console.log(previousUrl1);
      // console.log(previousUrl);
      // console.log(currentUrl);
      previousUrl1 = previousUrl;
      previousUrl = currentUrl;
      // console.log(num1);
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
