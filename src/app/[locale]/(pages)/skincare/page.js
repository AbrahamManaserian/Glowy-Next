import ServerPage from '@/_components/ServerPage';

export default async function SkinCarePage({ searchParams }) {
  const url = await searchParams;
  return <ServerPage searchParams={url} category="skincare" categoryText="Skincare" />;
}
