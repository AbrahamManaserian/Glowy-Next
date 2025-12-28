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

export async function GET() {
  try {
    const ordersRef = db.collection('orders');

    // Get total count
    const totalSnapshot = await ordersRef.count().get();
    const total = totalSnapshot.data().count;

    // Get counts by status
    const [pendingSnapshot, deliveredSnapshot, failedSnapshot, inTransitSnapshot] = await Promise.all([
      ordersRef.where('status', '==', 'pending').count().get(),
      ordersRef.where('status', '==', 'delivered').count().get(),
      ordersRef.where('status', '==', 'failed').count().get(),
      ordersRef.where('status', '==', 'inTransit').count().get(),
    ]);

    const pending = pendingSnapshot.data().count;
    const delivered = deliveredSnapshot.data().count;
      const failed = failedSnapshot.data().count;
      const inTransit = inTransitSnapshot.data().count;

    return NextResponse.json(
      {
        total,
        pending,
        delivered,
        failed,
        inTransit,
      },
      {
        headers: {
          // Browser: ABSOLUTELY NO CACHING (Always ask server)
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching order counts:', error);
    return NextResponse.json({ error: 'Failed to fetch order counts' }, { status: 500 });
  }
}
