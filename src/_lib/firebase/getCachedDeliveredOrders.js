import { unstable_cache } from 'next/cache';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const getDeliveredOrders = async (userId) => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    where('status', '==', 'delivered'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate().toISOString(),
  }));
  return orders;
};

export const getCachedDeliveredOrders = unstable_cache(
  async (userId) => {
    return await getDeliveredOrders(userId);
  },
  ['delivered-orders'], // Key parts
  {
    revalidate: 86400, // Cache for 1 day
    tags: ['orders'],
  }
);
