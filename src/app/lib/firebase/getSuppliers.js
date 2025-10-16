import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getSuppliers = async () => {
  console.log('🔥 Fetching suppliers from Firestore...');
  try {
    const docRef = doc(db, 'details', 'suppliers');
    const docSnap = await getDoc(docRef);

    const data = docSnap.data().suppliers;

    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
