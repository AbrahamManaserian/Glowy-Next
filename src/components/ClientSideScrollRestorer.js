// app/ClientSideScrollRestorer.tsx
'use client';

import { ScrollRestoration } from 'next-scroll-restoration';

export default function ClientSideScrollRestorer() {
  return (
    <ScrollRestoration
      shouldUpdateScroll={(prev, next) => {
        // if pathname changes → restore
        if (prev.pathname !== next.pathname) return true;

        // if search params changed → scroll to top
        if (prev.search !== next.search) return [0, 0];

        return false; // default
      }}
    />
  );
}
