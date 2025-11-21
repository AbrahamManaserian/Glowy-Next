import PageUi from './components/PageUi';

export default async function FragrancePage({ searchParams }) {
  const url = await searchParams;
  const safeParams = Object.fromEntries(Object.entries(url || {}).map(([k, v]) => [String(k), String(v)]));

  const queryString = new URLSearchParams(safeParams).toString();
  //   console.log(queryString);
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/fragrance?${queryString}`, {
    // cache: 'no-store', // avoids caching issues
    cache: 'force-cache', // default
    // next: { revalidate: 60 },
  });

  const data = await res.json();
  //   const data = {};
  //   console.log(data);
  return <PageUi data={data} />;
}
