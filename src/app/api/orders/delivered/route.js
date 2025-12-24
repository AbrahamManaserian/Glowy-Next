import { NextResponse } from 'next/server';
import { getCachedDeliveredOrders } from '@/_lib/firebase/getCachedDeliveredOrders';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log('API Received userId for delivered:', userId);

    const orders = await getCachedDeliveredOrders(userId);

    return NextResponse.json(orders, {
      headers: {
        // Browser: ABSOLUTELY NO CACHING (Always ask server)
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',

        // We remove the CDN headers because Next.js is now handling the caching internally.
        // The server will respond quickly because it's reading from its own cache.
      },
    });
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
