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
        q = q.limitToLast(5);

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
        q = q.limit(5);

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
        q = q.limitToLast(5);

        const querySnapshot = await q.get();
        items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
        newStartId = querySnapshot.docs[0]?.id;
      }
    } else {
      let q = ordersRef.orderBy('createdAt', 'desc');
      if (chckStatus) q = q.where('status', '==', status);
      q = q.limit(5);

      const querySnapshot = await q.get();
      newLastId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
      newStartId = querySnapshot.docs[0]?.id;
      items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    // Abraham alskdlaskdlasd

    // // Total count for the current filter (useful for pagination)
    // let totalSnapshot;
    // if (status && status !== 'all') {
    //   totalSnapshot = await ordersRef.where('status', '==', status).count().get();
    // } else {
    //   totalSnapshot = await ordersRef.count().get();
    // }
    // const totalDocs = totalSnapshot.data().count;

    // // Build query depending on page/after/nav
    // let q;

    // if (!isNaN(pageParam)) {
    //   // Page-based navigation using anchors (startId / lastId + nav)
    //   if (nav === 'last' && lastId) {
    //     const anchor = await ordersRef
    //       .doc(lastId)
    //       .get()
    //       .catch(() => null);
    //     q = ordersRef;
    //     if (status && status !== 'all') q = q.where('status', '==', status);
    //     q = q.orderBy('createdAt', 'desc').startAfter(anchor).limitToLast(limit);
    //   } else if (nav === 'next' && lastId) {
    //     const anchor = await ordersRef
    //       .doc(lastId)
    //       .get()
    //       .catch(() => null);
    //     q = ordersRef;
    //     if (status && status !== 'all') q = q.where('status', '==', status);
    //     q = q.orderBy('createdAt', 'desc').startAfter(anchor).limit(limit);
    //   } else if (startId) {
    //     const anchor = await ordersRef
    //       .doc(startId)
    //       .get()
    //       .catch(() => null);
    //     q = ordersRef;
    //     if (status && status !== 'all') q = q.where('status', '==', status);
    //     q = q.orderBy('createdAt', 'desc').endBefore(anchor).limitToLast(limit);
    //   } else {
    //     // Page number provided without anchors — do NOT use offset (to avoid
    //     // expensive reads). Enforce cursor/anchor navigation by returning the
    //     // first page instead. Use startId/lastId or `after` cursor for paging.
    //     q = ordersRef;
    //     if (status && status !== 'all') q = q.where('status', '==', status);
    //     q = q.orderBy('createdAt', 'desc').limit(limit);
    //   }
    // } else if (after) {
    //   // Cursor-based pagination (existing behavior)
    //   const afterMillis = Number(after);
    //   q = ordersRef;
    //   if (status && status !== 'all') q = q.where('status', '==', status);
    //   q = q.orderBy('createdAt', 'desc');
    //   if (!isNaN(afterMillis)) {
    //     const ts = admin.firestore.Timestamp.fromMillis(afterMillis);
    //     q = q.startAfter(ts);
    //   }
    //   q = q.limit(limit);
    // } else {
    //   // Default: first page
    //   q = ordersRef;
    //   if (status && status !== 'all') q = q.where('status', '==', status);
    //   q = q.orderBy('createdAt', 'desc').limit(limit);
    // }

    // const snapshot = await q.get();

    // const items = snapshot.docs.map((d) => {
    //   const data = d.data();
    //   const createdAt = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : null;
    //   return { id: d.id, ...data, createdAt };
    // });

    const response = {
      items,
      newStartId,
      newLastId,
      // nextCursor: items.length === limit ? items[items.length - 1].createdAt : null,
      // totalDocs,
      // lastId: snapshot.docs[snapshot.docs.length - 1]?.id || null,
      // startId: snapshot.docs[0]?.id || null,
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
