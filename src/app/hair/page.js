import ServerPage from '@/_components/ServerPage';

export default async function HairPage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="hair" categoryText="Hair" />;
}
