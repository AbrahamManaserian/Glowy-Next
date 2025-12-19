import { unstable_cache } from 'next/cache';
import { getSlides } from './getSlides';

export const getCachedSlides = unstable_cache(
  async () => {
    return await getSlides();
  },
  ['home-slides'], // Key parts
  {
    revalidate: 3600, // Cache for 1 hour (3600 seconds)
    tags: ['slides'],
  }
);
