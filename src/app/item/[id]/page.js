import { Suspense } from 'react';
import ProductPageUi from './_components/PageUi';

export default async function FragranceProductPage({ params }) {
  const { id } = await params;

  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/item/?id=${id}`, {
    cache: 'no-store', // avoids caching issues
    // cache: 'force-cache', // default
    // next: { revalidate: 360 },
  });

  const product = await res.json();
  let data = null;
  // console.log(product);
  if (product.id) {
    data = fetch(
      `${baseUrl}/api/item/relatedItems?id=${product.id}&brand=${encodeURIComponent(product.brand)}&notes=${
        product.allNotes || []
      }&type=${encodeURIComponent(product.type)}&size=${product.size}&name=${encodeURIComponent(
        product.name
      )} `,
      {
        cache: 'no-store', // avoids caching issues
        // cache: 'force-cache', // default
        // next: { revalidate: 360 },
      }
    ).then((res) => res.json());
  }

  return (
    <Suspense fallback={<ProductPageUi product={product} data={null} />}>
      <ProductPageUi product={product} data={data} />
    </Suspense>
    // <div>{id} </div>
  );
}
