import ServerPage from '@/_components/ServerPage';

export default async function BathBodyPage(searchParams) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="bathBody" categoryText="Bath & Body" />;
}
