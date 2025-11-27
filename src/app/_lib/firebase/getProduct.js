import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { cache } from 'react';

export const getProduct = cache(async (id) => {
  try {
    const productRef = doc(db, 'glowy-products', id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
});