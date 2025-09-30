import FragrancePageUi from './pageUI';

export default async function FragrancePage({ searchParams }) {
  const search = await searchParams;
  return (
    <>
      <FragrancePageUi />
    </>
  );
}
