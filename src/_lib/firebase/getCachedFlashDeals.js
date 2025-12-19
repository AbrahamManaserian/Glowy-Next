import { unstable_cache } from 'next/cache';
import { getFlashDeals } from './getFlashDeals';

export const getCachedFlashDeals = unstable_cache(
  async () => {
    return await getFlashDeals();
  },
  ['flash-deals'],
  {
    revalidate: 3600,
  }
);
