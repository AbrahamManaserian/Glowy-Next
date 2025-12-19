import { db } from '@/firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';

export const getFlashDeals = async () => {
  try {
    const q = query(collection(db, 'allProducts'), where('highlighted', '==', 0), limit(10));
    const querySnapshot = await getDocs(q);

    const deals = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      deals.push({
        id: doc.id,
        ...data,
      });
    });

    return deals;
  } catch (e) {
    console.log(e);
    return [];
  }
};
