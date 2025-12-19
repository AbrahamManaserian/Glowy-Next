import { unstable_cache } from 'next/cache';
import { getSpecialOffer } from './getSpecialOffer';

export const getCachedSpecialOffer = unstable_cache(
  async () => {
    return await getSpecialOffer();
  },
  ['special-offer'],
  {
    revalidate: 3600,
  }
);
