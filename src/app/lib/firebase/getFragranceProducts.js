import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

export const getFragranceProducts = async () => {
  let data = {};
  try {
    const q = query(
      collection(db, 'glowy-products'),
      //   where('brand', '==', 'Armani'),
      where('category', '==', 'fragrance')
      //   where('type', '==', 'Uni'),
      //   limit(30)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data[doc.id] = doc.data();
    });
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
