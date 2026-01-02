// // import PageUi from './_components/PageUi';

import ServerPage from '@/_components/ServerPage';

export default async function MakeupPage({ searchParams }) {
  const url = await searchParams;

  return <ServerPage searchParams={url} category="makeup" categoryText="Makeup" />;
}
