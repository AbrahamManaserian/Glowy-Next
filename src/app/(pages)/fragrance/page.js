// import PageUi from '@/_components/products/PageUi';

import ServerPage from '@/_components/ServerPage';

export default async function FragrancePage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="fragrance" categoryText="Fragrance" />;
}
