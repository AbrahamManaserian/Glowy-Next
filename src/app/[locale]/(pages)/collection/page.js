import ServerPage from '@/_components/ServerPage';

export default async function CollectionPage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="collection" categoryText="Collections" />;
}
