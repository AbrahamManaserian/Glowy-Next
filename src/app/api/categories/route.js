import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { unstable_cache } from 'next/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  console.log(category);

  if (!category) {
    return Response.json({ error: 'Category required' }, { status: 400 });
  }

  try {
    const cachedData = await unstable_cache(
      async () => {
        const docRef = doc(db, 'details', category);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          throw new Error('Category not found');
        }
      },
      [`category-${category}`],
      {
        revalidate: 3600, // Cache for 1 hour
        // revalidate: 1, // Cache for 1 hour
        tags: [`category-${category}`],
      }
    )();

    return Response.json(cachedData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 404 });
  }
}
