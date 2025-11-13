import PageUi from './components/PageUi';

export default async function FragrancePage({ searchParams, params }) {
  let category = searchParams.category || '';
  //   console.log(category);
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://glowy-store-next.netlify.app';

  const res = await fetch(`${baseUrl}/api/fragrance?category=${category}`, {
    // cache: 'no-store', // avoids caching issues
    cache: 'force-cache', // default
    // next: { revalidate: 60 },
  });

  const data = await res.json();
  //   const data = {};
  //   console.log(data);
  return <PageUi data={data} />;
}
