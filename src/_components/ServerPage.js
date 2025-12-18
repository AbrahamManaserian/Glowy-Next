// import PageUi from '@/_components/products/PageUi';

import PageUi from './products/PageUi';


export default async function ServerPage({ searchParams, categoryText, category }) {
  // const allowedKeys = ['page', 'size', 'subCategory', 'type', 'minPrice', 'maxPrice', 'brand'];
  const allowedKeys = ['page', 'size', 'subCategory', 'type', 'brand', 'startId', 'lastId', 'nav', 'sale'];
  const url = searchParams;
  const safeParams = Object.fromEntries(Object.entries(url || {}).map(([k, v]) => [String(k), String(v)]));
  const filteredParams = Object.fromEntries(
    Object.entries(safeParams).filter(([key]) => allowedKeys.includes(key))
  );

  const queryString = new URLSearchParams(filteredParams).toString();

  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/products?category=${category}&${queryString}`, {
    // cache: 'no-store', // avoids caching issues
    // cache: 'force-cache', // default
    next: { revalidate: 360 },
  });


  const { data, totalDocs, lastId, startId } = await res.json();

  //   const data = {};
  // console.log(data);
  return (
    <PageUi
      lastId={lastId}
      startId={startId}
      totalDocs={totalDocs}
      data={data}
      categoryText={categoryText}
      category={category}
    />
  );
}
