import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeDelivered = searchParams.get('includeDelivered') === 'true';
    let ids = [];

    // Handle ?ids=1,2,3 for guest users
    const idsParam = searchParams.get('ids');
    if (idsParam && idsParam.includes(',')) {
      ids = idsParam.split(',');
    } else {
      ids = searchParams.getAll('ids');
    }

    if (userId) {
      // Signed-in user: fetch by userId
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        ...(includeDelivered ? [] : [where('status', '!=', 'Delivered')]),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return { id: doc.id, ...data, createdAt: data.createdAt.toDate().toISOString() };
      });

      return NextResponse.json(ordersData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } else if (ids.length > 0) {
      // Guest user: fetch by order IDs
      const orderPromises = ids.map(async (orderId) => {
        const q = query(
          collection(db, 'orders'),
          where('orderNumber', '==', orderId),
          ...(includeDelivered ? [] : [where('status', '!=', 'Delivered')]),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() };
        } else {
          return null;
        }
      });
      const ordersData = (await Promise.all(orderPromises)).filter(Boolean).map((order) => ({
        ...order,

        createdAt: order.createdAt.toDate().toISOString(),
      }));

      return NextResponse.json(ordersData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    } else {
      return NextResponse.json({ error: 'Missing userId or ids' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
