import { unstable_cache } from 'next/cache';
import { getCategoryProducts } from './getCategoryProducts';

export const getCachedCategoryProducts = unstable_cache(
  async (category) => getCategoryProducts(category),
  ['category-products'],
  { revalidate: 3600 }
);
