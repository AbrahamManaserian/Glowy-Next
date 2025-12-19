import { db } from '@/firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';

export const getSpecialOffer = async () => {
  try {
    const q = query(collection(db, 'allProducts'), where('highlighted', '==', -1), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
