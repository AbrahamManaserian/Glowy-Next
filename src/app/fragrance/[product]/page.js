export const revalidate = 300;

import { Grid } from '@mui/material';

import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import ProductPageUi from './components/PageUi';

export default async function FragranceProductPage({ params }) {
  const { product } = await params;

  // console.log(url);
  async function getProduct() {
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
  }

  const productData = await getProduct();

  return (
    <Grid container size={12}>
      <ProductPageUi
        product={productData.item}
        relatedItems={productData.relatedItems}
        productData={productData}
      />
    </Grid>
  );
}
