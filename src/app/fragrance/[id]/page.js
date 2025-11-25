import { Suspense } from 'react';
import ProductPageUi from './_components/PageUi';
import { getProduct, getSameBrandItems } from '@/app/_lib/firebase/getFragranceProducts';

export default async function FragranceProductPage({ params }) {
  const { id } = await params;
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/fragrance/product?id=${id}`, {
    // cache: 'no-store', // avoids caching issues
    // cache: 'force-cache', // default
    next: { revalidate: 360 },
  });

  const product = await res.json();
  // console.log(data);

  // const product = await getProduct(id);
  let sameBrandItems = null;
  if (product.id) {
    sameBrandItems = getSameBrandItems(product.id, product.brand);
  }

  return (
    <Suspense
      fallback={
        <ProductPageUi
          product={product}
          // relatedItems={items}
          // productData={productData}
          sameBrandItems={null}
        />
      }
    >
      <ProductPageUi
        product={product}
        // relatedItems={items}
        // productData={productData}
        sameBrandItems={sameBrandItems}
      />
    </Suspense>
    // <div>{id} </div>
  );
}
