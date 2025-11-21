import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { cache } from 'react';

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
 
export const getProduct = cache(async (product) => {
  try {
    const productRef = doc(db, 'glowy-products', product);
    const docSnap = await getDoc(productRef);
    if (docSnap.data()) {
      const q = query(
        collection(db, 'glowy-products'),
        where('brand', '==', docSnap.data().brand),
        where('id', '!=', docSnap.data().id),
        limit(4)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { relatedItems: querySnapshot.docs.map((d) => d.data()), item: docSnap.data() };
      }

      const q1 = query(
        collection(db, 'glowy-products'),
        where('category', '==', docSnap.data().category),
        orderBy('createdAt'),
        where('type', '==', docSnap.data().type),
        where('id', '!=', docSnap.data().id),

        limit(4)
      );

      const snap1 = await getDocs(q1);
      return { relatedItems: snap1.docs.map((d) => d.data()), item: docSnap.data() };
    } else {
      const relatedItems = [];
      let q = query(collection(db, 'glowy-products'), limit(4));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        relatedItems.push(doc.data());
      });
      return { relatedItems: relatedItems, item: {} };
    }
  } catch (e) {
    console.log(e);
    return { relatedItems: [], item: {} };
  }
});