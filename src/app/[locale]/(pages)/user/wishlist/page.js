'use client';
import { useGlobalContext } from '@/app/GlobalContext';
import WishlistTab from '../_components/WishlistTab';

export default function WishlistPage() {
  const { user, setWishList, wishListDetails, wishListLoading } = useGlobalContext();

  return (
    <WishlistTab
      user={user}
      setWishList={setWishList}
      wishListDetails={wishListDetails}
      wishListLoading={wishListLoading}
    />
  );
}
