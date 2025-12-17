import { unstable_cache } from 'next/cache';
import { getCartItems } from './getCartItems';

export const getCachedCartItems = unstable_cache(
  async (ids) => {
    return await getCartItems(ids);
  },
  ['cart-items'], // Key parts
  {
    revalidate: 3600, // Cache for 1 hour (3600 seconds)
    tags: ['cart'],
  }
);
