import { db } from '@/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

export const getSlides = async () => {
  try {
    // Fetch the first 5 products from 'allProducts'
    const q = query(
      collection(db, 'allProducts'),
      orderBy('highlighted', 'desc'), // Optional: order by highlighted or createdAt
      limit(5)
    );
    const querySnapshot = await getDocs(q);

    const slides = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Map product data to slide format if needed, or just pass it through
      slides.push({
        id: doc.id,
        title: data.fullName || `${data.brand} ${data.model}`,
        description: data.descriptionEn || data.description || 'Special Offer',
        image: data.mainImage?.file || data.mainImage?.url || '/images/placeholder.jpg',
        buttonText: 'Shop Now',
        ...data,
      });
    });

    return slides;
  } catch (e) {
    console.log(e);
    return [];
  }
};
