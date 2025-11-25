export const revalidate = 3600; // cached 1 hour

import ProductPageUi from './components/PageUi';
import { getProduct } from '@/app/lib/firebase/getFragranceProducts';

export default async function FragranceProductPage({ params }) {
  const { product } = await params;

  const productData = await getProduct(product);

  return (
    <ProductPageUi
      product={productData.item}
      relatedItems={productData.relatedItems}
      productData={productData}
    />
  );
}
