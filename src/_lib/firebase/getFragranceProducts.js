import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { cache } from 'react';



export const getSameBrandItems = async (id, brand) => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const q = query(
      collection(db, 'glowy-products'),
      where('brand', '==', brand),
      where('id', '!=', id),
      limit(4)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());
    return items;
  } catch (e) {
    console.log(e);
    return {};
  }
};
