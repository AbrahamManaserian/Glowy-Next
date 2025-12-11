import ServerPage from '@/_components/ServerPage';

export default async function NailPage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="nail" categoryText="Nail" />;
}
