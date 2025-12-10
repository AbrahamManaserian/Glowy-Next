// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

export const getProducts = async (searchParams) => {
  // console.log(searchParams.get('type'));

  let data = {};
  try {
    const params = Object.fromEntries(searchParams.entries());
    // console.log(params);
    const conditions = [];
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        if (key === 'minPrice') {
          conditions.push(where('price', '>=', +value));
        } else if (key === 'maxPrice') {
          conditions.push(where('price', '<=', +value));
        } else {
          conditions.push(where(key, '==', value));
        }
      }
    }
    // console.log(conditions);
    let q;
    if (conditions.length > 0) {
      q = query(
        collection(db, 'glowyProducts', 'makeup', 'items'),
        ...conditions,
        orderBy('highlighted', 'desc'),
        limit(50)
      );
    } else {
      q = query(
        collection(db, 'glowyProducts', 'makeup', 'items'),
        orderBy('highlighted', 'desc'),
        limit(50)
      );
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data[doc.id] = doc.data();
    });

    return data;
  } catch (error) {
    console.log(error);
    return {};
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
