import { db } from '@/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export const getCartItems = async (ids) => {
  try {
    if (!ids || ids.length === 0) return {};

    const productPromises = ids.map((id) => {
      const productRef = doc(db, 'allProducts', id);
      return getDocFromServer(productRef);
    });

    const docSnaps = await Promise.all(productPromises);

    const products = docSnaps.reduce((acc, snap) => {
      if (snap.exists()) {
        acc[snap.id] = { ...snap.data() };
      }
      return acc;
    }, {});

    return products;
  } catch (e) {
    console.log(e);
    return {};
  }
};
