// import PageUi from '@/_components/products/PageUi';

import PageUi from './products/PageUi';

export default async function ServerPage({ searchParams, categoryText, category }) {
  const url = searchParams;
  const safeParams = Object.fromEntries(Object.entries(url || {}).map(([k, v]) => [String(k), String(v)]));

  const queryString = new URLSearchParams(safeParams).toString();

  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/products?category=${category}&${queryString}`, {
    // cache: 'no-store', // avoids caching issues
    // cache: 'force-cache', // default
    next: { revalidate: 360 },
  });

  const { data, totalDocs } = await res.json();

  //   const data = {};
  // console.log(data);
  return <PageUi totalDocs={totalDocs} data={data} categoryText={categoryText} category={category} />;
}
