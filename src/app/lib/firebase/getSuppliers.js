import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getSuppliers = async () => {

  try {
    const docRef = doc(db, 'details', 'suppliers');
    const docSnap = await getDoc(docRef);

    const data = docSnap.data();

    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
