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

    const buyTogetherItems = [];

    const sameBrandItemsWomen = await getItemsByQuery([
      where('brand', '==', params.brand),
      where('name', '!=', params.name),
      where('type', '==', 'Women'),
      where('subCategory', '==', 'fragrance'),
    ]);

    // console.log(params.notes);

    const sameBrandItemsMen = await getItemsByQuery([
      where('brand', '==', params.brand),
      where('name', '!=', params.name),
      where('type', '==', 'Men'),
      where('subCategory', '==', 'fragrance'),
    ]);

    const relatedItems = await getItemsByQuery([
      where('allNotes', 'array-contains-any', params.notes.split(',') || []),
      where('name', '!=', params.name),
      where('type', '==', params.type),
    ]);

    if (!buyTogetherItems[0]) {
      if (relatedItems[0]) {
        buyTogetherItems.push(relatedItems[0]);
      } else if (sameBrandItemsMen[0]) {
        buyTogetherItems.push(sameBrandItemsMen[0]);
      }
    }

    // const item = await getProduct(params.id);

    // Ensure it always returns an object or array
    return new Response(
      JSON.stringify({ relatedItems, sameBrandItemsMen, sameBrandItemsWomen, buyTogetherItems }),
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
    return { relatedItems, sameBrandItemsMen, sameBrandItemsWomen, buyTogetherItems };
  }
}
