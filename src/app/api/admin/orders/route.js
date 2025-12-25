import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Use environment variables for service account credentials (server-side only)
  // Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (escape newlines as \n)
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('Firebase admin credentials are not set. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your environment');
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
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limitParam = parseInt(searchParams.get('limit') || '5', 10);
    const after = searchParams.get('after'); // milliseconds timestamp for createdAt

    const limit = Math.min(Math.max(isNaN(limitParam) ? 5 : limitParam, 1), 50); // cap 1..50

    let q = db.collection('orders').orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      q = q.where('status', '==', status);
    }

    if (after) {
      const afterMillis = Number(after);
      if (!isNaN(afterMillis)) {
        const ts = admin.firestore.Timestamp.fromMillis(afterMillis);
        q = q.startAfter(ts);
      }
    }

    q = q.limit(limit);

    const snapshot = await q.get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      // normalize createdAt to millis if present
      const createdAt = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : null;
      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;

    return NextResponse.json(
      { items, nextCursor },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
