import UserPageUi from './_components/UserPageUi';

export default async function UserPage({ searchParams }) {
  const url = await searchParams;

  return <UserPageUi />;
}
