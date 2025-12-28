import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Use environment variables for service account credentials (server-side only)
  // Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (escape newlines as \n)
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    console.warn(
      'Firebase admin credentials are not set. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment'
    );
  }
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();


export const dynamic = 'force-dynamic';

// GET /api/admin/orders?status=pending&limit=5&after=1672531200000
export async function GET(request) {
  let newStartId;
  let newLastId;
  let items = [];
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pageParam = searchParams.get('page');
    const nav = searchParams.get('nav');
    const startId = searchParams.get('startId');
    const lastId = searchParams.get('lastId');
    const ordersRef = db.collection('orders');

    let chckStatus = false;
    if (
      searchParams.get('status') === 'pending' ||
      searchParams.get('status') === 'delivered' ||
      searchParams.get('status') === 'failed' ||
      searchParams.get('status') === 'inTransit'
    ) {
      chckStatus = true;
    }

    if (pageParam) {
      if (nav === 'last') {
        // anchor doc for lastId
        const item = lastId
          ? await ordersRef
              .doc(lastId)
              .get()
              .catch((e) => null)
          : null;
        let q = ordersRef.orderBy('createdAt', 'desc');
        if (chckStatus) q = q.where('status', '==', status);
        if (item) q = q.startAfter(item);
        q = q.limitToLast(20);

        const querySnapshot = await q.get();
        items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        newStartId = querySnapshot.docs[0]?.id;
      } else if (nav === 'next') {
        const item = lastId
          ? await ordersRef
              .doc(lastId)
              .get()
              .catch((e) => null)
          : null;

        let q = ordersRef.orderBy('createdAt', 'desc');
        if (chckStatus) q = q.where('status', '==', status);
        if (item) q = q.startAfter(item);
        q = q.limit(20);

        const querySnapshot = await q.get();
        items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        newStartId = querySnapshot.docs[0]?.id;
      } else {
        const item = startId
          ? await ordersRef
              .doc(startId)
              .get()
              .catch((e) => null)
          : null;

        let q = ordersRef.orderBy('createdAt', 'desc');
        if (chckStatus) q = q.where('status', '==', status);
        if (item) q = q.endBefore(item);
        q = q.limitToLast(20);

        const querySnapshot = await q.get();
        items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        newStartId = querySnapshot.docs[0]?.id;
      }
    } else {
      let q = ordersRef.orderBy('createdAt', 'desc');
      if (chckStatus) q = q.where('status', '==', status);
      q = q.limit(20);

      const querySnapshot = await q.get();
      newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
      newStartId = querySnapshot.docs[0]?.id;
      items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    const response = {
      items,
      newStartId,
      newLastId,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
