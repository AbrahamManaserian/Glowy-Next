import { NextResponse } from 'next/server';
import { getCachedCartItems } from '@/_lib/firebase/getCachedCartItems';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let ids = [];

    // Handle ?ids=1,2,3
    const idsParam = searchParams.get('ids');
    if (idsParam && idsParam.includes(',')) {
      ids = idsParam.split(',');
    } else {
      // Handle ?ids=1&ids=2
      ids = searchParams.getAll('ids');
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    console.log('API Received IDs:', ids);

    // Use the cached version. The cache key is automatically generated based on the arguments (ids).
    // Since 'ids' is an array, we need to make sure the cache key is stable.
    // unstable_cache handles arguments, but sorting them before passing ensures A,B and B,A hit the same cache.
    ids.sort(); 
    const products = await getCachedCartItems(ids);

    return NextResponse.json(products, {
      headers: {
        // Browser: ABSOLUTELY NO CACHING (Always ask server)
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        
        // We remove the CDN headers because Next.js is now handling the caching internally.
        // The server will respond quickly because it's reading from its own cache.
      },
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
