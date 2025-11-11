import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function getProduct(id) {
  try {
    const productRef = doc(db, 'glowy-products', id);
    const productData = await getDoc(productRef);
    if (productData.exists()) {
      return productData.data();
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
}
