// import { getFragranceProducts } from '@/app/lib/firebase/getFragranceProducts';
import { db } from '@/firebase';
import {
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

export const getProducts = async (searchParams) => {
  // console.log(searchParams.get('type'));

  let data = {};
  let totalDocs;
  let lastId;
  let startId;

  try {
    const params = Object.fromEntries(searchParams.entries());

    const conditions = [];
    for (const [key, value] of Object.entries(params)) {
      // console.log(key);

      if (
        value &&
        key !== 'category' &&
        key !== 'page' &&
        key !== 'startId' &&
        key !== 'lastId' &&
        key !== 'nav'
      ) {
        if (key === 'minPrice') {
          conditions.push(where('price', '>=', +value));
        } else if (key === 'maxPrice') {
          conditions.push(where('price', '<=', +value));
        } else if (key === 'sale') {
          conditions.push(where('previousPrice', '>', 0));
        } else if (key === 'brands') {
          const brandsArray = value.split(',');
          conditions.push(where('brand', 'in', brandsArray));
        } else if (key === 'size') {
          const sizeArray = value.split(',');
          conditions.push(where('size', 'in', sizeArray));
        } else if (key === 'inStock' || key === 'original') {
          conditions.push(where(key, '==', value === 'true'));
        } else if (key === 'orderBy') {
          // Skip, handle ordering separately
        } else {
          conditions.push(where(key, '==', value));
        }
      }
    }
    if (params.category === 'sale') {
      conditions.push(where('previousPrice', '>', 0));
    }

    // Determine orderBy
    let orderField = 'highlighted';
    let orderDirection = 'desc';
    if (params.orderBy) {
      switch (params.orderBy) {
        case 'price_asc':
          orderField = 'price';
          orderDirection = 'asc';
          break;
        case 'price_desc':
          orderField = 'price';
          orderDirection = 'desc';
          break;

        default:
        // Keep default
      }
    }

    // Count docs count

    const productsRef =
      !params.category || params.category === 'shop' || params.category === 'sale'
        ? collection(db, 'allProducts')
        : collection(db, 'glowyProducts', params.category, 'items');

    const countSnap = await getCountFromServer(
      query(productsRef, ...conditions, orderBy(orderField, orderDirection))
    );
    totalDocs = countSnap.data().count;

    if (params.page) {
      if (params.nav === 'last') {
        const item = await getDoc(doc(productsRef, params.lastId)).catch((e) => console.log(e));

        const q = query(
          productsRef,
          ...conditions,
          orderBy(orderField, orderDirection),
          startAfter(item),
          limitToLast(10)
        );

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        docs.forEach((doc) => {
          data[doc.id] = doc.data();
        });

        lastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        startId = querySnapshot.docs[0]?.id;
      } else if (params.nav === 'next') {
        const item = await getDoc(doc(productsRef, params.lastId)).catch((e) => console.log(e));

        const q = query(
          productsRef,
          ...conditions,
          orderBy(orderField, orderDirection),
          startAfter(item),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          data[doc.id] = doc.data();
        });

        lastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        startId = querySnapshot.docs[0]?.id;
      } else {
        const item = await getDoc(doc(productsRef, params.startId)).catch((e) => console.log(e));

        const q = query(
          productsRef,
          ...conditions,
          orderBy(orderField, orderDirection),
          endBefore(item),
          limitToLast(10)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          data[doc.id] = doc.data();
        });

        lastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        startId = querySnapshot.docs[0]?.id;
      }
    } else {
      const q = query(productsRef, ...conditions, orderBy(orderField, orderDirection), limit(10));

      const querySnapshot = await getDocs(q);
      lastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
      startId = querySnapshot.docs[0]?.id;
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        data[doc.id] = doc.data();
      });
    }

    return { data, totalDocs, lastId, startId };
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
