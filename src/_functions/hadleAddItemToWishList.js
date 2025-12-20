import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const handleAddItemToWishList = async (id, setWishList, currentWishList) => {
  const user = auth.currentUser;
  let updatedWishList;

  if (currentWishList) {
    updatedWishList = [...currentWishList];
  } else {
    try {
      updatedWishList = JSON.parse(localStorage.getItem('fav')) || [];
    } catch {
      updatedWishList = [];
    }
  }

  if (updatedWishList.includes(id)) {
    updatedWishList = updatedWishList.filter((item) => item !== id);
  } else {
    updatedWishList.push(id);
  }

  setWishList(updatedWishList);

  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { wishList: updatedWishList }, { merge: true });
    } catch (error) {
      console.error('Error saving wishlist to Firestore:', error);
    }
  } else {
    localStorage.setItem('fav', JSON.stringify(updatedWishList));
  }
};
