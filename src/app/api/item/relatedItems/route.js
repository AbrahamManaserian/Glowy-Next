import { db } from '@/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

const getItemsByQuery = async (condition = [], category) => {
  try {
    const q = query(
      collection(db, 'glowyProducts', category, 'items'),
      ...condition,
      orderBy('highlighted', 'desc'),
      limit(4)
    );
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
    let similarProducts = [];

    if (params.subCategory === 'fragrance') {
      similarProducts = await getItemsByQuery(
        [
          where('subCategory', '==', params.subCategory),
          where('brand', '!=', params.brand),
          where('type', '==', params.type),
          where('allNotes', 'array-contains-any', params.notes.split(',') || []),
        ],
        params.category
      );
    } else {
      similarProducts = await getItemsByQuery(
        [where('subCategory', '==', params.subCategory), where('fullName', '!=', params.name)],
        params.category
      );
    }

    const sameBrandItems = await getItemsByQuery(
      // [where('brand', '==', params.brand), where('name', '!=', params.name)],
      [where('model', '!=', params.model), where('brand', '==', params.brand)],
      params.category
    );

    const buyTogetherItems = [];

    return new Response(
      JSON.stringify({
        sameBrandItems,
        similarProducts,
        buyTogetherItems,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // 'Cache-Control': 'no-store', // always fetch fresh data
        },
      }
    );
  } catch (error) {
    console.error('🔥 API fetch error:', error);

    // Return JSON with error message
    return {
      sameBrandItems,
      similarProducts,
      buyTogetherItems,
    };
  }
}
