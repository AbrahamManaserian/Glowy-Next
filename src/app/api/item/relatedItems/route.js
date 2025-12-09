import { db } from '@/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

export const getBuyTogetherItems = async (itemsCoast, id) => {
  // console.log(itemsCoast);
  try {
    const q1 = query(
      collection(db, 'allProducts'),
      where('price', '<=', itemsCoast * 0.8),
      where('id', '!=', id),
      orderBy('id'),
      orderBy('price', 'desc'),
      limit(1)
    );

    const querySnapshot1 = await getDocs(q1);
    const firstItem = querySnapshot1.docs.map((doc) => doc.data());

    const q2 = query(
      collection(db, 'allProducts'),
      where('price', '<=', (itemsCoast - firstItem[0].price) * 1.5),
      where('price', '>=', itemsCoast - firstItem[0].price),
      where('id', 'not-in', [id, firstItem[0].id]),
      orderBy('id'),
      orderBy('price'),
      limit(1)
    );

    const querySnapshot2 = await getDocs(q2);
    const secondItem = querySnapshot2.docs.map((doc) => doc.data());

    return [...firstItem, ...secondItem];
    // return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getItemsByQuery = async (condition = [], category) => {
  try {
    const q = query(collection(db, 'glowyProducts', category, 'items'), ...condition);
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
          // orderBy('brand'),
          orderBy('highlighted', 'desc'),
          limit(4),
        ],
        params.category
      );
    } else {
      similarProducts = await getItemsByQuery(
        [
          where('subCategory', '==', params.subCategory),
          where('brand', '!=', params.brand),
          // orderBy('brand'),
          orderBy('highlighted', 'desc'),
          limit(4),
        ],
        params.category
      );
    }

    const sameBrandItems = await getItemsByQuery(
      // [where('brand', '==', params.brand), where('name', '!=', params.name)],
      [
        where('model', '!=', params.model),
        where('brand', '==', params.brand),
        // orderBy('model'),
        orderBy('highlighted', 'desc'),
        limit(4),
      ],
      params.category
    );

    // const getBuyTogetherItems = async (itemsCoast, minItemsCoast) => {
    //   // console.log(itemsCoast);
    //   try {
    //     const q1 = query(
    //       collection(db, 'allProducts'),
    //       where('price', '<=', itemsCoast * 0.8),
    //       // where('price', '>=', itemsCoast / 3),
    //       orderBy('price', 'desc'),
    //       // orderBy('highlighted', 'desc'),
    //       limit(1)
    //     );

    //     const querySnapshot1 = await getDocs(q1);
    //     const firstItem = querySnapshot1.docs.map((doc) => doc.data());
    //     // console.log(itemsCoast);
    //     // console.log((itemsCoast - firstItem[0].price) * 1.3);
    //     // console.log(itemsCoast - firstItem[0].price);

    //     const q2 = query(
    //       collection(db, 'allProducts'),
    //       where('price', '<=', (itemsCoast - firstItem[0].price) * 1.5),
    //       where('price', '>=', itemsCoast - firstItem[0].price),
    //       orderBy('price'),
    //       // orderBy('highlighted', 'desc'),
    //       limit(1)
    //     );

    //     const querySnapshot2 = await getDocs(q2);
    //     const secondItem = querySnapshot2.docs.map((doc) => doc.data());

    //     return [...firstItem, ...secondItem];
    //     // return [];
    //   } catch (e) {
    //     console.log(e);
    //     return [];
    //   }
    // };

    const buyTogetherItems = await getBuyTogetherItems(20000 - params.price, params.id);

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
