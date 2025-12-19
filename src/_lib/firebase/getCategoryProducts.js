import { db } from '@/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

export const getCategoryProducts = async (category) => {
  try {
    // The user prompt mentioned 'fragracnce' but the codebase uses 'fragrance'.
    // We will use the category string passed to this function.
    // Ensure category is lowercase as per typical DB structure seen in route.js
    const collectionName = category.toLowerCase();

    const q = query(
      collection(db, 'glowyProducts', collectionName, 'items'),
      orderBy('highlighted', 'desc'),
      limit(8)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return [];
  }
};
