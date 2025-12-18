import ServerPage from '@/_components/ServerPage';

export default async function ShopPage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="shop" categoryText="Glowy store" />;
}
