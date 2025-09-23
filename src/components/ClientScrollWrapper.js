// ClientScrollWrapper.js
'use client';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';

export default function ClientScrollWrapper({ children }) {
  useScrollRestoration();
  return <>{children}</>;
}
