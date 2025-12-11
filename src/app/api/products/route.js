// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
import { db } from '@/firebase';
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

export const getProducts = async (searchParams) => {
  // console.log(searchParams.get('type'));

  let data = {};
  let totalDocs;

  try {
    const params = Object.fromEntries(searchParams.entries());

    const conditions = [];
    for (const [key, value] of Object.entries(params)) {
      // console.log(key);
      if (value && key !== 'category' && key !== 'page' && key !== 'cursor') {
        if (key === 'minPrice') {
          conditions.push(where('price', '>=', +value));
        } else if (key === 'maxPrice') {
          conditions.push(where('price', '<=', +value));
        } else {
          conditions.push(where(key, '==', value));
        }
      }
    }

    // Count docs count
    const countSnap = await getCountFromServer(
      query(
        collection(db, 'glowyProducts', params.category, 'items'),
        ...conditions,
        orderBy('highlighted', 'desc')
      )
    );
    totalDocs = countSnap.data().count;

    const q = query(
      collection(db, 'glowyProducts', params.category, 'items'),
      ...conditions,
      orderBy('highlighted', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data[doc.id] = doc.data();
    });
    return { data, totalDocs, nextCursor };
  } catch (error) {
    console.log(error);
    return { data, totalDocs };
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    const data = await getProducts(searchParams);

    // Ensure it always returns an object or array
    return new Response(JSON.stringify(data || {}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // always fetch fresh data
      },
    });
  } catch (error) {
    console.error('🔥 API fetch error:', error);

    // Return JSON with error message
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
