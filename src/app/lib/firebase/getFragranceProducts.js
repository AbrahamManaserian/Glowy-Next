import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { cache } from 'react';


 export const getProduct = cache(async (product) => {
   try {
     const productRef = doc(db, 'glowy-products', product);
     const docSnap = await getDoc(productRef);

     if (!docSnap.exists()) {
       const fallback = await getDocs(query(collection(db, 'glowy-products'), limit(4)));
       return {
         item: {},
         relatedItems: fallback.docs.map((d) => d.data()),
       };
     }

     const data = docSnap.data();

     // 1) Related items by brand
     const qBrand = query(
       collection(db, 'glowy-products'),
       where('brand', '==', data.brand),
       where('id', '!=', data.id),
       limit(4)
     );

     const brandSnap = await getDocs(qBrand);

     if (!brandSnap.empty) {
       return {
         item: data,
         relatedItems: brandSnap.docs.map((d) => d.data()),
       };
     }

     // 2) Related items by category + type
     const qCategory = query(
       collection(db, 'glowy-products'),
       where('category', '==', data.category),
       where('type', '==', data.type),
       where('id', '!=', data.id),
       orderBy('createdAt'),
       limit(4)
     );

     const catSnap = await getDocs(qCategory);

     return {
       item: data,
       relatedItems: catSnap.docs.map((d) => d.data()),
     };
   } catch (e) {
     console.log(e);
     return { item: {}, relatedItems: [] };
   }
 });

 export const getSameBrandItems = async (id, brand) => {
   try {
     const q = query(
       collection(db, 'glowy-products'),
       where('brand', '==', brand),
       where('id', '!=', id),
       limit(4)
     );

     const querySnapshot = await getDocs(q);
     const items = querySnapshot.map((doc) => doc.data());
     return items;
   } catch (e) {
     console.log(e);
     return {};
   }
 };