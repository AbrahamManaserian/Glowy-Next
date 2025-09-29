'use client';

import { saveScrollPosition } from '@/app/functions/saveScrollPosition';

import { useEffect } from 'react';

export default function HistoryNavigationListener() {
  useEffect(() => {
    // Disable native browser scroll restoration
    history.scrollRestoration = 'manual';
  }, []);
  useEffect(() => {
    let navType = '';
    let navObj = {};
    let num1 = 0;
    let num2 = 0;
    let arr = [];
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
      // console.log(e.target);
      lastAction = 'back/forward';

      const currentUrl = window.location.pathname + window.location.search;
      // console.log(arr[num2 - 1]);
      // console.log(num2);

      if (arr[num2 - 1] === currentUrl) {
        if (num2 === num1) {
          arr.push(`${previousUrl}`);
          // console.log(num1, 'back');
          navObj[num1] = { url: previousUrl, pos: window.scrollY };
          saveScrollPosition(navObj, num1 - 1);
          // window.scrollTo(0, window.scrollY);
          console.log(navObj);
          console.log(num1 - 1);
        } else {
          // console.log(num2, 'back');
          navObj[num2] = { url: previousUrl, pos: window.scrollY };
          saveScrollPosition(navObj, num2 - 1);
          // window.scrollTo(0, window.scrollY);
          console.log(navObj);
          console.log(num2 - 1);
        }
        // navObj[num2] = { url: previousUrl, pos: window.scrollY };
        num2 = num2 - 1;
        navType = 'back';
      } else {
        // console.log(num2, 'next');
        navObj[num2] = { url: previousUrl, pos: window.scrollY };
        saveScrollPosition(navObj, num2 + 1);
        // window.scrollTo(0, window.scrollY);
        // console.log(navObj);
        // console.log(num2 + 1);
        num2 = num2 + 1;
        navType = 'next';
      }
      // console.log(navObj);

      previousUrl = currentUrl; // update tracker
    };

    // Handle push
    const onPushState = () => {
      const currentUrl = window.location.pathname + window.location.search;
      // console.log('Navigation type:', lastAction);

      if (navType === 'back' || navType === 'next') {
        // console.log(num2, 'push-fromb/n');
        navObj[num2] = { url: previousUrl, pos: window.scrollY };

        arr = arr.slice(0, num2);
        // console.log(num2, num1);
        navType = '';
        num1 = num2 + 1;
        num2 = num2 + 1;
      } else {
        // console.log(num1, 'push');
        navObj[num1] = { url: previousUrl, pos: window.scrollY };

        num1 = num1 + 1;
        num2 = num2 + 1;
      }
      arr.push(previousUrl);
      previousUrl = currentUrl;
      saveScrollPosition(navObj, null);
      //  console.log(navObj);
      //  console.log(num2 + 1);
      // console.log(navObj);
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
