// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
// import { getProduct } from '@/app/_lib/firebase/getFragranceProducts';

import { getProduct } from '@/app/_lib/firebase/getProduct';
import { db } from '@/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

const getItemsByQuery = async (condition = []) => {
  try {
    const q = query(collection(db, 'glowy-products'), ...condition, orderBy('highlighted', 'desc'), limit(4));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());
    return items;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);

    const sameBrandItemsWomen = await getItemsByQuery([
      where('brand', '==', params.brand),
      // where('id', '!=', params.id),
      where('type', '==', 'Women'),
      where('subCategory', '==', 'fragrance'),
    ]);

    // console.log(params.notes);

    const sameBrandItemsMen = await getItemsByQuery([
      where('brand', '==', params.brand),
      // where('id', '!=', params.id),
      where('type', '==', 'Men'),
      where('subCategory', '==', 'fragrance'),
    ]);

    const relatedItems = await getItemsByQuery([
      where('allNotes', 'array-contains-any', params.notes.split(',') || []),
      where('brand', '!=', params.brand),
      where('type', '==', params.type),
    ]);

    // const item = await getProduct(params.id);

    // Ensure it always returns an object or array
    return new Response(JSON.stringify({ relatedItems, sameBrandItemsMen, sameBrandItemsWomen }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 'Cache-Control': 'no-store', // always fetch fresh data
      },
    });
  } catch (error) {
    console.error('🔥 API fetch error:', error);

    // Return JSON with error message
    return { relatedItems, sameBrandItemsMen, sameBrandItemsWomen };
  }
}
