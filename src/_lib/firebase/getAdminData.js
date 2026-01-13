import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export const getAdminData = async () => {
  let data = {};
  try {
    const querySnapshot = await getDocs(collection(db, 'details'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data[doc.id] = doc.data();
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
