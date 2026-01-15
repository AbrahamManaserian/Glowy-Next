import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { unstable_cache } from 'next/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Product id required' }, { status: 400 });
  }

  try {
    const cachedData = await unstable_cache(
      async () => {
        const docRef = doc(db, 'allProducts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          throw new Error('Product not found');
        }
      },
      [`product-${id}`],
      {
        revalidate: 3600, // Cache for 1 hour
        tags: [`product-${id}`],
      }
    )();

    return Response.json(cachedData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 404 });
  }
}
