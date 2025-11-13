// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

export const getFragranceProducts = async (category) => {
  let data = {};
  try {
    const q = query(collection(db, 'glowy-products'), category ? where('subCategory', '==', category) : null);
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
  const category = searchParams.get('category');
  console.log(category);
  try {
    const data = await getFragranceProducts(category);

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
